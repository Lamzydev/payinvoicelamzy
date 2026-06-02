import { useState } from 'react';
import { Card, Button, Input, PageHeader, SearchInput, EmptyState, ConfirmDialog, Modal } from '../components/ui/index.jsx';
import { genId, fmt, calcTotal } from '../store/Usestore.js';
import { BiEdit } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";

const EMPTY = { name: '', email: '', phone: '', company: '', address: '' };

export default function Clients({ store, setPage, setEditInvoice }) {
  const { clients, addClient, updateClient, deleteClient, invoices } = store;
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [confirm, setConfirm] = useState(null);
  const [detail,  setDetail]  = useState(null);
  const [errors,  setErrors]  = useState({});

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company||'').toLowerCase().includes(q);
  });

  function openAdd()     { setEditing(null); setForm(EMPTY); setErrors({}); setModal(true); }
  function openEdit(c)   { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone||'', company: c.company||'', address: c.address||'' }); setErrors({}); setModal(true); }
  function setF(k, v)    { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); }

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    return e;
  }

  function save() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editing) {
      updateClient(editing.id, { ...form });
    } else {
      addClient({ ...form, id: genId(), createdAt: new Date().toISOString().split('T')[0] });
    }
    setModal(false);
  }

  function clientInvoices(id) { return invoices.filter(i => i.clientId === id); }
  function clientRevenue(id)  { return clientInvoices(id).filter(i => i.status === 'paid').reduce((s, i) => s + calcTotal(i.items, i.tax), 0); }

  const DetailClient = detail ? clients.find(c => c.id === detail) : null;

  return (
    <div className="page-enter">
      <PageHeader title="Clients" subtitle={`${clients.length} clients`}
        action={<Button onClick={openAdd}> <IoAdd /> Add Client</Button>} />

      <div className="mb-5 animate-fadeUp stagger-1">
        <SearchInput value={search} onChange={setSearch} placeholder="Search clients…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="👤" title="No clients yet" desc="Add your first client to get started"
          action={<Button onClick={openAdd}>Add Client</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const invCount = clientInvoices(c.id).length;
            const revenue  = clientRevenue(c.id);
            return (
              <Card key={c.id} hover className={`p-5 animate-fadeUp`} style={{ animationDelay: `${i * 0.05}s` }}>
                <div onClick={() => setDetail(c.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <span className="text-lg font-bold font-display text-amber-700">{c.name[0].toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-body">{c.createdAt}</span>
                  </div>
                  <p className="text-sm font-bold font-body text-slate-900">{c.name}</p>
                  {c.company && <p className="text-xs text-slate-400 font-body mt-0.5">{c.company}</p>}
                  <p className="text-xs text-slate-500 font-body mt-1 truncate">{c.email}</p>

                  <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400 font-body">Invoices</p>
                      <p className="text-sm font-bold font-display text-slate-800">{invCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-body">Revenue</p>
                      <p className="text-sm font-bold font-display text-amber-600">{fmt(revenue)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold font-body text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    <BiEdit /> Edit
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setEditInvoice(null); setPage('create'); }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold font-body text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
                     <FaPlus /> Invoice
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setConfirm(c.id); }}
                    className="w-8 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-50 hover:bg-red-100 transition-colors">
                    <FaDeleteLeft />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Client' : 'New Client'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name *" value={form.name} onChange={e => setF('name', e.target.value)} error={errors.name} placeholder="Jane Smith" />
            <Input label="Company"    value={form.company} onChange={e => setF('company', e.target.value)} placeholder="Acme Corp" />
          </div>
          <Input label="Email *" type="email" value={form.email} onChange={e => setF('email', e.target.value)} error={errors.email} placeholder="jane@acme.com" />
          <Input label="Phone" type="tel"  value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+1 555-0101" />
          <Input label="Address" value={form.address} onChange={e => setF('address', e.target.value)} placeholder="123 Main St, City" />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Add Client'}</Button>
          </div>
        </div>
      </Modal>

      {/* Detail modal */}
      {DetailClient && (
        <Modal open={!!detail} onClose={() => setDetail(null)} title={DetailClient.name} width="max-w-2xl">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              {[['Email', DetailClient.email], ['Phone', DetailClient.phone||'—'], ['Company', DetailClient.company||'—'], ['Address', DetailClient.address||'—'], ['Since', DetailClient.createdAt]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-slate-400 mb-1">{l}</p><p className="font-semibold text-slate-700">{v}</p></div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Invoices</p>
              {clientInvoices(DetailClient.id).length === 0
                ? <p className="text-sm text-slate-400 font-body">No invoices for this client yet.</p>
                : clientInvoices(DetailClient.id).map(inv => (
                    <div key={inv.id} className="flex justify-between items-center py-2 border-b border-slate-50 text-sm font-body">
                      <span className="font-semibold text-slate-700">{inv.id}</span>
                      <span className="text-slate-400">{inv.dueDate}</span>
                      <span className="font-bold text-amber-600">{fmt(calcTotal(inv.items, inv.tax))}</span>
                    </div>
                  ))
              }
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteClient(confirm)}
        title="Delete Client" message="This client will be permanently deleted. Their invoices will remain." />
    </div>
  );
}