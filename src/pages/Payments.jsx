import { useState } from 'react';
import { Card, Badge, Button, PageHeader, SearchInput, EmptyState, ConfirmDialog, StatCard, Modal } from '../components/ui/index.jsx';
import { fmt, genId, calcTotal } from '../store/useStore.js';
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { CiCreditCard1 } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";

const METHODS = ['Bank Transfer', 'Credit Card', 'Cash', 'PayPal', 'Stripe', 'Manual', 'Other'];

export default function Payments({ store }) {
  const { payments, invoices, deletePayment, addPayment } = store;
  const [search,  setSearch]  = useState('');
  const [confirm, setConfirm] = useState(null);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({ invoiceId: '', amount: '', method: 'Bank Transfer', date: new Date().toISOString().split('T')[0], note: '' });
  const [errors,  setErrors]  = useState({});

  const filtered = payments
    .filter(p => {
      const q = search.toLowerCase();
      return !q || p.invoiceId.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.method.toLowerCase().includes(q);
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalRevenue   = payments.reduce((s, p) => s + p.amount, 0);
  const thisMonth      = payments.filter(p => p.date.startsWith(new Date().toISOString().slice(0,7))).reduce((s,p) => s+p.amount, 0);
  const avgPayment     = payments.length ? totalRevenue / payments.length : 0;

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); }

  function selectInvoice(id) {
    const inv = invoices.find(i => i.id === id);
    setF('invoiceId', id);
    if (inv) setF('amount', calcTotal(inv.items, inv.tax).toFixed(2));
  }

  function validate() {
    const e = {};
    if (!form.invoiceId) e.invoiceId = 'Select an invoice';
    if (!form.amount)    e.amount    = 'Enter amount';
    if (!form.date)      e.date      = 'Enter date';
    return e;
  }

  function save() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const inv = invoices.find(i => i.id === form.invoiceId);
    addPayment({ ...form, id: `p${Date.now()}`, clientName: inv?.clientName || '', amount: parseFloat(form.amount) });
    setModal(false);
    setForm({ invoiceId: '', amount: '', method: 'Bank Transfer', date: new Date().toISOString().split('T')[0], note: '' });
  }

  return (
    <div className="page-enter">
      <PageHeader title="Payment History" subtitle="Track all received payments"
        action={<Button onClick={() => setModal(true)}>＋ Record Payment</Button>} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Received" value={fmt(totalRevenue)} icon={<RiMoneyDollarCircleFill />} color="amber"   delay="stagger-1" />
        <StatCard label="This Month"     value={fmt(thisMonth)}    icon={<MdOutlineCalendarMonth />} color="emerald" delay="stagger-2" />
        <StatCard label="Avg. Payment"   value={fmt(avgPayment)}   icon={<MdOutlinePayment />} color="blue"    delay="stagger-3" sub={`${payments.length} payments`} />
      </div>

      {/* Search */}
      <div className="mb-4 animate-fadeUp stagger-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search payments…" />
      </div>

      {/* List */}
      <Card className="animate-fadeUp stagger-3 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={<CiCreditCard1 />} title="No payments recorded" desc="Record your first payment to track revenue"
            action={<Button onClick={() => setModal(true)}>Record Payment</Button>} />
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50">
              {['Date','Invoice','Client','Method','Amount',''].map((h, i) => (
                <div key={i} className={`text-xs font-bold font-body uppercase tracking-wide text-slate-400 ${[2,2,2,2,2,2][i] ? 'col-span-2' : 'col-span-2'}`}>{h}</div>
              ))}
            </div>

            <div className="divide-y divide-slate-50">
              {filtered.map((p, idx) => (
                <div key={p.id} className={`flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors animate-fadeUp`}
                  style={{ animationDelay: `${idx * 0.04}s` }}>

                  {/* Mobile */}
                  <div className="md:hidden flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold font-body text-slate-800">{p.invoiceId}</p>
                      <p className="text-xs text-slate-400">{p.clientName} · {p.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">{fmt(p.amount)}</p>
                      <p className="text-xs text-slate-400">{p.date}</p>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:flex col-span-2 items-center">
                    <span className="text-sm font-body text-slate-600">{p.date}</span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-xs"> <CiCreditCard1/> </div>
                    <span className="text-sm font-bold font-body text-slate-800">{p.invoiceId}</span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center">
                    <span className="text-sm text-slate-600 font-body truncate">{p.clientName}</span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center">
                    <span className="text-xs bg-slate-100 text-slate-600 font-semibold font-body px-2.5 py-1 rounded-full">{p.method}</span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center">
                    <span className="text-sm font-bold font-display text-emerald-600">{fmt(p.amount)}</span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center justify-end">
                    <button onClick={() => setConfirm(p.id)}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 text-xs transition-colors"><FaDeleteLeft /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="text-sm font-semibold font-body text-slate-600">{filtered.length} payment{filtered.length !== 1 ? 's' : ''}</span>
              <span className="text-base font-bold font-display text-emerald-600">
                Total: {fmt(filtered.reduce((s, p) => s + p.amount, 0))}
              </span>
            </div>
          </>
        )}
      </Card>

      {/* Record payment modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Record Payment">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 font-body">Invoice </label>
            <select value={form.invoiceId} onChange={e => selectInvoice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-body text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none">
              <option value="">Select invoice…</option>
              {invoices.filter(i => i.status !== 'paid').map(i => (
                <option key={i.id} value={i.id}>{i.id} — {i.clientName} ({fmt(calcTotal(i.items, i.tax))})</option>
              ))}
            </select>
            {errors.invoiceId && <span className="text-xs text-red-500">{errors.invoiceId}</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 font-body">Amount ($) *</label>
              <input type="number" value={form.amount} onChange={e => setF('amount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400" />
              {errors.amount && <span className="text-xs text-red-500">{errors.amount}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 font-body">Date *</label>
              <input type="date" value={form.date} onChange={e => setF('date', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 font-body">Payment Method</label>
            <select value={form.method} onChange={e => setF('method', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-body text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none">
              {METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 font-body">Note (optional)</label>
            <input value={form.note} onChange={e => setF('note', e.target.value)} placeholder="Payment reference or notes…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="success" onClick={save}> Record Payment</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deletePayment(confirm)}
        title="Delete Payment" message="This payment record will be permanently deleted." />
    </div>
  );
}