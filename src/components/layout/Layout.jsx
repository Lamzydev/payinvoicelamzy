import { useState } from 'react';
import { useTheme } from '../../store/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',      icon: '◈' },
  { id: 'create',      label: 'Create Invoice',  icon: '＋' },
  { id: 'invoices',    label: 'Invoices',        icon: '≡'  },
  { id: 'clients',     label: 'Clients',         icon: '◎'  },
  { id: 'payments',    label: 'Payments',        icon: '◉'  },
  { id: 'settings',    label: 'Settings',        icon: '⚙'  },
];

export default function Layout({ page, setPage, children }) {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { isDark } = useTheme();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b dark:border-slate-700 border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold font-display">PY</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold font-display dark:text-white text-slate-900 leading-none">PayInvoice</p>
            <p className="text-[10px] dark:text-slate-400 text-slate-400 font-body mt-0.5">Smart invoicing</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMobileOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                transition-all duration-150 group
                ${active
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <span className={`text-base flex-shrink-0 ${active ? 'text-white' : 'dark:text-slate-500 text-slate-400 group-hover:text-current'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="text-sm font-semibold font-body">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme toggle + collapse */}
      <div className="px-3 py-4 border-t dark:border-slate-700 border-slate-100 space-y-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-body dark:text-slate-400 text-slate-500">
              {isDark ? 'Dark mode' : 'Light mode'}
            </span>
            <ThemeToggle size="sm" />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <ThemeToggle size="sm" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <span className="text-sm">{collapsed ? '→' : '←'}</span>
          {!collapsed && <span className="text-xs font-body">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen dark:bg-slate-900 bg-slate-50 overflow-hidden">

      {/* Desktop sidebar */}
      <aside className={`
        hidden md:flex flex-col flex-shrink-0
        dark:bg-slate-800 dark:border-slate-700
        bg-white border-r border-slate-100
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-56'}
      `}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/50" />
          <aside className="relative w-64 dark:bg-slate-800 bg-white h-full shadow-float z-50"
            onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 dark:bg-slate-800 dark:border-slate-700 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg dark:hover:bg-slate-700 hover:bg-slate-100 flex items-center justify-center"
            >
              <span className="dark:text-slate-300 text-slate-600 text-sm">☰</span>
            </button>
            <div>
              <p className="text-sm font-bold font-display dark:text-white text-slate-900">
                {NAV.find(n => n.id === page)?.label}
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle in topbar (visible on mobile, hidden on desktop where sidebar has it) */}
            <div className="md:hidden">
              <ThemeToggle size="md" />
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto dark:bg-slate-900">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}