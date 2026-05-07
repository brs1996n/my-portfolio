"use client";
import { useState, useRef, useEffect } from "react";

const suggestions = [
  "What's your strongest technical skill?",
  "Tell me about your CVS Health work",
  "What cloud platforms do you use?",
  "Why should I hire you?",
];

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F7F8FA;
          --bg2: #FFFFFF;
          --text: #0D1117;
          --text2: #4B5563;
          --text3: #9CA3AF;
          --border: #E5E7EB;
          --border2: #F3F4F6;
          --teal: #0D9488;
          --teal-light: #F0FDFA;
          --teal-mid: #CCFBF1;
          --teal-text: #0F766E;
          --indigo: #6366F1;
          --s1: 0 1px 2px rgba(0,0,0,0.04);
          --s2: 0 1px 3px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.04);
          --s3: 0 2px 8px rgba(0,0,0,0.06),0 8px 24px rgba(0,0,0,0.06);
          --s4: 0 4px 16px rgba(0,0,0,0.07),0 16px 48px rgba(0,0,0,0.07);
          --s5: 0 8px 32px rgba(0,0,0,0.08),0 32px 80px rgba(0,0,0,0.08);
          --r: 14px;
          --r2: 20px;
          --r3: 28px;
          --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Multi-layer background ── */
        .bg-base {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 120% 80% at 15% 0%, rgba(13,148,136,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 80% 60% at 85% 90%, rgba(99,102,241,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(248,250,252,0.9) 0%, transparent 100%),
            linear-gradient(160deg, #F0FDF9 0%, #F7F8FA 40%, #EEF2FF 100%);
        }
        /* Blurred shape 1 */
        .bg-blob1 {
          position: fixed; z-index: 0;
          top: -120px; left: -80px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 65%);
          filter: blur(60px);
          pointer-events: none;
        }
        /* Blurred shape 2 */
        .bg-blob2 {
          position: fixed; z-index: 0;
          bottom: -100px; right: -60px;
          width: 440px; height: 440px;
          background: radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%);
          filter: blur(60px);
          pointer-events: none;
        }
        /* Noise */
        .bg-noise {
          position: fixed; inset: 0; z-index: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        main { position: relative; z-index: 1; }

        ::selection { background: #CCFBF1; color: #0F766E; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }

        /* ── Animations ── */
        .f0 { opacity:0; transform:translateY(20px); animation: up .65s cubic-bezier(.16,1,.3,1) forwards; }
        .f1 { animation-delay:.08s }
        .f2 { animation-delay:.18s }
        .f3 { animation-delay:.28s }
        .f4 { animation-delay:.38s }
        .f5 { animation-delay:.46s }
        @keyframes up { to { opacity:1; transform:translateY(0); } }

        /* ── Hero spotlight ── */
        .hero-spotlight {
          position: absolute;
          top: -60px; left: -40px; right: -40px; bottom: -40px;
          background: radial-gradient(ellipse 70% 60% at 30% 40%, rgba(13,148,136,0.06) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 32px;
        }

        /* ── Profile image ── */
        .photo-wrap {
          width: 112px; height: 112px; flex-shrink: 0;
          border-radius: 50%;
          padding: 2.5px;
          background: linear-gradient(135deg, #0D9488 0%, #6366F1 100%);
          box-shadow: 0 0 0 4px white, var(--s3);
          position: relative;
        }
        .photo-inner {
          width: 100%; height: 100%;
          border-radius: 50%; overflow: hidden;
          background: #E5E7EB;
        }
        .photo-inner img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── Name ── */
        .hero-name {
          font-size: clamp(46px, 8vw, 66px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -2.5px;
          background: linear-gradient(140deg, #0D1117 0%, #1a4a45 60%, #0F766E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 14px;
        }

        /* ── Badge ── */
        .badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--teal-light);
          border: 1px solid var(--teal-mid);
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 12px; font-weight: 500;
          color: var(--teal-text);
          margin-bottom: 18px;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--teal);
          animation: blink 2.5s ease-in-out infinite;
          box-shadow: 0 0 4px rgba(13,148,136,0.5);
        }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.3;} }

        /* ── Buttons ── */
        .btn {
          display: inline-flex; align-items: center; gap: 6px;
          text-decoration: none;
          border-radius: 999px;
          padding: 8px 20px;
          font-size: 13px; font-weight: 500;
          font-family: var(--font);
          cursor: pointer;
          border: none;
          transition: all .2s cubic-bezier(.16,1,.3,1);
        }
        .btn-ghost {
          background: white;
          border: 1px solid var(--border);
          color: var(--text2);
          box-shadow: var(--s1);
        }
        .btn-ghost:hover {
          background: #FAFAFA;
          border-color: #D1D5DB;
          color: var(--text);
          transform: translateY(-2px);
          box-shadow: var(--s2);
        }
        .btn-loc {
          background: var(--teal-light);
          border: 1px solid var(--teal-mid);
          color: var(--teal-text);
        }
        .btn-send {
          border-radius: 10px;
          padding: 11px 22px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }
        .btn-send.on {
          background: var(--teal);
          color: white;
          box-shadow: 0 2px 8px rgba(13,148,136,0.25);
        }
        .btn-send.on:hover {
          background: #0F766E;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(13,148,136,0.3);
        }
        .btn-send.off {
          background: #F3F4F6;
          color: var(--text3);
          cursor: default;
        }

        /* ── Section label ── */
        .label {
          font-size: 10px; font-weight: 700;
          color: var(--text3);
          letter-spacing: 3.5px;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 14px;
        }
        .label::after { content:''; flex:1; height:1px; background: var(--border); }

        /* ── AI Chat card ── */
        .ai-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(229,231,235,0.8);
          border-radius: var(--r3);
          box-shadow: var(--s5);
          overflow: hidden;
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          position: relative;
        }
        /* Gradient border top */
        .ai-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(13,148,136,0.4) 30%, rgba(99,102,241,0.4) 70%, transparent 100%);
        }
        .ai-header {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border2);
          background: linear-gradient(180deg, rgba(240,253,250,0.5) 0%, transparent 100%);
          display: flex; align-items: center; gap: 12px;
        }
        .ai-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, var(--teal-light), #EEF2FF);
          border: 1px solid var(--teal-mid);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }
        .suggest-btn {
          width: 100%;
          text-align: left;
          background: rgba(249,250,251,0.7);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 13px 18px;
          font-size: 14px;
          color: var(--text2);
          cursor: pointer;
          font-family: var(--font);
          transition: all .18s cubic-bezier(.16,1,.3,1);
          display: flex; align-items: center; gap: 10px;
          font-weight: 400;
        }
        .suggest-btn:hover {
          background: var(--teal-light);
          border-color: var(--teal-mid);
          color: var(--teal-text);
          transform: translateX(4px);
          box-shadow: var(--s2);
        }
        .suggest-icon { color: var(--teal); font-size: 13px; flex-shrink: 0; opacity: 0.7; }
        .msg-user {
          background: var(--teal);
          color: white;
          border-radius: 18px 18px 4px 18px;
          padding: 12px 16px;
          font-size: 14px; line-height: 1.65;
          max-width: 85%;
          align-self: flex-end;
          box-shadow: 0 2px 8px rgba(13,148,136,0.2);
        }
        .msg-ai {
          background: white;
          border: 1px solid var(--border);
          border-radius: 18px 18px 18px 4px;
          padding: 14px 18px;
          font-size: 14px; line-height: 1.75;
          color: var(--text2);
          max-width: 90%;
          box-shadow: var(--s2);
        }
        .chat-input {
          flex: 1;
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text);
          font-family: var(--font);
          outline: none;
          transition: all .2s;
          box-shadow: var(--s1);
        }
        .chat-input::placeholder { color: var(--text3); }
        .chat-input:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
        }
        .dot-loader span {
          display: inline-block; width: 5px; height: 5px;
          border-radius: 50%; background: var(--teal);
          animation: db 1.4s ease-in-out infinite; margin: 0 2px;
        }
        .dot-loader span:nth-child(2){animation-delay:.2s}
        .dot-loader span:nth-child(3){animation-delay:.4s}
        @keyframes db{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1);opacity:1}}

        /* ── Experience cards ── */
        .exp-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--r2);
          padding: 28px 32px;
          box-shadow: var(--s2);
          transition: all .22s cubic-bezier(.16,1,.3,1);
          position: relative; overflow: hidden;
        }
        .exp-card:hover {
          box-shadow: var(--s4);
          transform: translateY(-3px);
          border-color: #D1D5DB;
        }
        .exp-card.current::before {
          content:''; position:absolute;
          top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg, var(--teal), var(--indigo));
        }
        .exp-card.current {
          background: linear-gradient(180deg, rgba(240,253,250,0.4) 0%, white 40%);
        }

        /* ── Skill cards ── */
        .skill-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 18px 20px;
          box-shadow: var(--s1);
          transition: all .2s cubic-bezier(.16,1,.3,1);
        }
        .skill-card:hover {
          box-shadow: var(--s3);
          transform: translateY(-3px);
          border-color: var(--teal-mid);
          background: linear-gradient(145deg, var(--teal-light), white);
        }

        /* ── Education ── */
        .edu-row {
          padding: 20px 28px;
          transition: background .15s;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 8px;
        }
        .edu-row:hover { background: #FAFAFA; }
        .year-pill {
          font-size: 12px; color: var(--text3);
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 6px; padding: 3px 10px;
        }

        @media(max-width:600px){
          .hero-row{flex-direction:column!important;gap:24px!important}
          .hero-name{font-size:44px!important;letter-spacing:-1.5px!important}
        }
      `}</style>

      {/* Background layers */}
      <div className="bg-base" />
      <div className="bg-blob1" />
      <div className="bg-blob2" />
      <div className="bg-noise" />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "80px 24px 128px" }}>

        {/* ── HERO ── */}
        <section className="f0 f1 hero-row" style={{ position: "relative", display: "flex", gap: 40, alignItems: "flex-start", marginBottom: 100 }}>
          <div className="hero-spotlight" />

          {/* Photo */}
          <div className="photo-wrap" style={{ marginTop: 8 }}>
            <div className="photo-inner">
              <img src="/IMG_5176_Original.jpeg" alt="Naveen Kumar" />
            </div>
          </div>

          {/* Text */}
          <div style={{ flex: 1, position: "relative" }}>
            <div className="badge">
              <div className="badge-dot" />
              Available for new roles
            </div>

            <h1 className="hero-name">Naveen<br />Kumar</h1>

            <p style={{ color: "#4B5563", fontSize: 16, lineHeight: 1.8, maxWidth: 400, marginBottom: 28, fontWeight: 400 }}>
              Senior Data Engineer — 7+ years building<br />
              enterprise-scale platforms across{" "}
              <span style={{ color: "var(--teal-text)", fontWeight: 600 }}>healthcare & finance</span>.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href="https://www.linkedin.com/in/naveenkumarbrs/" target="_blank" className="btn btn-ghost">→ LinkedIn</a>
              <a href="mailto:nvnkmr1996@gmail.com" className="btn btn-ghost">→ Email</a>
              <span className="btn btn-loc">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", display: "inline-block", boxShadow: "0 0 4px rgba(13,148,136,0.5)" }} />
                Nashville, TN
              </span>
            </div>
          </div>
        </section>

        {/* ── AI CHAT ── */}
        <section className="f0 f2" style={{ marginBottom: 88 }}>
          <div className="label">Ask my portfolio anything</div>

          <div className="ai-card">
            {/* Header */}
            <div className="ai-header">
              <div className="ai-icon">✦</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>Ask my portfolio anything</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>Powered by Claude AI</div>
              </div>
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 4, paddingLeft: 2 }}>Try asking</p>
                {suggestions.map((s) => (
                  <button key={s} className="suggest-btn" onClick={() => sendMessage(s)}>
                    <span className="suggest-icon">→</span>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div style={{ padding: "24px", maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", gap: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: m.role === "user" ? "var(--teal-text)" : "var(--text3)", marginBottom: 2, paddingLeft: m.role === "assistant" ? 4 : 0, paddingRight: m.role === "user" ? 4 : 0 }}>
                      {m.role === "user" ? "You" : "Naveen"}
                    </div>
                    <div className={m.role === "user" ? "msg-user" : "msg-ai"}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--text3)", paddingLeft: 4 }}>Naveen</div>
                    <div className="msg-ai" style={{ padding: "14px 20px" }}>
                      <div className="dot-loader"><span /><span /><span /></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input bar */}
            <div style={{ padding: "14px 16px", display: "flex", gap: 10, borderTop: "1px solid var(--border2)", background: "rgba(249,250,251,0.6)", marginTop: messages.length === 0 ? 16 : 0 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
                placeholder="Ask me anything about my experience..."
                className="chat-input"
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className={`btn btn-send ${input.trim() && !loading ? "on" : "off"}`}>
                Send
              </button>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section className="f0 f3" style={{ marginBottom: 72 }}>
          <div className="label">Experience</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { role: "Senior Data Engineer", company: "TCS · CVS Health", period: "Feb 2024 – Present", current: true,
                points: ["Event-driven ingestion on GCP Pub/Sub — 60% latency reduction", "dbt medallion architecture: staging → intermediate → marts", "CI/CD automation cutting deployment cycles by 70%", "Enterprise EDM framework — 90% faster execution"] },
              { role: "Data Engineer", company: "Tekinvaderz · Aetna", period: "Aug 2021 – Jan 2024", current: false,
                points: ["Migrated 500+ Teradata tables to BigQuery Lakehouse — 50% faster queries", "99.9% data accuracy with automated reconciliation", "HIPAA-compliant security with GCP Secret Manager"] },
              { role: "Data Engineer", company: "Infosys · Experian", period: "Feb 2018 – Dec 2019", current: false,
                points: ["Batch ingestion pipelines for consumer credit datasets", "60% reduction in manual reconciliation via automation"] },
            ].map((job) => (
              <div key={job.company} className={`exp-card ${job.current ? "current" : ""}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: -0.3 }}>{job.role}</span>
                      {job.current && (
                        <span style={{ fontSize: 10, background: "var(--teal-light)", color: "var(--teal-text)", border: "1px solid var(--teal-mid)", borderRadius: 999, padding: "2px 10px", fontWeight: 600, letterSpacing: 0.5 }}>Current</span>
                      )}
                    </div>
                    <div style={{ color: "var(--text3)", fontSize: 13, fontWeight: 500 }}>{job.company}</div>
                  </div>
                  <span style={{ color: "var(--text3)", fontSize: 13 }}>{job.period}</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                  {job.points.map(p => (
                    <li key={p} style={{ fontSize: 14, color: "#4B5563", paddingLeft: 20, position: "relative", lineHeight: 1.65 }}>
                      <span style={{ position: "absolute", left: 0, top: "0.4em", width: 5, height: 5, borderRadius: "50%", background: "var(--teal)", opacity: 0.5, display: "inline-block" }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section className="f0 f4" style={{ marginBottom: 72 }}>
          <div className="label">Skills</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 12 }}>
            {[
              { cat: "Cloud", skills: "GCP · BigQuery · Dataproc · AWS" },
              { cat: "Languages", skills: "Python · SQL · PySpark" },
              { cat: "Data Engineering", skills: "Spark · Kafka · dbt · ETL/ELT" },
              { cat: "Databases", skills: "BigQuery · Snowflake · Teradata" },
              { cat: "BI & Analytics", skills: "Power BI · Tableau · Looker" },
              { cat: "Domain", skills: "Healthcare · FACETS · CMS" },
            ].map(({ cat, skills }) => (
              <div key={cat} className="skill-card">
                <div style={{ fontSize: 10, color: "var(--teal-text)", fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>{cat}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>{skills}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section className="f0 f5" style={{ marginBottom: 72 }}>
          <div className="label">Education</div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--s2)" }}>
            {[
              { deg: "MS Data Science & AI", school: "Campbellsville University", year: "2024–2026" },
              { deg: "MS Computer Science", school: "Arkansas State University", year: "2020–2021" },
              { deg: "B.Tech Mechanical Engineering", school: "Hindustan University", year: "2013–2017" },
            ].map((e, i, arr) => (
              <div key={e.deg} className="edu-row" style={{ borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{e.deg}</div>
                  <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3 }}>{e.school}</div>
                </div>
                <span className="year-pill">{e.year}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ fontSize: 12, color: "var(--text3)", paddingTop: 28, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontWeight: 500 }}>Naveen Kumar · Nashville, TN</span>
          <span>Built with Claude + Next.js · Vercel</span>
        </footer>

      </main>
    </>
  );
}
