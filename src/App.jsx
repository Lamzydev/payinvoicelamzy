import { useState } from 'react';
import Layout      from './components/layout/Layout.jsx';
import Dashboard   from './pages/Dashboard.jsx';
import CreateInvoice from './pages/CreateInvoice.jsx';
import InvoiceList from './pages/InvoiceList.jsx';
import Clients     from './pages/Clients.jsx';
import Payments    from './pages/Payments.jsx';
import Settings    from './pages/Settings.jsx';
import { useStore } from './store/usestore.js';

export default function App() {
  const [page,        setPage]        = useState('dashboard');
  const [editInvoice, setEditInvoice] = useState(null);
  const store = useStore();

  function handleSetPage(p) {
    if (p !== 'create') setEditInvoice(null);
    setPage(p);
  }

  function renderPage() {
    switch (page) {
      case 'dashboard':
        return <Dashboard store={store} setPage={handleSetPage} />;
      case 'create':
        return <CreateInvoice store={store} setPage={handleSetPage} editInvoice={editInvoice} />;
      case 'invoices':
        return <InvoiceList store={store} setPage={handleSetPage} setEditInvoice={setEditInvoice} />;
      case 'clients':
        return <Clients store={store} setPage={handleSetPage} setEditInvoice={setEditInvoice} />;
      case 'payments':
        return <Payments store={store} />;
      case 'settings':
        return <Settings store={store} />;
      default:
        return <Dashboard store={store} setPage={handleSetPage} />;
    }
  }

  return (
    <Layout page={page} setPage={handleSetPage}>
      {renderPage()}
    </Layout>
  );
}