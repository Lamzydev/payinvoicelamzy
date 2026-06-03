import { useState, useCallback } from 'react';

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_CLIENTS = [
  { id: 'c1', name: 'AppClick NG',        email: 'appclick@appclickict.ng', phone: '+234-9074567',   address: '630 Aare Avenue Bodija, Ibadan, Oyo State', company: 'AppClick Ict',   createdAt: '2026-03-15' },
  { id: 'c2', name: 'TechStart Inc',      email: 'accounts@techstart.io',   phone: '+1 555-0102',    address: '456 Innovation Ave, San Francisco, CA',     company: 'TechStart Inc',  createdAt: '2024-02-20' },
  { id: 'c3', name: 'Global Media Ltd',   email: 'finance@globalmedia.co',  phone: '+1 555-0103',    address: '789 Broadcast Blvd, Austin, TX',            company: 'Global Media Ltd',createdAt: '2024-03-10' },
  { id: 'c4', name: 'Nova Solutions',     email: 'pay@novasol.com',         phone: '+1 555-0104',    address: '321 Enterprise Rd, Chicago, IL',            company: 'Nova Solutions',  createdAt: '2025-04-05' },
  { id: 'c5', name: 'Item7Go Restaurant', email: 'items7go@res.com',        phone: '+234-81637390',  address: '321 Ring Rd, Ibadan, Oyo State',            company: 'Item7Go',         createdAt: '2026-06-05' },
  { id: 'c6', name: 'Kings Burger',       email: 'kingsburger@burger.com',  phone: '+234-80378392',  address: '107 Ring Rd, Ibadan, Oyo State',            company: 'King Burger',     createdAt: '2026-06-05' },
];

const SEED_INVOICES = [
  // ✅ Fixed: removed duplicate INV-006 ids — each invoice now has a unique id
  { id: 'INV-001', clientId: 'c1', clientName: 'AppClick NG',         issueDate: '2026-05-30', dueDate: '2026-06-30', status: 'paid',    items: [{ desc: 'Web Design',     qty: 2,  rate: 3500 }, { desc: 'Logo Design', qty: 1, rate: 800 }], notes: 'Thank you!',  tax: 10 },
  { id: 'INV-002', clientId: 'c2', clientName: 'TechStart Inc',       issueDate: '2024-11-10', dueDate: '2024-12-10', status: 'pending', items: [{ desc: 'Frontend Dev',   qty: 40, rate: 85  }, { desc: 'API Integration', qty: 20, rate: 95 }], notes: '',            tax: 0  },
  { id: 'INV-003', clientId: 'c3', clientName: 'Global Media Ltd',    issueDate: '2024-11-15', dueDate: '2024-12-15', status: 'overdue', items: [{ desc: 'Video Editing',  qty: 10, rate: 120 }], notes: 'Net 30',      tax: 5  },
  { id: 'INV-004', clientId: 'c4', clientName: 'Nova Solutions',      issueDate: '2024-12-01', dueDate: '2024-12-31', status: 'draft',   items: [{ desc: 'Consulting',     qty: 8,  rate: 150 }], notes: '',            tax: 0  },
  { id: 'INV-005', clientId: 'c1', clientName: 'AppClick NG',         issueDate: '2024-12-05', dueDate: '2025-01-05', status: 'paid',    items: [{ desc: 'SEO Audit',      qty: 1,  rate: 1200}], notes: '',            tax: 10 },
  { id: 'INV-006', clientId: 'c2', clientName: 'TechStart Inc',       issueDate: '2024-12-10', dueDate: '2025-01-10', status: 'pending', items: [{ desc: 'Mobile App Dev', qty: 60, rate: 90  }], notes: 'Milestone 1', tax: 0  },
  { id: 'INV-007', clientId: 'c5', clientName: 'Item7Go Restaurant',  issueDate: '2026-07-10', dueDate: '2026-08-10', status: 'pending', items: [{ desc: 'Fast Foods',     qty: 60, rate: 90  }], notes: 'Milestone 1', tax: 0  },
  { id: 'INV-008', clientId: 'c6', clientName: 'Kings Burger',        issueDate: '2026-05-30', dueDate: '2026-06-30', status: 'pending', items: [{ desc: 'Fast Foods',     qty: 100,rate: 90  }], notes: 'Milestone 1', tax: 0  },
];

