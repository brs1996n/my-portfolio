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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F8FAFC;
          --bg-card: rgba(255,255,255,0.85);
          --bg-card-solid: #FFFFFF;
          --text-primary: #0F172A;
          --text-secondary: #475569;
          --text-muted: #94A3B8;
          --border: #E2E8F0;
          --border-light: #F1F5F9;
          --accent: #0D9488;
          --accent-light: #F0FDFA;
          --accent-mid: #CCFBF1;
          --accent-text: #0F766E;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04);
          --shadow-lg: 0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
          --shadow-xl: 0 24px 64px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06);
          --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --radius-sm: 10px;
          --radius-md: 16px;
          --radius-lg: 24px;
          --radius-full: 999px;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text-primary);
          font-family: var(--font);
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Soft background gradients */
        body::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        body::after {
          content: '';
          position: fixed;
          bottom: -150px; right: -150px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        main { position: relative; z-index: 1; }

        ::selection { background: #CCFBF1; color: #0F766E; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 2px; }

        /* Animations */
        .fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
          opacity: 0; transform: translateY(16px);
        }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        /* Availability badge */
        .avail-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--accent-light);
          border: 1px solid var(--accent-mid);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          font-size: 12px; font-weight: 500;
          color: var(--accent-text);
          margin-bottom: 20px;
          width: fit-content;
        }
        .avail-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent);
          animation: pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Hero name */
        .hero-name {
          font-size: clamp(44px, 8vw, 68px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -2px;
          background: linear-gradient(135deg, #0F172A 0%, #0F766E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
        }

        /* Photo */
        .photo-wrap {
          width: 110px; height: 110px; border-radius: 50%; flex-shrink: 0;
          padding: 3px;
          background: linear-gradient(135deg, #0D9488, #6366F1);
          box-shadow: var(--shadow-lg);
        }
        .photo-inner {
          width: 100%; height: 100%; border-radius: 50%;
          overflow: hidden; background: #f1f5f9;
          border: 3px solid white;
        }
        .photo-inner img { width: 100%; height: 100%; object-fit: cover; }

        /* Pill links */
        .pill-link {
          display: inline-flex; align-items: center; gap: 6px;
          text-decoration: none;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 8px 18px;
          font-size: 13px; font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }
        .pill-link:hover {
          border-color: #CBD5E1;
          background: #F8FAFC;
          color: var(--text-primary);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .pill-loc {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--accent-light);
          border: 1px solid var(--accent-mid);
          border-radius: var(--radius-full);
          padding: 8px 18px;
          font-size: 13px; font-weight: 500;
          color: var(--accent-text);
        }

        /* Chat card */
        .chat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          backdrop-filter: blur(20px);
          transition: box-shadow 0.3s ease;
        }
        .chat-card:focus-within {
          box-shadow: var(--shadow-xl), 0 0 0 3px rgba(13,148,136,0.08);
          border-color: #CBD5E1;
        }

        /* Suggest buttons */
        .suggest-btn {
          width: 100%;
          text-align: left;
          background: #FAFAFA;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: var(--font);
          transition: all 0.15s ease;
          display: flex; align-items: center; gap: 10px;
        }
        .suggest-btn:hover {
          background: var(--accent-light);
          border-color: var(--accent-mid);
          color: var(--accent-text);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
        .suggest-arrow {
          color: var(--accent);
          font-size: 14px;
          flex-shrink: 0;
        }

        /* Chat input */
        .chat-input {
          flex: 1;
          background: #FAFAFA;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text-primary);
          font-family: var(--font);
          outline: none;
          transition: all 0.2s;
        }
        .chat-input::placeholder { color: var(--text-muted); }
        .chat-input:focus {
          border-color: var(--accent);
          background: white;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.08);
        }

        /* Send button */
        .send-btn {
          border: none; border-radius: var(--radius-sm);
          padding: 12px 22px;
          font-size: 14px; font-weight: 600;
          font-family: var(--font);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
          white-space: nowrap;
        }
        .send-btn.active {
          background: var(--accent);
          color: white;
          box-shadow: 0 2px 8px rgba(13,148,136,0.3);
        }
        .send-btn.active:hover {
          background: #0F766E;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(13,148,136,0.35);
        }
        .send-btn.inactive {
          background: #F1F5F9;
          color: var(--text-muted);
          cursor: default;
        }

        /* Experience cards */
        .exp-card {
          background: var(--bg-card-solid);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 28px;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }
        .exp-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
          border-color: #CBD5E1;
        }
        .exp-card.current::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), #6366F1);
        }

        /* Skill cards */
        .skill-card {
          background: var(--bg-card-solid);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }
        .skill-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
          border-color: var(--accent-mid);
          background: var(--accent-light);
        }

        /* Section label */
        .section-label {
          font-size: 11px; font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 28px;
          display: flex; align-items: center; gap: 12px;
        }
        .section-label::after {
          content: ''; flex: 1; height: 1px;
          background: var(--border);
        }

        /* Dot loader */
        .dot-loader span {
          display: inline-block;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent);
          animation: dotBounce 1.4s ease-in-out infinite;
          margin: 0 2px;
        }
        .dot-loader span:nth-child(2) { animation-delay: 0.2s; }
        .dot-loader span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 600px) {
          .hero-row { flex-direction: column !important; gap: 24px !important; }
          .hero-name { font-size: 44px !important; }
        }
      `}</style>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 120px" }}>

        {/* Hero */}
        <section className="fade-up hero-row" style={{ display: "flex", gap: 40, alignItems: "flex-start", marginBottom: 96, animationDelay: "0.05s" }}>
          <div className="photo-wrap">
            <div className="photo-inner">
              <img src="/IMG_5176_Original.jpeg" alt="Naveen Kumar" />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="avail-badge">
              <div className="avail-dot" />
              Available for new roles
            </div>
            <h1 className="hero-name">Naveen<br />Kumar</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.75, maxWidth: 420, marginBottom: 24 }}>
              Senior Data Engineer — 7+ years building enterprise-scale data platforms across{" "}
              <span style={{ color: "var(--accent-text)", fontWeight: 500 }}>healthcare & finance</span>.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href="https://www.linkedin.com/in/naveenkumarbrs/" target="_blank" className="pill-link">→ LinkedIn</a>
              <a href="mailto:nvnkmr1996@gmail.com" className="pill-link">→ Email</a>
              <span className="pill-loc">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                Nashville, TN
              </span>
            </div>
          </div>
        </section>

        {/* AI Chat */}
        <section className="fade-up" style={{ marginBottom: 88, animationDelay: "0.2s" }}>
          <div className="section-label">Ask my portfolio anything</div>

          <div className="chat-card">
            {/* Header */}
            <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, background: "rgba(248,250,252,0.6)" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-light)", border: "1px solid var(--accent-mid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Ask my portfolio anything</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Powered by Claude AI</div>
              </div>
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Try asking</p>
                {suggestions.map((s) => (
                  <button key={s} className="suggest-btn" onClick={() => sendMessage(s)}>
                    <span className="suggest-arrow">→</span>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div style={{ padding: "24px", maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
                {messages.map((m, i) => (
                  <div key={i} className="fade-up">
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: m.role === "user" ? "var(--accent-text)" : "var(--text-muted)", marginBottom: 8 }}>
                      {m.role === "user" ? "You" : "Naveen"}
                    </div>
                    <div style={{ fontSize: 14, color: m.role === "user" ? "var(--text-primary)" : "var(--text-secondary)", lineHeight: 1.75, background: m.role === "assistant" ? "#FAFAFA" : "transparent", padding: m.role === "assistant" ? "14px 16px" : "0", borderRadius: m.role === "assistant" ? 10 : 0, border: m.role === "assistant" ? "1px solid var(--border)" : "none" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Naveen</div>
                    <div className="dot-loader"><span /><span /><span /></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            <div style={{ padding: 16, display: "flex", gap: 10, borderTop: "1px solid var(--border)", background: "rgba(248,250,252,0.4)", marginTop: messages.length === 0 ? 16 : 0 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Ask me anything..."
                className="chat-input"
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className={`send-btn ${input.trim() && !loading ? "active" : "inactive"}`}>
                Send
              </button>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.3s" }}>
          <div className="section-label">Experience</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { role: "Senior Data Engineer", company: "TCS · CVS Health", period: "Feb 2024 – Present", current: true, points: ["Event-driven ingestion on GCP Pub/Sub — 60% latency reduction", "dbt medallion architecture: staging → intermediate → marts", "CI/CD automation cutting deployment cycles by 70%", "Enterprise EDM framework — 90% faster execution"] },
              { role: "Data Engineer", company: "Tekinvaderz · Aetna", period: "Aug 2021 – Jan 2024", current: false, points: ["Migrated 500+ Teradata tables to BigQuery Lakehouse — 50% faster queries", "99.9% data accuracy with automated reconciliation", "HIPAA-compliant security with GCP Secret Manager"] },
              { role: "Data Engineer", company: "Infosys · Experian", period: "Feb 2018 – Dec 2019", current: false, points: ["Batch ingestion pipelines for consumer credit datasets", "60% reduction in manual reconciliation via automation"] },
            ].map((job) => (
              <div key={job.company} className={`exp-card ${job.current ? "current" : ""}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{job.role}</span>
                      {job.current && (
                        <span style={{ fontSize: 10, background: "var(--accent-light)", color: "var(--accent-text)", border: "1px solid var(--accent-mid)", borderRadius: 999, padding: "2px 10px", fontWeight: 600, letterSpacing: 0.5 }}>Current</span>
                      )}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{job.company}</div>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>{job.period}</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {job.points.map(p => (
                    <li key={p} style={{ fontSize: 14, color: "var(--text-secondary)", paddingLeft: 18, position: "relative", lineHeight: 1.6 }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--accent)", fontWeight: 700 }}>·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.4s" }}>
          <div className="section-label">Skills</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { cat: "Cloud", skills: "GCP · BigQuery · Dataproc · AWS" },
              { cat: "Languages", skills: "Python · SQL · PySpark" },
              { cat: "Data Engineering", skills: "Spark · Kafka · dbt · ETL/ELT" },
              { cat: "Databases", skills: "BigQuery · Snowflake · Teradata" },
              { cat: "BI & Analytics", skills: "Power BI · Tableau · Looker" },
              { cat: "Domain", skills: "Healthcare · FACETS · CMS" },
            ].map(({ cat, skills }) => (
              <div key={cat} className="skill-card">
                <div style={{ fontSize: 10, color: "var(--accent-text)", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{cat}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{skills}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="fade-up" style={{ marginBottom: 72, animationDelay: "0.5s" }}>
          <div className="section-label">Education</div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            {[
              { deg: "MS Data Science & AI", school: "Campbellsville University", year: "2024–2026" },
              { deg: "MS Computer Science", school: "Arkansas State University", year: "2020–2021" },
              { deg: "B.Tech Mechanical Engineering", school: "Hindustan University", year: "2013–2017" },
            ].map((e, i, arr) => (
              <div key={e.deg} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none", flexWrap: "wrap", gap: 8, transition: "background 0.15s" }}
                onMouseEnter={el => (el.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={el => (el.currentTarget.style.background = "transparent")}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{e.deg}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{e.school}</div>
                </div>
                <span style={{ fontSize: 13, color: "var(--text-muted)", background: "#F1F5F9", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px" }}>{e.year}</span>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ fontSize: 12, color: "var(--text-muted)", paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>Naveen Kumar · Nashville, TN</span>
          <span>Built with Claude + Next.js · Deployed on Vercel</span>
        </footer>

      </main>
    </>
  );
}