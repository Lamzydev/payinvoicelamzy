import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HeroSection from './HeroSection.jsx'
import { ThemeProvider } from './store/ThemeContext.jsx'

// ── Session helpers ───────────────────────────────────────────────────────────
function getSession() {
  try { return JSON.parse(localStorage.getItem('inv_session') || 'null'); }
  catch { return null; }
}

// ── Root router ───────────────────────────────────────────────────────────────
function AppShell() {
  const [user, setUser] = useState(getSession);

  // Logged in → show invoice dashboard
  if (user) {
    return (
      <ThemeProvider>
        <App user={user} onLogout={() => {
          localStorage.removeItem('inv_session');
          setUser(null);
        }} />
      </ThemeProvider>
    );
  }

  // Not logged in → show landing/hero page
  return <HeroSection onEnterApp={setUser} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
)