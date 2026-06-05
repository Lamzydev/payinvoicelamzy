import { useState, useEffect, useRef } from "react";

// ── Auth helpers ──────────────────────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem("inv_users") || "[]"); } catch { return []; }
}
function saveUsers(u) { localStorage.setItem("inv_users", JSON.stringify(u)); }
function getSession() {
  try { return JSON.parse(localStorage.getItem("inv_session") || "null"); } catch { return null; }
}
function saveSession(u) { localStorage.setItem("inv_session", JSON.stringify(u)); }
function clearSession() { localStorage.removeItem("inv_session"); }

// ── Counter animation ─────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / 2000, 1);
          const ep = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(ep * end));
          if (p < 1) requestAnimationFrame(tick); else setCount(end);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection({ onEnterApp }) {
  const [session, setSession] = useState(getSession);
  const [modal, setModal]     = useState(null);
  const [tab, setTab]         = useState("login");
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function openModal(type) {
    setModal(type); setTab(type);
    setForm({ name: "", email: "", password: "" });
    setError(""); setSuccess(""); setMenuOpen(false);
  }
  function closeModal() { setModal(null); setError(""); setSuccess(""); }
  function setF(k, v)   { setForm(f => ({ ...f, [k]: v })); setError(""); }

  function handleRegister() {
    if (!form.name.trim())  return setError("Full name is required.");
    if (!form.email.trim()) return setError("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    const users = getUsers();
    if (users.find(u => u.email === form.email)) return setError("This email is already registered.");
    const nu = { id: Date.now(), name: form.name, email: form.email, password: form.password };
    saveUsers([...users, nu]);
    const s = { id: nu.id, name: nu.name, email: nu.email };
    saveSession(s); setSession(s);
    setSuccess(`Welcome, ${nu.name}! Account created.`);
    setTimeout(() => { closeModal(); if (onEnterApp) onEnterApp(s); }, 1100);
  }

  function handleLogin() {
    if (!form.email.trim()) return setError("Email is required.");
    if (!form.password)     return setError("Password is required.");
    const user = getUsers().find(u => u.email === form.email && u.password === form.password);
    if (!user) return setError("Invalid email or password.");
    const s = { id: user.id, name: user.name, email: user.email };
    saveSession(s); setSession(s);
    setSuccess(`Welcome back, ${user.name}!`);
    setTimeout(() => { closeModal(); if (onEnterApp) onEnterApp(s); }, 900);
  }

  function handleLogout() { clearSession(); setSession(null); }

  const FEATURES = [
    { icon: "⚡", title: "Instant Invoices",    desc: "Create professional invoices in under 60 seconds with line items, tax, and notes." },
    { icon: "📊", title: "Payment Tracking",     desc: "Know exactly what's paid, pending, or overdue — all updated in real time." },
    { icon: "👥", title: "Client Management",    desc: "Store client details, view history, and manage relationships effortlessly." },
    { icon: "🌙", title: "Dark & Light Mode",    desc: "Switch themes anytime. Easy on the eyes for those late-night invoicing sessions." },
    { icon: "💾", title: "Works Offline",        desc: "All data saved locally — no internet needed. Your data stays private." },
    { icon: "📱", title: "Mobile Ready",         desc: "Fully responsive. Manage your invoices from any device, anywhere." },
  ];

  const STEPS = [
    { num: "01", title: "Create Account",  desc: "Sign up free in seconds. No credit card required." },
    { num: "02", title: "Add Clients",     desc: "Import or manually add your client details." },
    { num: "03", title: "Send Invoices",   desc: "Create and send professional invoices instantly." },
    { num: "04", title: "Get Paid",        desc: "Track payments and follow up on overdue invoices." },
  ];

  const REVIEWS = [
    { name: "Amara Osei",  role: "Freelance Designer",    av: "AO", text: "Invoicio saved me hours every week. Clean, fast, and exactly what I needed as a solo freelancer." },
    { name: "Chidi Eze",   role: "Web Developer",         av: "CE", text: "The best invoicing tool I've used. Works offline and my clients love the professional look." },
    { name: "Fatima Bello",role: "Marketing Consultant",  av: "FB", text: "Finally an invoicing app that doesn't overwhelm me. I was up and running in 5 minutes flat." },
  ];

  return (
    <div style={{ fontFamily: "'Figtree',sans-serif", background: "#06070a", color: "#eeeef0", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Figtree:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#06070a}
        ::-webkit-scrollbar-thumb{background:#f59e0b;border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes gridMove{0%{transform:translateY(0)}100%{transform:translateY(60px)}}
        .au{animation:fadeUp 0.7s ease both}
        .ai{animation:fadeIn 0.4s ease both}
        .asi{animation:scaleIn 0.3s ease both}
        .gold{background:linear-gradient(135deg,#f59e0b 0%,#fcd34d 50%,#f59e0b 100%);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .fc{transition:all 0.3s ease;cursor:default}
        .fc:hover{transform:translateY(-6px) !important;border-color:rgba(245,158,11,0.35) !important;background:#0f1117 !important}
        .bp{background:linear-gradient(135deg,#f59e0b,#d97706);border:none;border-radius:10px;padding:0.75rem 1.75rem;font-family:'Figtree',sans-serif;font-weight:700;font-size:0.9rem;color:#06070a;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 20px rgba(245,158,11,0.3)}
        .bp:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(245,158,11,0.45)}
        .bg{background:transparent;border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:0.75rem 1.75rem;font-family:'Figtree',sans-serif;font-weight:600;font-size:0.9rem;color:#f59e0b;cursor:pointer;transition:all 0.2s}
        .bg:hover{background:rgba(245,158,11,0.08);border-color:#f59e0b}
        .inp{width:100%;background:#0a0b10;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.8rem 1rem;font-family:'Figtree',sans-serif;font-size:0.9rem;color:#eeeef0;outline:none;transition:border-color 0.2s}
        .inp::placeholder{color:rgba(255,255,255,0.22)}
        .inp:focus{border-color:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,0.12)}
        .nl{color:rgba(238,238,240,0.5);text-decoration:none;font-size:0.85rem;font-weight:500;transition:color 0.2s;cursor:pointer;background:none;border:none;font-family:'Figtree',sans-serif}
        .nl:hover{color:#eeeef0}
        .mo{position:fixed;inset:0;z-index:999;background:rgba(6,7,10,0.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn 0.25s ease}
        .mb{background:#0d0e14;border:1px solid rgba(245,158,11,0.2);border-radius:20px;width:100%;max-width:430px;overflow:hidden;animation:scaleIn 0.3s ease;box-shadow:0 24px 80px rgba(0,0,0,0.6)}
        @media(max-width:768px){
          .hg{grid-template-columns:1fr !important}
          .fg{grid-template-columns:1fr !important}
          .sg{grid-template-columns:1fr 1fr !important}
          .ftg{grid-template-columns:1fr !important;text-align:center}
          .hm{display:none !important}
          .stg{grid-template-columns:repeat(2,1fr) !important}
        }
      `}</style>

      {/* NAV BAR  */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        padding:"0 2rem",height:64,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background: scrolled ? "rgba(6,7,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(245,158,11,0.07)" : "none",
        transition:"all 0.3s ease",
      }}>
        <a href="#" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#06070a",fontSize:"0.95rem"}}>PI</span>
          </div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1.1rem",color:"#eeeef0"}}>PayInvoice</span>
        </a>

        <div className="hm" style={{display:"flex",gap:"2.5rem",alignItems:"center"}}>
          {[["Features","#features"],["How it works","#how"],["Reviews","#reviews"]].map(([l,h])=>(
            <a key={h} href={h} className="nl">{l}</a>
          ))}
        </div>

        <div className="hm" style={{display:"flex",alignItems:"center",gap:12}}>
          {session ? (
            <>
              <span style={{fontSize:"0.82rem",color:"rgba(238,238,240,0.4)"}}>👋 {session.name.split(" ")[0]}</span>
              <button className="bp" style={{padding:"0.5rem 1.2rem"}} onClick={()=>onEnterApp&&onEnterApp(session)}>Open App →</button>
              <button onClick={handleLogout} style={{background:"none",border:"none",color:"rgba(238,238,240,0.35)",cursor:"pointer",fontSize:"0.78rem",fontFamily:"'Figtree',sans-serif"}}>Sign out</button>
            </>
          ):(
            <>
              <button className="nl" onClick={()=>openModal("login")}>Sign In</button>
              <button className="bp" style={{padding:"0.55rem 1.3rem"}} onClick={()=>openModal("register")}>Get Started Free</button>
            </>
          )}
        </div>

        {/* hamburger */}
        <button onClick={()=>setMenuOpen(v=>!v)} style={{display:"none",background:"none",border:"none",cursor:"pointer",flexDirection:"column",gap:5,padding:4}} id="hbtn">
          {[0,1,2].map(i=>(
            <span key={i} style={{display:"block",width:22,height:2,background:"#f59e0b",borderRadius:2,transition:"all 0.3s",
              transform: menuOpen ? (i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"none") : "none",
              opacity: menuOpen&&i===1 ? 0 : 1,
            }}/>
          ))}
        </button>
      </nav>

      {/* mobile menu */}
      {menuOpen&&(
        <div style={{position:"fixed",top:64,left:0,right:0,zIndex:99,background:"rgba(6,7,10,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(245,158,11,0.08)",padding:"1.5rem 2rem",animation:"fadeIn 0.2s ease"}}>
          {[["Features","#features"],["How it works","#how"],["Reviews","#reviews"]].map(([l,h])=>(
            <a key={h} href={h} onClick={()=>setMenuOpen(false)} style={{display:"block",color:"rgba(238,238,240,0.65)",textDecoration:"none",padding:"0.75rem 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:"0.95rem",fontFamily:"'Figtree',sans-serif"}}>{l}</a>
          ))}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}>
            {session
              ? <button className="bp" onClick={()=>{setMenuOpen(false);onEnterApp&&onEnterApp(session)}}>Open App →</button>
              : <><button className="bg" onClick={()=>openModal("login")}>Sign In</button><button className="bp" onClick={()=>openModal("register")}>Get Started Free</button></>
            }
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"7rem 2rem 5rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(245,158,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.04) 1px,transparent 1px)",backgroundSize:"50px 50px",animation:"gridMove 10s linear infinite",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)"}}/>
        <div style={{position:"absolute",top:"20%",left:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"15%",right:"8%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.05) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <div className="hg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}}>

            {/* copy */}
            <div className="au">
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:50,padding:"5px 14px",marginBottom:28}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#f59e0b",display:"inline-block",animation:"pulse 2s infinite"}}/>
                <span style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.75rem",color:"#f59e0b",fontWeight:500}}>Free forever · No credit card needed</span>
              </div>

              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2.8rem,5.5vw,4.8rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-1.5px",marginBottom:22}}>
                Invoice smarter,<br/>
                <span className="gold">get paid faster.</span>
              </h1>

              <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"clamp(0.9rem,2vw,1.05rem)",color:"rgba(238,238,240,0.52)",lineHeight:1.78,maxWidth:460,marginBottom:34}}>
                The clean, fast invoicing tool for freelancers and small businesses.
                Create invoices, track payments, manage clients — all in one dashboard.
              </p>

              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:44}}>
                <button className="bp" onClick={()=>openModal("register")} style={{fontSize:"0.95rem",padding:"0.88rem 2rem"}}>Start for Free →</button>
                <button className="bg" onClick={()=>openModal("login")} style={{fontSize:"0.95rem",padding:"0.88rem 2rem"}}>Sign In</button>
              </div>

              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{display:"flex"}}>
                  {["#f59e0b","#d97706","#fbbf24","#92400e","#b45309"].map((c,i)=>(
                    <div key={i} style={{width:30,height:30,borderRadius:"50%",background:c,border:"2px solid #06070a",marginLeft:i===0?0:-8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:"0.65rem",color:"#06070a",fontWeight:700}}>{"ACFOK"[i]}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.82rem",fontWeight:600}}>2,000+ freelancers</p>
                  <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.72rem",color:"rgba(238,238,240,0.38)"}}>⭐⭐⭐⭐⭐ trusted daily</p>
                </div>
              </div>
            </div>

            {/* dashboard preview */}
            <div className="au" style={{animationDelay:"0.2s"}}>
              <div style={{background:"#0d0e14",border:"1px solid rgba(245,158,11,0.14)",borderRadius:22,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.6),0 0 60px rgba(245,158,11,0.05)"}}>
                <div style={{background:"#080910",padding:"10px 14px",display:"flex",alignItems:"center",gap:7,borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  {["#ef4444","#f59e0b","#22c55e"].map(c=><div key={c} style={{width:9,height:9,borderRadius:"50%",background:c,opacity:0.7}}/>)}
                  <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:5,height:19,marginLeft:6,display:"flex",alignItems:"center",paddingLeft:8}}>
                    <span style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.2)"}}>invoicio.app/dashboard</span>
                  </div>
                </div>
                <div style={{padding:"1.25rem"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                    {[["$24,580","Revenue","#f59e0b"],["12","Invoices","#10b981"],["3","Overdue","#ef4444"]].map(([v,l,c])=>(
                      <div key={l} style={{background:"#0a0b10",borderRadius:10,padding:"10px",border:"1px solid rgba(255,255,255,0.04)"}}>
                        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1rem",color:c}}>{v}</p>
                        <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.65rem",color:"rgba(255,255,255,0.3)",marginTop:2}}>{l}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"#0a0b10",borderRadius:10,padding:"0.9rem",marginBottom:10,border:"1px solid rgba(255,255,255,0.03)"}}>
                    <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.68rem",color:"rgba(255,255,255,0.28)",marginBottom:8}}>Revenue Overview</p>
                    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:42}}>
                      {[30,55,45,70,85,60,90,75,95,80,65,100].map((h,i)=>(
                        <div key={i} style={{flex:1,height:`${h}%`,background:i===11?"#f59e0b":"rgba(245,158,11,0.18)",borderRadius:"3px 3px 0 0"}}/>
                      ))}
                    </div>
                  </div>
                  {[["INV-001","AppClick NG","$8,580","paid"],["INV-002","TechStart","$5,300","pending"],["INV-003","Global Media","$1,260","overdue"]].map(([id,c,a,s])=>(
                    <div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:26,height:26,borderRadius:7,background:"rgba(245,158,11,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem"}}>📄</div>
                        <div>
                          <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.7rem",fontWeight:600,color:"#eeeef0"}}>{id}</p>
                          <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.6rem",color:"rgba(255,255,255,0.28)"}}>{c}</p>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontFamily:"'Syne',sans-serif",fontSize:"0.75rem",fontWeight:700,color:"#eeeef0"}}>{a}</p>
                        <span style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.58rem",fontWeight:600,color:s==="paid"?"#10b981":s==="pending"?"#f59e0b":"#ef4444",background:s==="paid"?"rgba(16,185,129,0.1)":s==="pending"?"rgba(245,158,11,0.1)":"rgba(239,68,68,0.1)",padding:"2px 6px",borderRadius:99}}>{s}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:"4rem 2rem",borderTop:"1px solid rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div className="stg" style={{maxWidth:860,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"2rem",textAlign:"center"}}>
          {[["2000","+","Freelancers"],["50000","+","Invoices sent"],["99","%","Uptime SLA"],["4.9","★","Avg rating"]].map(([n,s,l])=>(
            <div key={l}>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.2rem",color:"#f59e0b",lineHeight:1}}>
                <Counter end={parseFloat(n)} suffix={s}/>
              </p>
              <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.75rem",color:"rgba(238,238,240,0.32)",marginTop:6,textTransform:"uppercase",letterSpacing:"1px"}}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:"7rem 2rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"4rem"}}>
            <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.72rem",color:"#f59e0b",letterSpacing:"3px",textTransform:"uppercase",marginBottom:12}}>Everything you need</p>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,letterSpacing:"-1px"}}>
              Built for people who <span className="gold">actually work</span>
            </h2>
          </div>
          <div className="fg" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.2rem"}}>
            {FEATURES.map((f,i)=>(
              <div key={f.title} className="fc" style={{background:"#0a0b10",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"1.75rem",animationDelay:`${i*0.07}s`}}>
                <div style={{width:42,height:42,borderRadius:11,background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",marginBottom:14}}>{f.icon}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"0.98rem",fontWeight:700,marginBottom:8}}>{f.title}</h3>
                <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.83rem",color:"rgba(238,238,240,0.48)",lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:"7rem 2rem",background:"#080910"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"4rem"}}>
            <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.72rem",color:"#f59e0b",letterSpacing:"3px",textTransform:"uppercase",marginBottom:12}}>Simple process</p>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,letterSpacing:"-1px"}}>
              Up and running in <span className="gold">4 steps</span>
            </h2>
          </div>
          <div className="sg" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.5rem",marginBottom:"3.5rem"}}>
            {STEPS.map((s,i)=>(
              <div key={s.num} style={{textAlign:"center",padding:"1.25rem 0.75rem"}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontSize:"2.8rem",fontWeight:800,color:"rgba(245,158,11,0.14)",lineHeight:1,marginBottom:10}}>{s.num}</p>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"0.93rem",fontWeight:700,marginBottom:8}}>{s.title}</h3>
                <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.8rem",color:"rgba(238,238,240,0.42)",lineHeight:1.65}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center"}}>
            <button className="bp" onClick={()=>openModal("register")} style={{fontSize:"1rem",padding:"1rem 2.5rem"}}>Get Started — It's Free</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" style={{padding:"7rem 2rem"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"4rem"}}>
            <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.72rem",color:"#f59e0b",letterSpacing:"3px",textTransform:"uppercase",marginBottom:12}}>Loved by freelancers</p>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,letterSpacing:"-1px"}}>
              Don't take our <span className="gold">word for it</span>
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.2rem"}}>
            {REVIEWS.map(r=>(
              <div key={r.name} style={{background:"#0a0b10",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"1.75rem"}}>
                <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.84rem",color:"rgba(238,238,240,0.58)",lineHeight:1.75,marginBottom:18}}>"{r.text}"</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#06070a",fontSize:"0.75rem"}}>{r.av}</div>
                  <div>
                    <p style={{fontFamily:"'Figtree',sans-serif",fontWeight:600,fontSize:"0.83rem"}}>{r.name}</p>
                    <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.72rem",color:"rgba(238,238,240,0.38)"}}>{r.role}</p>
                  </div>
                  <div style={{marginLeft:"auto",color:"#f59e0b",fontSize:"0.7rem"}}>⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{padding:"5rem 2rem",margin:"0 1.5rem 5rem",background:"linear-gradient(135deg,rgba(245,158,11,0.07) 0%,rgba(245,158,11,0.03) 100%)",border:"1px solid rgba(245,158,11,0.14)",borderRadius:26,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,letterSpacing:"-1px",marginBottom:14}}>
          Ready to get paid <span className="gold">on time?</span>
        </h2>
        <p style={{fontFamily:"'Figtree',sans-serif",color:"rgba(238,238,240,0.48)",maxWidth:440,margin:"0 auto 2.5rem",lineHeight:1.75,fontSize:"0.95rem"}}>
          Join thousands of freelancers who send professional invoices and track payments with Invoicio.
        </p>
        <button className="bp" onClick={()=>openModal("register")} style={{fontSize:"1rem",padding:"1rem 2.5rem"}}>Create Free Account →</button>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#080910",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"4rem 2rem 2rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div className="ftg" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"3rem",paddingBottom:"2.5rem",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#06070a",fontSize:"0.85rem"}}>PI</span>
                </div>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1rem"}}>PayInvoice</span>
              </div>
              <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.83rem",color:"rgba(238,238,240,0.38)",lineHeight:1.75,maxWidth:240}}>
                Smart invoicing for freelancers and small businesses. Free forever.
              </p>
            </div>
            {[["Product",["Features","Pricing","Changelog","Roadmap"]],["Company",["About","Blog","Careers","Press"]],["Legal",["Privacy","Terms","Cookies","Security"]]].map(([title,links])=>(
              <div key={title}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:"0.83rem",marginBottom:14}}>{title}</p>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {links.map(l=>(
                    <a key={l} href="#" style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.8rem",color:"rgba(238,238,240,0.38)",textDecoration:"none",transition:"color 0.2s"}}
                      onMouseOver={e=>e.target.style.color="#f59e0b"}
                      onMouseOut={e=>e.target.style.color="rgba(238,238,240,0.38)"}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"1.5rem",flexWrap:"wrap",gap:10}}>
            <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.76rem",color:"rgba(238,238,240,0.22)"}}>© {new Date().getFullYear()} PayInvoice. All rights reserved.</p>
            <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.76rem",color:"rgba(238,238,240,0.22)"}}>Built for freelancers worldwide</p>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {modal&&(
        <div className="mo" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="mb">
            <div style={{padding:"1.5rem 1.5rem 0"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#06070a",fontSize:"0.8rem"}}>I</span>
                  </div>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"0.95rem"}}>Invoicio</span>
                </div>
                <button onClick={closeModal} style={{background:"none",border:"none",color:"rgba(238,238,240,0.35)",cursor:"pointer",fontSize:"1rem",lineHeight:1,padding:4,fontFamily:"'Figtree',sans-serif"}}>✕</button>
              </div>

              {/* tabs */}
              <div style={{display:"flex",background:"#080910",borderRadius:10,padding:4,marginBottom:"1.5rem"}}>
                {["login","register"].map(t=>(
                  <button key={t} onClick={()=>{setTab(t);setError("");setSuccess("");}}
                    style={{flex:1,padding:"0.58rem",borderRadius:8,border:"none",fontFamily:"'Figtree',sans-serif",fontWeight:600,fontSize:"0.83rem",cursor:"pointer",transition:"all 0.2s",background:tab===t?"#f59e0b":"transparent",color:tab===t?"#06070a":"rgba(238,238,240,0.38)"}}>
                    {t==="login"?"Sign In":"Create Account"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{padding:"0 1.5rem 1.5rem"}}>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                {tab==="register"&&(
                  <div>
                    <label style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.73rem",color:"rgba(238,238,240,0.42)",fontWeight:500,display:"block",marginBottom:5}}>Full Name</label>
                    <input className="inp" type="text" placeholder="Jane Smith" value={form.name} onChange={e=>setF("name",e.target.value)}/>
                  </div>
                )}
                <div>
                  <label style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.73rem",color:"rgba(238,238,240,0.42)",fontWeight:500,display:"block",marginBottom:5}}>Email</label>
                  <input className="inp" type="email" placeholder="jane@example.com" value={form.email} onChange={e=>setF("email",e.target.value)}/>
                </div>
                <div>
                  <label style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.73rem",color:"rgba(238,238,240,0.42)",fontWeight:500,display:"block",marginBottom:5}}>Password</label>
                  <input className="inp" type="password" placeholder={tab==="register"?"Min. 6 characters":"Your password"} value={form.password} onChange={e=>setF("password",e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&(tab==="login"?handleLogin():handleRegister())}/>
                </div>

                {error&&(
                  <div style={{background:"rgba(239,68,68,0.09)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"0.65rem 0.9rem"}}>
                    <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.8rem",color:"#f87171"}}>⚠ {error}</p>
                  </div>
                )}
                {success&&(
                  <div style={{background:"rgba(16,185,129,0.09)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:10,padding:"0.65rem 0.9rem"}}>
                    <p style={{fontFamily:"'Figtree',sans-serif",fontSize:"0.8rem",color:"#34d399"}}>✓ {success}</p>
                  </div>
                )}

                <button className="bp" style={{width:"100%",padding:"0.88rem",fontSize:"0.93rem",marginTop:2}}
                  onClick={tab==="login"?handleLogin:handleRegister}>
                  {tab==="login"?"Sign In →":"Create Account →"}
                </button>

                <p style={{textAlign:"center",fontFamily:"'Figtree',sans-serif",fontSize:"0.76rem",color:"rgba(238,238,240,0.28)"}}>
                  {tab==="login"?"Don't have an account? ":"Already have an account? "}
                  <button onClick={()=>{setTab(tab==="login"?"register":"login");setError("");}}
                    style={{background:"none",border:"none",color:"#f59e0b",cursor:"pointer",fontFamily:"'Figtree',sans-serif",fontSize:"0.76rem",fontWeight:600}}>
                    {tab==="login"?"Sign up free":"Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}