import { useState } from 'react';
import { Input, Select, Textarea, Button, Card } from '../components/ui/index.jsx';
import { calcSubtotal, calcTotal, nextInvoiceId, genId, fmt } from '../store/useStore.js';
import { FaRegSave } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const EMPTY_ITEM = { id: genId(), desc: '', qty: 1, rate: '' };

export default function CreateInvoice({ store, setPage, editInvoice = null }) {
  const { clients, addInvoice, updateInvoice } = store;
  const isEdit = !!editInvoice;

  const [form, setForm] = useState({
    clientId:    editInvoice?.clientId    || '',
    clientName:  editInvoice?.clientName  || '',
    issueDate:   editInvoice?.issueDate   || new Date().toISOString().split('T')[0],
    dueDate:     editInvoice?.dueDate     || '',
    status:      editInvoice?.status      || 'draft',
    tax:         editInvoice?.tax         ?? 0,
    notes:       editInvoice?.notes       || '',
    items:       editInvoice?.items?.map(i => ({ ...i, id: genId() })) || [{ ...EMPTY_ITEM }],
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })); }

  function selectClient(id) {
    const c = clients.find(c => c.id === id);
    setField('clientId', id);
    setField('clientName', c ? c.name : '');
  }

  function addItem()        { setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM, id: genId() }] })); }
  function removeItem(id)   { setForm(f => ({ ...f, items: f.items.filter(i => i.id !== id) })); }
  function setItem(id, k, v){ setForm(f => ({ ...f, items: f.items.map(i => i.id === id ? { ...i, [k]: v } : i) })); }

  function validate() {
    const e = {};
    if (!form.clientId)  e.clientId  = 'Select a client';
    if (!form.issueDate) e.issueDate = 'Required';
    if (!form.dueDate)   e.dueDate   = 'Required';
    if (form.items.some(i => !i.desc)) e.items = 'All items need a description';
    return e;
  }

  function save(status) {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const id = isEdit ? editInvoice.id : nextInvoiceId(store.invoices);
    const inv = { ...form, id, status: status || form.status, items: form.items.map(({ id: _, ...rest }) => rest) };
    if (isEdit) updateInvoice(inv.id, inv);
    else addInvoice(inv);
    setSaved(true);
    setTimeout(() => setPage('invoices'), 800);
  }

  const subtotal = calcSubtotal(form.items);
  const taxAmt   = subtotal * ((parseFloat(form.tax) || 0) / 100);
  const total    = subtotal + taxAmt;

  return (
    <div className="page-enter max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">{isEdit ? 'Edit Invoice' : 'New Invoice'}</h1>
          <p className="text-sm text-slate-500 font-body mt-1">{isEdit ? `Editing ${editInvoice.id}` : `Draft · ${nextInvoiceId(store.invoices)}`}</p>
        </div>
        <Button variant="secondary" onClick={() => setPage('invoices')}> <IoArrowBackCircleSharp /> Back</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Client + dates */}
          <Card className="p-6">
            <p className="text-sm font-bold font-display text-slate-700 mb-4">Invoice Details</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Client *" value={form.clientId} onChange={e => selectClient(e.target.value)} error={errors.clientId}>
                <option value="">Select a client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
              <Select label="Status" value={form.status} onChange={e => setField('status', e.target.value)}>
                {['draft','pending','paid','overdue'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </Select>
              <Input label="Issue Date *" type="date" value={form.issueDate} onChange={e => setField('issueDate', e.target.value)} error={errors.issueDate} />
              <Input label="Due Date *"   type="date" value={form.dueDate}   onChange={e => setField('dueDate',   e.target.value)} error={errors.dueDate} />
            </div>
          </Card>

          {/* Line items */}
          <Card className="p-6">
            <p className="text-sm font-bold font-display text-slate-700 mb-4">Line Items</p>
            {errors.items && <p className="text-xs text-red-500 mb-3">{errors.items}</p>}

            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 mb-2 px-1">
              <span className="col-span-6 text-xs font-semibold text-slate-400 uppercase font-body">Description</span>
              <span className="col-span-2 text-xs font-semibold text-slate-400 uppercase font-body text-center">Qty</span>
              <span className="col-span-3 text-xs font-semibold text-slate-400 uppercase font-body text-right">Rate ($)</span>
              <span className="col-span-1" />
            </div>

            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start animate-fadeUp" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className="col-span-6">
                    <input value={item.desc} onChange={e => setItem(item.id, 'desc', e.target.value)}
                      placeholder="Service or product…"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="1" value={item.qty} onChange={e => setItem(item.id, 'qty', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-800 bg-white text-center focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
                  </div>
                  <div className="col-span-3">
                    <input type="number" min="0" step="0.01" value={item.rate} onChange={e => setItem(item.id, 'rate', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-800 bg-white text-right focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
                  </div>
                  <div className="col-span-1 flex justify-center pt-2.5">
                    {form.items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition-colors text-sm">✕</button>
                    )}
                  </div>
                  {/* Amount preview */}
                  <div className="col-span-11 col-start-2">
                    {item.qty && item.rate && (
                      <p className="text-xs text-slate-400 font-body text-right pr-8">
                        = {fmt((parseFloat(item.qty)||0) * (parseFloat(item.rate)||0))}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addItem}
              className="mt-4 flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-semibold font-body transition-colors">
              <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs"><FaPlus /></span>
              Add Line Item
            </button>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <Textarea label="Notes / Payment Terms" value={form.notes} onChange={e => setField('notes', e.target.value)}
              placeholder="Payment due within 30 days. Thank you for your business!" />
          </Card>
        </div>

        {/* Right: summary + actions */}
        <div className="space-y-5">
          {/* Tax */}
          <Card className="p-5">
            <p className="text-sm font-bold font-display text-slate-700 mb-4">Tax</p>
            <Input label="Tax Rate (%)" type="number" min="0" max="100" step="0.1"
              value={form.tax} onChange={e => setField('tax', e.target.value)}
              placeholder="0" />
          </Card>

          {/* Totals */}
          <Card className="p-5">
            <p className="text-sm font-bold font-display text-slate-700 mb-4">Summary</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-body text-slate-600">
                <span>Subtotal</span><span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              {taxAmt > 0 && (
                <div className="flex justify-between text-sm font-body text-slate-600">
                  <span>Tax ({form.tax}%)</span><span>{fmt(taxAmt)}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="text-sm font-bold font-body text-slate-800">Total</span>
                <span className="text-lg font-bold font-display text-amber-600">{fmt(total)}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            {saved ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-sm font-semibold text-emerald-700 font-body animate-scaleIn">
                <FaRegSave /> Saved! Redirecting…
              </div>
            ) : (
              <>
                <Button className="w-full" onClick={() => save('pending')}>
                  {isEdit ? '💾 Save Changes' : ' Save & Send'}
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => save('draft')}>
                  <FaRegSave /> Save as Draft
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}