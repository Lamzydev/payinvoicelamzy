import { StatCard, Card, Badge, Button, EmptyState } from '../components/ui/index.jsx';
import { fmt, calcTotal } from '../store/useStore.js';
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FcPaid } from "react-icons/fc";
import { GiDuel } from "react-icons/gi";
import { IoAdd } from "react-icons/io5";

function MiniChart({ data, color = '#f59e0b' }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all duration-300"
          style={{ height: `${Math.max(10, (v / max) * 100)}%`, background: color, opacity: 0.3 + (i / data.length) * 0.7 }} />
      ))}
    </div>
  );
}

export default function Dashboard({ store, setPage }) {
  const { stats, invoices, payments } = store;

  const monthlyRevenue = [1200, 2100, 1800, 3200, 2800, 4100, 3600, 4800, 3900, 5200, 4600, stats.totalRevenue > 0 ? stats.totalRevenue : 4200];

  return (
    <div className="page-enter">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          Good morning 
        </h1>
        <p className="text-sm text-slate-500 font-body mt-1">Here's what's happening with your invoices today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue"  value={fmt(stats.totalRevenue)} icon={[<RiMoneyDollarCircleFill />]} color="amber"   delay="stagger-1" sub="All time" />
        <StatCard label="Outstanding"    value={fmt(stats.outstanding)}  icon={[<GiDuel />]} color="blue"    delay="stagger-2" sub={`${stats.totalPending + stats.totalOverdue} invoices`} />
        <StatCard label="Paid Invoices"  value={stats.totalPaid}         icon={[<FcPaid />]} color="emerald" delay="stagger-3" sub="Completed" />
        <StatCard label="Overdue"        value={stats.totalOverdue}      icon={[<GiDuel />]} color="red"     delay="stagger-4" sub="Action needed" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 p-6 animate-fadeUp stagger-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-base font-bold font-display text-slate-800">Revenue Overview</p>
              <p className="text-xs text-slate-400 font-body mt-0.5">Monthly earnings trend</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">2024</span>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {monthlyRevenue.map((v, i) => {
              const max = Math.max(...monthlyRevenue);
              const pct = Math.max(8, (v / max) * 100);
              const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                    style={{ height: `${pct}%`, background: i === 11 ? '#f59e0b' : '#fef3c7', border: i === 11 ? '1px solid #f59e0b' : 'none' }} />
                  <span className="text-[9px] text-slate-400 font-body">{months[i]}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick stats */}
        <Card className="p-6 animate-fadeUp stagger-3">
          <p className="text-base font-bold font-display text-slate-800 mb-4">Invoice Summary</p>
          <div className="space-y-3">
            {[
              { label: 'Draft',    count: stats.totalDraft,   color: 'bg-slate-100',   text: 'text-slate-600'  },
              { label: 'Pending',  count: stats.totalPending, color: 'bg-amber-100',   text: 'text-amber-700'  },
              { label: 'Paid',     count: stats.totalPaid,    color: 'bg-emerald-100', text: 'text-emerald-700'},
              { label: 'Overdue',  count: stats.totalOverdue, color: 'bg-red-100',     text: 'text-red-700'    },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${s.color.replace('bg-','bg-').replace('-100','-400')}`} />
                  <span className="text-sm font-body text-slate-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color.replace('-100','-400')}`}
                      style={{ width: `${invoices.length ? (s.count / invoices.length) * 100 : 0}%` }} />
                  </div>
                  <span className={`text-xs font-bold font-body ${s.text}`}>{s.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-body mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button onClick={() => setPage('create')}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold font-body transition-all">
                <span> <IoAdd /> </span> Create New Invoice
              </button>
              <button onClick={() => setPage('clients')}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold font-body transition-all">
                <span> <MdOutlineGroupAdd /> </span> Add New Client
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent invoices */}
      <Card className="mt-6 animate-fadeUp stagger-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <p className="text-sm font-bold font-display text-slate-800">Recent Invoices</p>
          <Button variant="ghost" size="sm" onClick={() => setPage('invoices')}>View all </Button>
        </div>
        {stats.recentInvoices.length === 0 ? (
          <EmptyState icon="📄" title="No invoices yet" desc="Create your first invoice to get started" action={<Button onClick={() => setPage('create')}>Create Invoice</Button>} />
        ) : (
          <div className="divide-y divide-slate-50">
            {stats.recentInvoices.map((inv, i) => (
              <div key={inv.id} className={`flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors animate-fadeUp`}
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    <span className="text-sm">📄</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-body text-slate-800">{inv.id}</p>
                    <p className="text-xs text-slate-400 font-body">{inv.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-body hidden sm:block">Due {inv.dueDate}</span>
                  <Badge status={inv.status} />
                  <span className="text-sm font-bold font-body text-slate-800">{fmt(calcTotal(inv.items, inv.tax))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}