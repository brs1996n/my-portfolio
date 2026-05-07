"use client";
import { useState } from "react";

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

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.message }]);
    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 font-mono text-sm text-gray-900">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold mb-1">Naveen Kumar</h1>
        <p className="text-gray-600 mb-1">Senior Data Engineer — Healthcare & Finance</p>
        <p className="text-gray-400 mb-4">Nashville, TN</p>
        <div className="flex gap-4 text-xs">
          <a href="https://www.linkedin.com/in/naveenkumarbrs/" target="_blank" className="hover:underline">→ LinkedIn</a>
          <a href="mailto:nvnkmr1996@gmail.com" className="hover:underline">→ Email</a>
        </div>
      </div>

      {/* AI Chat */}
      <div className="mb-12 border border-gray-200 rounded-lg p-5">
        <p className="font-semibold mb-1">Ask my portfolio anything</p>
        <p className="text-gray-400 text-xs mb-4">Powered by Claude</p>

        {messages.length === 0 && (
          <div className="mb-4">
            <p className="text-gray-400 text-xs mb-2">try asking</p>
            <div className="flex flex-col gap-1">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-left text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  → {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`text-xs ${m.role === "user" ? "text-gray-900 font-medium" : "text-gray-600"}`}>
              <span className="text-gray-300 mr-2">{m.role === "user" ? "you" : "naveen"}</span>
              {m.content}
            </div>
          ))}
          {loading && <div className="text-xs text-gray-400">thinking...</div>}
        </div>

        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask something..." 
            className="flex-1 text-xs border border-gray-200 rounded px-3 py-2 outline-none focus:border-gray-400" />
          <button onClick={() => sendMessage(input)}
            className="text-xs px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors">
            Send
          </button>
        </div>
      </div>

      {/* Experience */}
      <section className="mb-10">
        <h2 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">Experience</h2>
        {[
          { role: "Senior Data Engineer", company: "TCS (CVS Health)", period: "Feb 2024 – Present", points: ["Event-driven ingestion on GCP Pub/Sub, reducing latency by 60%", "dbt transformation layers following medallion architecture", "CI/CD automation reducing deployment cycles by 70%"] },
          { role: "Data Engineer", company: "Tekinvaderz (Aetna)", period: "Aug 2021 – Jan 2024", points: ["Migrated 500+ Teradata tables to BigQuery, improving query performance by 50%", "Achieved 99.9% data accuracy with automated reconciliation", "HIPAA-compliant security with GCP Secret Manager"] },
          { role: "Data Engineer", company: "Infosys (Experian)", period: "Feb 2018 – Dec 2019", points: ["Batch ingestion pipelines for consumer credit datasets", "Reduced manual reconciliation by 60% through automated validation"] },
        ].map((job) => (
          <div key={job.company} className="mb-6">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-medium">{job.role}</span>
                <span className="text-gray-400"> · {job.company}</span>
              </div>
              <span className="text-gray-400 text-xs whitespace-nowrap ml-4">{job.period}</span>
            </div>
            <ul className="text-gray-500 space-y-0.5">
              {job.points.map((p) => <li key={p}>— {p}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="mb-10">
        <h2 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">Skills</h2>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          {[
            ["Cloud", "GCP, AWS, BigQuery, Dataproc"],
            ["Languages", "Python, SQL, PySpark"],
            ["Data Eng", "Spark, Kafka, dbt, ETL/ELT"],
            ["Databases", "BigQuery, Snowflake, Teradata"],
            ["BI", "Power BI, Tableau, Looker"],
            ["Domain", "Healthcare, FACETS, CMS"],
          ].map(([cat, val]) => (
            <div key={cat}>
              <span className="text-gray-400">{cat} · </span>{val}
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <h2 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-4">Education</h2>
        <div className="space-y-2 text-xs text-gray-600">
          <div><span className="text-gray-900 font-medium">MS Data Science & AI</span> · Campbellsville University · 2024–2026</div>
          <div><span className="text-gray-900 font-medium">MS Computer Science</span> · Arkansas State University · 2020–2021</div>
          <div><span className="text-gray-900 font-medium">B.Tech Mechanical Engineering</span> · Hindustan University · 2013–2017</div>
        </div>
      </section>

      <footer className="text-xs text-gray-300 pt-6 border-t border-gray-100">
        Built with Claude + Next.js
      </footer>
    </main>
  );
}