const SEED_PAYMENTS = [
  { id: 'p1', invoiceId: 'INV-001', clientName: 'AppClick NG', amount: 8580,  method: 'Bank Transfer', date: '2026-06-28', note: 'Full payment' },
  { id: 'p2', invoiceId: 'INV-005', clientName: 'AppClick NG', amount: 1320,  method: 'Credit Card',   date: '2025-01-04', note: '' },
];

// ── localStorage helpers ───────────────────────────────────────────────────────
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Helpers (exported for use in pages) ───────────────────────────────────────
export function calcSubtotal(items) {
  return items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0), 0);
}

export function calcTotal(items, tax) {
  const sub = calcSubtotal(items);
  return sub + sub * ((parseFloat(tax) || 0) / 100);
}

export function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
}

export function nextInvoiceId(invoices) {
  const nums = invoices.map(i => parseInt(i.id.replace('INV-', ''), 10)).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `INV-${String(next).padStart(3, '0')}`;
}

export function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Main store hook ────────────────────────────────────────────────────────────
export function useStore() {
  const [invoices, setInvoicesRaw] = useState(() => load('inv_invoices', SEED_INVOICES));
  const [clients,  setClientsRaw]  = useState(() => load('inv_clients',  SEED_CLIENTS));
  const [payments, setPaymentsRaw] = useState(() => load('inv_payments', SEED_PAYMENTS));
  const [settings, setSettingsRaw] = useState(() => load('inv_settings', {
    businessName:    'My Business',
    businessEmail:   'hello@mybusiness.com',
    businessPhone:   '',
    businessAddress: '',
    currency:        'USD',
    taxLabel:        'Tax',
    defaultTax:      0,
    logoUrl:         '',
    primaryColor:    '#f59e0b',
    paymentTerms:    'Net 30',
    invoiceNotes:    'Thank you for your business!',
  }));

  // ── Setters with auto-persist ─────────────────────────────────────────────
  const setInvoices = (v) => { const nv = typeof v === 'function' ? v(invoices) : v; setInvoicesRaw(nv); save('inv_invoices', nv); };
  const setClients  = (v) => { const nv = typeof v === 'function' ? v(clients)  : v; setClientsRaw(nv);  save('inv_clients',  nv); };
  const setPayments = (v) => { const nv = typeof v === 'function' ? v(payments) : v; setPaymentsRaw(nv); save('inv_payments', nv); };
  const setSettings = (v) => { const nv = typeof v === 'function' ? v(settings) : v; setSettingsRaw(nv); save('inv_settings', nv); };

  // ── Invoice actions ───────────────────────────────────────────────────────
  const addInvoice    = (inv) => setInvoices(p => [...p, inv]);
  const updateInvoice = (id, data) => setInvoices(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteInvoice = (id) => setInvoices(p => p.filter(i => i.id !== id));

  // ── Client actions ────────────────────────────────────────────────────────
  const addClient    = (c) => setClients(p => [...p, c]);
  const updateClient = (id, data) => setClients(p => p.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteClient = (id) => setClients(p => p.filter(c => c.id !== id));

  // ── Payment actions ───────────────────────────────────────────────────────
  const addPayment    = (p) => setPayments(prev => [...prev, p]);
  const deletePayment = (id) => setPayments(p => p.filter(x => x.id !== id));

  // ── Computed stats ────────────────────────────────────────────────────────
  const stats = {
    totalRevenue:   payments.reduce((s, p) => s + p.amount, 0),
    totalPaid:      invoices.filter(i => i.status === 'paid').length,
    totalPending:   invoices.filter(i => i.status === 'pending').length,
    totalOverdue:   invoices.filter(i => i.status === 'overdue').length,
    totalDraft:     invoices.filter(i => i.status === 'draft').length,
    totalClients:   clients.length,
    outstanding:    invoices
                      .filter(i => ['pending', 'overdue'].includes(i.status))
                      .reduce((s, i) => s + calcTotal(i.items, i.tax), 0),
    recentInvoices: [...invoices]
                      .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
                      .slice(0, 5),
  };

  return {
    invoices, clients, payments, settings,
    addInvoice, updateInvoice, deleteInvoice,
    addClient,  updateClient,  deleteClient,
    addPayment, deletePayment,
    setSettings,
    stats,
  };
}