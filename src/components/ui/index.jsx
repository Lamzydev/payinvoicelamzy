// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ status }) {
  const map = {
    paid:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Paid'    },
    pending: { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Pending' },
    overdue: { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500',     label: 'Overdue' },
    draft:   { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400',   label: 'Draft'   },
  };
  const s = map[status] || map.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary:  'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow-md active:scale-95',
    secondary:'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm',
    danger:   'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    ghost:    'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
    success:  'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-600 font-body">{label}</label>}
      <input
        className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-sm text-slate-800 bg-white placeholder:text-slate-400
          border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400
          transition-all duration-150 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-body">{error}</span>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-600 font-body">{label}</label>}
      <select
        className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-sm text-slate-800 bg-white
          border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400
          transition-all duration-150 appearance-none cursor-pointer ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500 font-body">{error}</span>}
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────
export function Textarea({ label, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-600 font-body">{label}</label>}
      <textarea
        className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-sm text-slate-800 bg-white
          border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400
          transition-all duration-150 resize-none ${className}`}
        rows={3}
        {...props}
      />
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-card ${hover ? 'hover:shadow-card-hover transition-shadow duration-300 cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, color, delay = '' }) {
  const colors = {
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-500',   border: 'border-amber-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100' },
    red:     { bg: 'bg-red-50',     icon: 'text-red-500',     border: 'border-red-100' },
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500',    border: 'border-blue-100' },
    slate:   { bg: 'bg-slate-50',   icon: 'text-slate-500',   border: 'border-slate-100' },
  };
  const c = colors[color] || colors.amber;
  return (
    <Card className={`p-5 animate-fadeUp ${delay}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <span className={`text-lg ${c.icon}`}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold font-display text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-slate-500 font-body mt-1 uppercase tracking-wide">{label}</p>
      {sub && <p className="text-xs text-slate-400 font-body mt-0.5">{sub}</p>}
    </Card>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">{icon}</div>
      <p className="text-base font-semibold font-display text-slate-700">{title}</p>
      <p className="text-sm text-slate-400 font-body mt-1 max-w-xs">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-2xl shadow-float w-full ${width} animate-scaleIn overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold font-display text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 font-body mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Search Input ────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 font-body text-sm text-slate-800 bg-white w-full
          focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all duration-150"
      />
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <p className="text-sm text-slate-600 font-body mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>Delete</Button>
      </div>
    </Modal>
  );
}