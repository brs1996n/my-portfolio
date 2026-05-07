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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #f0ede6; font-family: 'DM Mono', monospace; }
        ::selection { background: #c8f04d; color: #0a0a0a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .fade-in { animation: fadeIn 0.6s ease forwards; opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }
        .slide-up { animation: slideUp 0.5s ease forwards; opacity: 0; transform: translateY(16px); }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        .tag { display: inline-block; border: 1px solid #2a2a2a; border-radius: 999px; padding: 4px 14px; font-size: 11px; color: #888; transition: all 0.2s; cursor: default; }
        .tag:hover { border-color: #c8f04d; color: #c8f04d; }
        .accent { color: #c8f04d; }
        .chat-input:focus { outline: none; border-color: #c8f04d; }
      `}</style>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 120px" }}>

        {/* Hero */}
        <section className="fade-in" style={{ display: "flex", gap: 40, alignItems: "flex-start", marginBottom: 80, animationDelay: "0.1s" }}>
          {/* Photo placeholder — replace /headshot.jpg with your image */}
          <div style={{
            width: 100, height: 100, borderRadius: "50%", flexShrink: 0,
            border: "2px solid #c8f04d", overflow: "hidden", background: "#1a1a1a",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 11
          }}>
            <img src="/IMG_5176_Original.jpeg" alt="Naveen" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span style={{ position: "absolute" }}>photo</span>
          </div>

          <div>
            <p style={{ fontSize: 11, color: "#555", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
              Available for new roles
            </p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 12, letterSpacing: -1 }}>
              Naveen<br />Kumar
            </h1>
            <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, maxWidth: 380, marginBottom: 20 }}>
              Senior Data Engineer — 7+ years building enterprise-scale data platforms across{" "}
              <span className="accent">healthcare & finance</span>.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href="https://www.linkedin.com/in/naveenkumarbrs/" target="_blank"
                style={{ textDecoration: "none", border: "1px solid #2a2a2a", borderRadius: 999, padding: "6px 16px", fontSize: 11, color: "#aaa", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#c8f04d"; (e.target as HTMLElement).style.color = "#c8f04d"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#2a2a2a"; (e.target as HTMLElement).style.color = "#aaa"; }}>
                → LinkedIn
              </a>
              <a href="mailto:nvnkmr1996@gmail.com"
                style={{ textDecoration: "none", border: "1px solid #2a2a2a", borderRadius: 999, padding: "6px 16px", fontSize: 11, color: "#aaa", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#c8f04d"; (e.target as HTMLElement).style.color = "#c8f04d"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#2a2a2a"; (e.target as HTMLElement).style.color = "#aaa"; }}>
                → Email
              </a>
              <span style={{ border: "1px solid #1e3a00", borderRadius: 999, padding: "6px 16px", fontSize: 11, color: "#c8f04d", background: "#0d1f00" }}>
                ● Nashville, TN
              </span>
            </div>
          </div>
        </section>

        {/* AI Chat */}
        <section className="slide-up" style={{ marginBottom: 80, animationDelay: "0.3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8f04d", boxShadow: "0 0 8px #c8f04d" }} />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>Ask my portfolio anything</h2>
            <span style={{ fontSize: 10, color: "#555", marginLeft: 4 }}>powered by Claude</span>
          </div>

          <div style={{ border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden", background: "#0f0f0f" }}>
            {/* Suggestions */}
            {messages.length === 0 && (
              <div style={{ padding: "24px 24px 0" }}>
                <p style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>try asking</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)}
                      style={{ textAlign: "left", background: "none", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#666", cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Mono', monospace" }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#c8f04d33"; (e.target as HTMLElement).style.color = "#c8f04d"; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#1e1e1e"; (e.target as HTMLElement).style.color = "#666"; }}>
                      → {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div style={{ padding: "24px 24px 0", maxHeight: 320, overflowY: "auto" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 20, animationDelay: `${i * 0.05}s` }} className="fade-in">
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: m.role === "user" ? "#c8f04d" : "#555", marginBottom: 6 }}>
                      {m.role === "user" ? "you" : "naveen"}
                    </div>
                    <div style={{ fontSize: 13, color: m.role === "user" ? "#f0ede6" : "#999", lineHeight: 1.7 }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#555", marginBottom: 6 }}>naveen</div>
                    <div style={{ fontSize: 13, color: "#555" }}>thinking<span style={{ animation: "blink 1s infinite" }}>...</span></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            <div style={{ padding: 16, display: "flex", gap: 10, borderTop: "1px solid #1a1a1a" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Ask me anything..."
                className="chat-input"
                style={{ flex: 1, background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f0ede6", fontFamily: "'DM Mono', monospace", transition: "border-color 0.2s" }}
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                style={{ background: input.trim() && !loading ? "#c8f04d" : "#1a1a1a", color: input.trim() && !loading ? "#0a0a0a" : "#333", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 600, cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.2s", fontFamily: "'DM Mono', monospace" }}>
                Send
              </button>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="slide-up" style={{ marginBottom: 64, animationDelay: "0.4s" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#444", letterSpacing: 3, textTransform: "uppercase", marginBottom: 32 }}>Experience</h2>
          {[
            { role: "Senior Data Engineer", company: "TCS · CVS Health", period: "Feb 2024 – Present", tag: "Current", points: ["Event-driven ingestion on GCP Pub/Sub — 60% latency reduction", "dbt medallion architecture: staging → intermediate → marts", "CI/CD automation cutting deployment cycles by 70%", "Enterprise EDM framework — 90% faster execution"] },
            { role: "Data Engineer", company: "Tekinvaderz · Aetna", period: "Aug 2021 – Jan 2024", tag: "", points: ["Migrated 500+ Teradata tables to BigQuery Lakehouse", "99.9% data accuracy with automated reconciliation", "HIPAA-compliant security with GCP Secret Manager"] },
            { role: "Data Engineer", company: "Infosys · Experian", period: "Feb 2018 – Dec 2019", tag: "", points: ["Batch ingestion pipelines for consumer credit datasets", "60% reduction in manual reconciliation via automation"] },
          ].map((job, i) => (
            <div key={job.company} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid #141414" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{job.role}</span>
                  {job.tag && <span style={{ marginLeft: 10, fontSize: 9, background: "#0d1f00", color: "#c8f04d", border: "1px solid #1e3a00", borderRadius: 999, padding: "2px 8px", letterSpacing: 1 }}>{job.tag}</span>}
                  <div style={{ color: "#555", fontSize: 11, marginTop: 4 }}>{job.company}</div>
                </div>
                <span style={{ color: "#444", fontSize: 11 }}>{job.period}</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {job.points.map(p => (
                  <li key={p} style={{ fontSize: 12, color: "#666", paddingLeft: 16, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#c8f04d" }}>—</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="slide-up" style={{ marginBottom: 64, animationDelay: "0.5s" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#444", letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>Skills</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { cat: "Cloud", skills: "GCP · BigQuery · Dataproc · AWS" },
              { cat: "Languages", skills: "Python · SQL · PySpark" },
              { cat: "Data Eng", skills: "Spark · Kafka · dbt · ETL/ELT" },
              { cat: "Databases", skills: "BigQuery · Snowflake · Teradata" },
              { cat: "BI", skills: "Power BI · Tableau · Looker" },
              { cat: "Domain", skills: "Healthcare · FACETS · CMS" },
            ].map(({ cat, skills }) => (
              <div key={cat} style={{ padding: "16px", border: "1px solid #161616", borderRadius: 10, background: "#0d0d0d" }}>
                <div style={{ fontSize: 9, color: "#c8f04d", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{cat}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{skills}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="slide-up" style={{ marginBottom: 64, animationDelay: "0.6s" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#444", letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>Education</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { deg: "MS Data Science & AI", school: "Campbellsville University", year: "2024–2026" },
              { deg: "MS Computer Science", school: "Arkansas State University", year: "2020–2021" },
              { deg: "B.Tech Mechanical Engineering", school: "Hindustan University", year: "2013–2017" },
            ].map(e => (
              <div key={e.deg} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #141414", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#ccc" }}>{e.deg}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{e.school}</div>
                </div>
                <span style={{ fontSize: 11, color: "#444" }}>{e.year}</span>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ fontSize: 10, color: "#333", borderTop: "1px solid #141414", paddingTop: 24, letterSpacing: 1 }}>
          Built with Claude + Next.js · Deployed on Vercel
        </footer>
      </main>
    </>
  );
}