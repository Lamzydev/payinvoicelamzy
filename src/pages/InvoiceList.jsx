import { useState } from 'react';
import { Badge, Button, Card, SearchInput, EmptyState, ConfirmDialog, Modal, PageHeader } from '../components/ui/index.jsx';
import { fmt, calcTotal } from '../store/useStore.js';
import { TbFileInvoiceFilled } from "react-icons/tb";
import { MdEditSquare } from "react-icons/md";
import { MdCloudDone } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { FaDeleteLeft } from "react-icons/fa6";
import { FcPaid } from "react-icons/fc";

const STATUSES = ['all', 'draft', 'pending', 'paid', 'overdue'];

export default function InvoiceList({ store, setPage, setEditInvoice }) {
  const { invoices, deleteInvoice, updateInvoice, addPayment } = store;
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [sortBy,  setSortBy]  = useState('issueDate');
  const [confirm, setConfirm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [payModal,setPayModal]= useState(null);
  const [payAmt,  setPayAmt]  = useState('');

  const filtered = invoices
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i => {
      const q = search.toLowerCase();
      return !q || i.id.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'amount') return calcTotal(b.items, b.tax) - calcTotal(a.items, a.tax);
      return b[sortBy]?.localeCompare(a[sortBy]) || 0;
    });

  function markPaid(inv) {
    setPayModal(inv);
    setPayAmt(calcTotal(inv.items, inv.tax).toFixed(2));
  }

  function confirmPayment() {
    if (!payModal) return;
    updateInvoice(payModal.id, { status: 'paid' });
    addPayment({
      id: `p${Date.now()}`,
      invoiceId: payModal.id,
      clientName: payModal.clientName,
      amount: parseFloat(payAmt) || calcTotal(payModal.items, payModal.tax),
      method: 'Manual',
      date: new Date().toISOString().split('T')[0],
      note: 'Marked as paid',
    });
    setPayModal(null);
  }

  return (
    <div className="page-enter">
      <PageHeader title="Invoices" subtitle={`${invoices.length} total invoices`}
        action={<Button onClick={() => setPage('create')}> <IoAdd /> New Invoice</Button>} />

      {/* Filters */}
      <Card className="p-4 mb-5 animate-fadeUp stagger-1">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by ID or client…" />
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold font-body capitalize transition-all
                  ${filter === s ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s === 'all' ? `All (${invoices.length})` : s}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold font-body text-slate-600 bg-white focus:outline-none cursor-pointer">
            <option value="issueDate">Sort: Date</option>
            <option value="dueDate">Sort: Due</option>
            <option value="amount">Sort: Amount</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="animate-fadeUp stagger-2 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon="📄" title="No invoices found" desc="Try changing your filters or create a new invoice"
            action={<Button onClick={() => setPage('create')}>Create Invoice</Button>} />
        ) : (
          <>
            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50">
              {['Invoice','Client','Issue Date','Due Date','Status','Amount',''].map((h, i) => (
                <div key={i} className={`text-xs font-bold font-body uppercase tracking-wide text-slate-400 ${i === 4 ? 'col-span-2' : i === 5 ? 'col-span-2 text-right' : i === 6 ? 'col-span-1' : 'col-span-2'}`}>{h}</div>
              ))}
            </div>

            <div className="divide-y divide-slate-50">
              {filtered.map((inv, idx) => {
                const total = calcTotal(inv.items, inv.tax);
                return (
                  <div key={inv.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors animate-fadeUp cursor-pointer"
                    style={{ animationDelay: `${idx * 0.04}s` }}
                    onClick={() => setPreview(inv)}
                  >
                    {/* Mobile: stacked layout */}
                    <div className="md:hidden flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold font-body text-slate-800">{inv.id}</p>
                        <p className="text-xs text-slate-400">{inv.clientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{fmt(total)}</p>
                        <Badge status={inv.status} />
                      </div>
                    </div>

                    {/* Desktop: row layout */}
                    <div className="hidden md:flex col-span-2 items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold bg-red-500"> <TbFileInvoiceFilled /> </span>
                      </div>
                      <span className="text-sm font-bold font-body text-slate-800">{inv.id}</span>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center">
                      <span className="text-sm font-body text-slate-600 truncate">{inv.clientName}</span>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center">
                      <span className="text-xs text-slate-500 font-body">{inv.issueDate}</span>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center">
                      <span className={`text-xs font-body ${inv.status === 'overdue' ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>{inv.dueDate}</span>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center">
                      <Badge status={inv.status} />
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-end">
                      <span className="text-sm font-bold font-display text-slate-900">{fmt(total)}</span>
                    </div>
                    {/* Actions */}
                    <div className="hidden md:flex col-span-1 items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setEditInvoice(inv); setPage('create'); }}
                        className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 text-xs transition-colors" title="Edit">< MdEditSquare/> </button>
                      {inv.status !== 'paid' && (
                        <button onClick={() => markPaid(inv)}
                          className="w-7 h-7 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 text-xs transition-colors" title="Mark paid"> <FcPaid /> </button>
                      )}
                      <button onClick={() => setConfirm(inv.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 text-xs transition-colors" title="Delete"> <FaDeleteLeft /> </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Preview modal */}
      {preview && (
        <Modal open={!!preview} onClose={() => setPreview(null)} title={`Invoice ${preview.id}`} width="max-w-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              <div><p className="text-xs text-slate-400 mb-1">Client</p><p className="font-semibold text-slate-800">{preview.clientName}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Status</p><Badge status={preview.status} /></div>
              <div><p className="text-xs text-slate-400 mb-1">Issue Date</p><p className="font-semibold">{preview.issueDate}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Due Date</p><p className="font-semibold">{preview.dueDate}</p></div>
            </div>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {preview.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 px-4 py-2.5 border-t border-slate-50 text-sm font-body">
                  <div className="col-span-6 text-slate-700">{item.desc}</div>
                  <div className="col-span-2 text-center text-slate-500">{item.qty}</div>
                  <div className="col-span-2 text-right text-slate-500">{fmt(item.rate)}</div>
                  <div className="col-span-2 text-right font-semibold text-slate-800">{fmt(item.qty * item.rate)}</div>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">Total</span>
                <span className="text-lg font-bold font-display text-amber-600">{fmt(calcTotal(preview.items, preview.tax))}</span>
              </div>
            </div>
            {preview.notes && <p className="text-xs text-slate-500 font-body bg-slate-50 rounded-xl p-3">{preview.notes}</p>}
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => { setEditInvoice(preview); setPreview(null); setPage('create'); }}><MdEditSquare /> Edit</Button>
              {preview.status !== 'paid' && <Button variant="success" onClick={() => { markPaid(preview); setPreview(null); }}><MdCloudDone /> Mark Paid</Button>}
            </div>
          </div>
        </Modal>
      )}

      {/* Pay modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Record Payment" width="max-w-sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-body">Record payment for <strong>{payModal?.id}</strong></p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 font-body">Amount ($)</label>
            <input type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setPayModal(null)}>Cancel</Button>
            <Button variant="success" onClick={confirmPayment}>Confirm Payment </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deleteInvoice(confirm)}
        title="Delete Invoice" message="This invoice will be permanently deleted. This cannot be undone." />
    </div>
  );
}