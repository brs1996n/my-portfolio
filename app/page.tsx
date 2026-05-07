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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #060908;
          --surface: rgba(255,255,255,0.03);
          --border: rgba(255,255,255,0.06);
          --border-hover: rgba(200,240,77,0.3);
          --text: #e8e4dc;
          --muted: #52564f;
          --dim: #2a2e28;
          --accent: #c8f04d;
          --accent-dim: rgba(200,240,77,0.08);
          --accent-glow: rgba(200,240,77,0.15);
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-mono);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Animated background */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 10%, rgba(200,240,77,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,200,120,0.03) 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 50% 50%, rgba(10,20,15,0.8) 0%, transparent 100%);
          pointer-events: none;
          z-index: 0;
          animation: ambientShift 12s ease-in-out infinite alternate;
        }

        @keyframes ambientShift {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1;   transform: scale(1.05); }
        }

        /* Grain overlay */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.4;
        }

        main { position: relative; z-index: 2; }

        ::selection { background: var(--accent); color: #060908; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }

        /* Animations */
        .fade-up {
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Photo ring */
        .photo-ring {
          width: 108px; height: 108px; border-radius: 50%; flex-shrink: 0;
          position: relative;
          background: conic-gradient(var(--accent), transparent, var(--accent));
          padding: 2px;
          box-shadow: 0 0 24px rgba(200,240,77,0.2), 0 0 60px rgba(200,240,77,0.05);
          animation: ringPulse 3s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 24px rgba(200,240,77,0.2), 0 0 60px rgba(200,240,77,0.05); }
          50% { box-shadow: 0 0 32px rgba(200,240,77,0.35), 0 0 80px rgba(200,240,77,0.1); }
        }
        .photo-inner {
          width: 100%; height: 100%; border-radius: 50%;
          overflow: hidden; background: #111;
        }
        .photo-inner img { width: 100%; height: 100%; object-fit: cover; }

        /* Name gradient */
        .hero-name {
          font-family: var(--font-display);
          font-size: clamp(38px, 7vw, 58px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -1.5px;
          background: linear-gradient(135deg, #ffffff 0%, #c8f04d 50%, #7acc00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(200,240,77,0.15));
        }

        /* Availability badge */
        .avail-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--accent); margin-bottom: 14px;
          padding: 5px 12px;
          border: 1px solid rgba(200,240,77,0.2);
          border-radius: 999px;
          background: rgba(200,240,77,0.04);
        }
        .avail-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Links */
        .pill-link {
          display: inline-flex; align-items: center; gap: 6px;
          text-decoration: none;
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 7px 18px;
          font-size: 11px;
          color: var(--muted);
          font-family: var(--font-mono);
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
          background: var(--surface);
          backdrop-filter: blur(8px);
        }
        .pill-link:hover {
          border-color: var(--border-hover);
          color: var(--accent);
          background: var(--accent-dim);
          box-shadow: 0 0 16px var(--accent-glow);
          transform: translateY(-1px);
        }
        .pill-loc {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid rgba(200,240,77,0.15);
          border-radius: 999px; padding: 7px 18px;
          font-size: 11px; color: var(--accent);
          font-family: var(--font-mono);
          background: rgba(200,240,77,0.04);
        }

        /* Chat section */
        .chat-wrap {
          border: 1px solid var(--border);
          border-radius: 20px;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(20px);
          overflow: hidden;
          box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.4);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .chat-wrap:focus-within {
          border-color: rgba(200,240,77,0.15);
          box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,240,77,0.05);
        }

        .chat-header {
          display: flex; align-items: center; gap: 10px;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--border);
        }

        .suggest-btn {
          text-align: left;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 12px;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
          font-family: var(--font-mono);
          width: 100%;
        }
        .suggest-btn:hover {
          border-color: var(--border-hover);
          color: var(--accent);
          background: var(--accent-dim);
          transform: translateX(4px);
        }

        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 12px;
          color: var(--text);
          font-family: var(--font-mono);
          transition: all 0.2s;
          outline: none;
        }
        .chat-input::placeholder { color: var(--dim); }
        .chat-input:focus {
          border-color: rgba(200,240,77,0.3);
          background: rgba(200,240,77,0.02);
          box-shadow: 0 0 0 3px rgba(200,240,77,0.05);
        }

        .send-btn {
          border: none; border-radius: 10px;
          padding: 11px 22px;
          font-size: 12px; font-weight: 600;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        .send-btn.active {
          background: var(--accent);
          color: #060908;
          box-shadow: 0 0 20px rgba(200,240,77,0.3);
        }
        .send-btn.active:hover {
          background: #d4f55a;
          transform: translateY(-1px);
          box-shadow: 0 0 28px rgba(200,240,77,0.4);
        }
        .send-btn.inactive {
          background: rgba(255,255,255,0.04);
          color: var(--dim);
          cursor: default;
        }

        /* Cards */
        .card {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          background: var(--surface);
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .card:hover {
          border-color: rgba(200,240,77,0.12);
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        /* Section divider */
        .section-label {
          font-family: var(--font-display);
          font-size: 11px; font-weight: 600;
          color: var(--dim); letter-spacing: 4px;
          text-transform: uppercase; margin-bottom: 28px;
          display: flex; align-items: center; gap: 12px;
        }
        .section-label::after {
          content: ''; flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--border), transparent);
        }

        /* Dot loader */
        .dot-loader span {
          display: inline-block;
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--accent);
          animation: dotBounce 1.2s ease-in-out infinite;
          margin: 0 2px;
        }
        .dot-loader span:nth-child(2) { animation-delay: 0.2s; }
        .dot-loader span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <main style={{ maxWidth: 740, margin: "0 auto", padding: "72px 24px 120px" }}>

        {/* Hero */}
        <section className="fade-up" style={{ display: "flex", gap: 36, alignItems: "flex-start", marginBottom: 96, animationDelay: "0.05s" }}>
          <div className="photo-ring">
            <div className="photo-inner">
              <img src="/IMG_5176_Original.jpeg" alt="Naveen Kumar" />
            </div>
          </div>

          <div style={{ paddingTop: 4 }}>
            <div className="avail-badge">
              <div className="avail-dot" />
              Available for new roles
            </div>
            <h1 className="hero-name">Naveen<br />Kumar</h1>
            <p style={{ color: "#6b7068", fontSize: 13, lineHeight: 1.75, maxWidth: 380, margin: "14px 0 22px", fontFamily: "var(--font-mono)" }}>
              Senior Data Engineer — 7+ years building enterprise-scale<br />
              data platforms across{" "}
              <span style={{ color: "var(--accent)" }}>healthcare & finance</span>.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href="https://www.linkedin.com/in/naveenkumarbrs/" target="_blank" className="pill-link">→ LinkedIn</a>
              <a href="mailto:nvnkmr1996@gmail.com" className="pill-link">→ Email</a>
              <span className="pill-loc"><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 6px var(--accent)", display: "inline-block" }} /> Nashville, TN</span>
            </div>
          </div>
        </section>

        {/* AI Chat */}
        <section className="fade-up" style={{ marginBottom: 88, animationDelay: "0.2s" }}>
          <div className="section-label">Ask my portfolio anything</div>

          <div className="chat-wrap">
            <div className="chat-header">
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)", animation: "blink 2s infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--text)" }}>Ask my portfolio anything</span>
              <span style={{ fontSize: 10, color: "var(--dim)", marginLeft: 2 }}>powered by Claude</span>
            </div>

            {messages.length === 0 && (
              <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 9, color: "var(--dim)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>try asking</p>
                {suggestions.map((s) => (
                  <button key={s} className="suggest-btn" onClick={() => sendMessage(s)}>
                    <span style={{ color: "var(--accent)", marginRight: 8 }}>→</span>{s}
                  </button>
                ))}
              </div>
            )}

            {messages.length > 0 && (
              <div style={{ padding: "20px 20px 0", maxHeight: 340, overflowY: "auto" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 22 }} className="fade-up">
                    <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: m.role === "user" ? "var(--accent)" : "var(--dim)", marginBottom: 7, display: "flex", alignItems: "center", gap: 6 }}>
                      {m.role === "user" ? <><span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />you</> : <><span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--dim)", display: "inline-block" }} />naveen</>}
                    </div>
                    <div style={{ fontSize: 13, color: m.role === "user" ? "var(--text)" : "#7a8075", lineHeight: 1.75, paddingLeft: 10, borderLeft: m.role === "assistant" ? "1px solid var(--border)" : "none" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "var(--dim)", marginBottom: 7 }}>naveen</div>
                    <div className="dot-loader" style={{ paddingLeft: 10 }}>
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div style={{ padding: 16, display: "flex", gap: 10, borderTop: "1px solid var(--border)", marginTop: 16 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Ask me anything..."
                className="chat-input"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className={`send-btn ${input.trim() && !loading ? "active" : "inactive"}`}
              >
                Send
              </button>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.35s" }}>
          <div className="section-label">Experience</div>
          {[
            { role: "Senior Data Engineer", company: "TCS · CVS Health", period: "Feb 2024 – Present", current: true, points: ["Event-driven ingestion on GCP Pub/Sub — 60% latency reduction", "dbt medallion architecture: staging → intermediate → marts", "CI/CD automation cutting deployment cycles by 70%", "Enterprise EDM framework — 90% faster execution"] },
            { role: "Data Engineer", company: "Tekinvaderz · Aetna", period: "Aug 2021 – Jan 2024", current: false, points: ["Migrated 500+ Teradata tables to BigQuery Lakehouse — 50% faster queries", "99.9% data accuracy with automated reconciliation", "HIPAA-compliant security with GCP Secret Manager"] },
            { role: "Data Engineer", company: "Infosys · Experian", period: "Feb 2018 – Dec 2019", current: false, points: ["Batch ingestion pipelines for consumer credit datasets", "60% reduction in manual reconciliation via automation"] },
          ].map((job) => (
            <div key={job.company} style={{ marginBottom: 28, padding: "24px", border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,240,77,0.12)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>
              {job.current && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{job.role}</span>
                    {job.current && <span style={{ fontSize: 8, background: "rgba(200,240,77,0.1)", color: "var(--accent)", border: "1px solid rgba(200,240,77,0.2)", borderRadius: 999, padding: "2px 8px", letterSpacing: 2, textTransform: "uppercase" }}>Current</span>}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>{job.company}</div>
                </div>
                <span style={{ color: "var(--dim)", fontSize: 11 }}>{job.period}</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {job.points.map(p => (
                  <li key={p} style={{ fontSize: 12, color: "#5a6057", paddingLeft: 18, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--accent)", opacity: 0.6 }}>—</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.45s" }}>
          <div className="section-label">Skills</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
            {[
              { cat: "Cloud", skills: "GCP · BigQuery · Dataproc · AWS" },
              { cat: "Languages", skills: "Python · SQL · PySpark" },
              { cat: "Data Eng", skills: "Spark · Kafka · dbt · ETL/ELT" },
              { cat: "Databases", skills: "BigQuery · Snowflake · Teradata" },
              { cat: "BI & Analytics", skills: "Power BI · Tableau · Looker" },
              { cat: "Domain", skills: "Healthcare · FACETS · CMS" },
            ].map(({ cat, skills }) => (
              <div key={cat} className="card">
                <div style={{ fontSize: 8, color: "var(--accent)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>{cat}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>{skills}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.55s" }}>
          <div className="section-label">Education</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { deg: "MS Data Science & AI", school: "Campbellsville University", year: "2024–2026" },
              { deg: "MS Computer Science", school: "Arkansas State University", year: "2020–2021" },
              { deg: "B.Tech Mechanical Engineering", school: "Hindustan University", year: "2013–2017" },
            ].map((e, i) => (
              <div key={e.deg} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-display)" }}>{e.deg}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{e.school}</div>
                </div>
                <span style={{ fontSize: 11, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>{e.year}</span>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ fontSize: 10, color: "var(--dim)", paddingTop: 24, letterSpacing: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>Naveen Kumar · Nashville, TN</span>
          <span>Built with Claude + Next.js · Vercel</span>
        </footer>

      </main>
    </>
  );
}