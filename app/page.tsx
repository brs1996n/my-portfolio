"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";

const suggestions = [
  "What's your strongest technical skill?",
  "Tell me about your CVS Health work",
  "How did you eliminate $10M/year in licensing costs?",
  "Why should I hire you?",
];

const experience = [
  {
    role: "Senior Data Engineer", company: "TCS", client: "CVS Health / Aetna", period: "Feb 2024 – Present", current: true,
    points: [
      "Own 180+ of 600+ production pipelines processing ~2 TB/day across HCB, PBM and Retail on GCP",
      "Real-time PBM alerting that auto-raises vendor emails and ServiceNow tickets, avoiding SLA fines of $50K–$300K per incident",
      "Event-driven ingestion on Pub/Sub and Cloud Functions with 60% lower end-to-end latency",
      "CI/CD and an enterprise EDM framework: 90% faster execution, 70% shorter deployment cycles, 80+ hours/month saved",
      "Rebuilt claims and enrollment models in a dbt medallion architecture; incremental merges cut processing and warehouse cost by 20%",
      "Migrated BigQuery tables to Snowflake with SQL/Python source-to-target reconciliation",
    ],
  },
  {
    role: "Data Engineer", company: "Tekinvaderz", client: "CVS Health / Aetna", period: "Aug 2021 – Jan 2024", current: false,
    points: [
      "Architected Sqoop ingestion/egress frameworks that replaced Infoworks, eliminating $10M/year in licensing org-wide",
      "Built a Python/JDBC migration validation framework with PHI/PII detection that replaced a 6-person QA team across 12 projects",
      "Consolidated 50+ DAGs and Cloud Functions into one config-driven repo, saving 2+ months/year of deployment and maintenance",
      "HIPAA-aligned controls with Secret Manager, access scoping and audit logging; mentored 4 junior engineers",
    ],
  },
  {
    role: "Graduate Assistant", company: "Arkansas State University", client: null, period: "Jun 2020 – Aug 2021", current: false,
    points: [
      "Automated Python/SQL analytics pipelines serving 15+ university departments",
      "Dimensional models and Tableau dashboards that cut reporting turnaround by 50%",
    ],
  },
  {
    role: "Data Engineer", company: "Infosys", client: "Experian", period: "Feb 2018 – Dec 2019", current: false,
    points: [
      "Enterprise ETL workflows and dimensional models for high-volume consumer datasets",
      "Automated data quality validation, reducing manual reconciliation by 60%; tuned queries to meet SLAs",
      "Worked directly with Experian stakeholders on requirements and pipeline performance findings",
    ],
  },
];

const skills = [
  { cat: "Cloud", tone: "teal", items: ["GCP", "BigQuery", "Dataproc", "Pub/Sub", "Cloud Functions", "Cloud Storage", "AWS", "Lambda", "Athena", "Redshift"] },
  { cat: "Data engineering", tone: "sky", items: ["Spark", "Kafka", "dbt", "ETL/ELT", "Data modeling", "Governance", "Lineage", "Streaming"] },
  { cat: "Languages", tone: "violet", items: ["Python", "SQL", "PySpark"] },
  { cat: "Databases", tone: "teal", items: ["BigQuery", "Snowflake", "PostgreSQL", "SQL Server", "Teradata", "MySQL"] },
  { cat: "Orchestration", tone: "sky", items: ["Airflow", "Cloud Composer", "Docker", "Kubernetes"] },
  { cat: "CI/CD", tone: "violet", items: ["Git", "Jenkins", "GitHub Actions", "Bamboo", "GitLab", "Octopus Deploy"] },
  { cat: "BI & analytics", tone: "teal", items: ["Power BI", "Tableau", "Looker", "Excel"] },
  { cat: "AI & automation", tone: "sky", items: ["Claude", "Gemini", "LLM agents", "Agent-based migration tooling"] },
  { cat: "Healthcare domain", tone: "violet", items: ["Claims", "Member & provider", "FACETS", "CMS reporting", "HIPAA"] },
];

const education = [
  { deg: "MS, Data Science & AI", school: "Campbellsville University", year: "2024–2026" },
  { deg: "MS, Computer Science", school: "Arkansas State University", year: "2020–2021" },
  { deg: "B.E., Mechanical Engineering", school: "Hindustan University", year: "2013–2017" },
];

const credentials = [
  { name: "Claude Certified Architect – Foundations", org: "Anthropic", tag: "Issued Sep 2026", href: "https://www.credly.com/badges/ab8a5d16-6ef7-4dc0-9ad9-de93c6ea3b3c", featured: true },
  { name: "Associate Cloud Engineer", org: "Google Cloud", tag: "Certified" },
  { name: "Claude with Google Cloud's Vertex AI", org: "Anthropic", tag: "Certified" },
  { name: "Professional Cloud Architect", org: "Google Cloud", tag: "In progress" },
  { name: "TCS Gems – On the Spot Award", org: "Tata Consultancy Services", tag: "2025, 2026" },
  { name: "TCS Gems – Applaud Award", org: "Tata Consultancy Services", tag: "2026" },
];

/* ── Render the assistant's light markdown (bold + lists) safely ── */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part.replace(/\*\*/g, "").replace(/(^|\s)\*(\S[^*]*\S|\S)\*(?=\s|$|[.,;:!?])/g, "$1$2")}</span>
  );
}

function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(<Tag key={blocks.length}>{list.items.map((it, i) => <li key={i}>{inline(it)}</li>)}</Tag>);
    list = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flush();
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet || numbered)![1]);
      continue;
    }
    flush();
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push(heading
      ? <p key={blocks.length} className="rt-h">{inline(heading[1])}</p>
      : <p key={blocks.length}>{inline(line)}</p>);
  }
  flush();
  return <div className="rt">{blocks}</div>;
}

/* ── Signature background: data packets flowing along pipeline streams ── */
function DataStreams() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = ["45,212,191", "56,189,248", "167,139,250", "244,114,182"];
    let w = 0, h = 0, raf = 0;
    type Stream = { y: number; amp: number; freq: number; phase: number; color: string; packets: { x: number; speed: number; size: number }[] };
    let streams: Stream[] = [];

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 700 ? 6 : 9;
      streams = Array.from({ length: count }, (_, i) => ({
        y: h * (0.08 + (0.84 * i) / (count - 1)),
        amp: 30 + Math.random() * 70,
        freq: 0.0015 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
        packets: Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => ({
          x: Math.random() * w, speed: 0.35 + Math.random() * 0.9, size: 1.4 + Math.random() * 1.8,
        })),
      }));
    };
    const yAt = (s: Stream, x: number, t: number) => s.y + Math.sin(x * s.freq + s.phase + t * 0.00012) * s.amp;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of streams) {
        ctx.beginPath();
        for (let x = -10; x <= w + 10; x += 12) {
          const y = yAt(s, x, t);
          if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${s.color},0.09)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        for (const p of s.packets) {
          if (!reduce) { p.x += p.speed; if (p.x > w + 80) p.x = -80; }
          const y = yAt(s, p.x, t);
          const trail = ctx.createLinearGradient(p.x - 70, y, p.x, y);
          trail.addColorStop(0, `rgba(${s.color},0)`);
          trail.addColorStop(1, `rgba(${s.color},0.55)`);
          ctx.beginPath();
          for (let k = 70; k >= 0; k -= 7) {
            const tx = p.x - k, ty = yAt(s, tx, t);
            if (k === 70) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
          }
          ctx.strokeStyle = trail; ctx.lineWidth = p.size; ctx.lineCap = "round"; ctx.stroke();
          ctx.beginPath();
          ctx.arc(p.x, y, p.size + 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},0.95)`;
          ctx.shadowColor = `rgba(${s.color},0.9)`; ctx.shadowBlur = 14;
          ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    build();
    draw(0);
    const onResize = () => { cancelAnimationFrame(raf); build(); draw(performance.now()); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="streams" aria-hidden="true" />;
}

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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
      setMessages([...newMessages, { role: "assistant", content: "The assistant couldn't be reached. Try again in a moment." }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Inter:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --night: #070B1F;
          --ink: #0E1533;
          --surface: rgba(17, 25, 58, 0.62);
          --surface-solid: #131B3E;
          --line: rgba(148, 163, 255, 0.14);
          --line-strong: rgba(148, 163, 255, 0.28);
          --text: #EEF1FB;
          --text2: #B7BFDC;
          --text3: #8089AD;
          --teal: #2DD4BF;
          --sky: #38BDF8;
          --violet: #A78BFA;
          --pink: #F472B6;
          --display: 'Bricolage Grotesque', 'Inter', system-ui, sans-serif;
          --body: 'Inter', system-ui, -apple-system, sans-serif;
        }

        html { background: var(--night); scroll-behavior: smooth; }
        body {
          background: var(--night);
          color: var(--text);
          font-family: var(--body);
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          overflow-x: hidden;
        }
        ::selection { background: rgba(45,212,191,0.35); color: #fff; }
        a { color: inherit; }
        :focus-visible { outline: 2px solid var(--sky); outline-offset: 3px; border-radius: 6px; }

        /* ── Background ── */
        .aurora {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(60vw 50vh at 8% -5%, rgba(45,212,191,0.28), transparent 60%),
            radial-gradient(55vw 55vh at 100% 15%, rgba(139,92,246,0.30), transparent 60%),
            radial-gradient(60vw 50vh at 70% 105%, rgba(56,189,248,0.22), transparent 60%),
            radial-gradient(40vw 40vh at 0% 80%, rgba(244,114,182,0.14), transparent 60%),
            linear-gradient(180deg, #0A1030 0%, #070B1F 55%, #0A0E28 100%);
        }
        .streams { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .vignette {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 55%, rgba(4,6,18,0.55) 100%);
        }

        main { position: relative; z-index: 1; width: 100%; max-width: 820px; margin: 0 auto; padding: 88px 20px 120px; }

        /* ── Hero (the one entrance animation) ── */
        .hero { display: flex; gap: 36px; align-items: center; margin-bottom: 72px; animation: rise .9s cubic-bezier(.16,1,.3,1) both; }
        @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .photo {
          width: 148px; height: 148px; flex-shrink: 0; border-radius: 50%; padding: 3px;
          background: conic-gradient(from 200deg, var(--teal), var(--sky), var(--violet), var(--pink), var(--teal));
          box-shadow: 0 0 60px rgba(56,189,248,0.35), 0 0 120px rgba(139,92,246,0.25);
        }
        .photo img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; border: 3px solid var(--night); }
        .status {
          display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500;
          color: #9FF3E6; background: rgba(45,212,191,0.12); border: 1px solid rgba(45,212,191,0.35);
          padding: 5px 13px; border-radius: 999px; margin-bottom: 16px;
        }
        .status i { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 10px var(--teal); }
        h1 {
          font-family: var(--display); font-weight: 800; font-size: clamp(48px, 9vw, 84px);
          line-height: 0.92; letter-spacing: -0.035em; margin-bottom: 18px;
          background: linear-gradient(100deg, #FFFFFF 10%, #A5F3FC 45%, #C4B5FD 75%, #F9A8D4 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero > div { min-width: 0; }
        .lede { font-size: 17px; line-height: 1.65; color: var(--text2); max-width: 46ch; margin-bottom: 24px; }
        .actions { display: flex; flex-wrap: wrap; gap: 10px; }
        .btn {
          display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
          font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 12px;
          border: 1px solid var(--line-strong); background: rgba(255,255,255,0.04); color: var(--text);
          transition: background .2s, border-color .2s, transform .2s;
        }
        .btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(165,243,252,0.5); transform: translateY(-1px); }
        .btn.primary { background: linear-gradient(120deg, var(--teal), var(--sky)); color: #04121F; border-color: transparent; }
        .btn.primary:hover { filter: brightness(1.08); }
        .btn.place { color: var(--text3); border-style: dashed; cursor: default; }
        .btn.place:hover { transform: none; background: rgba(255,255,255,0.04); border-color: var(--line-strong); }

        /* ── Section headings ── */
        section { margin-bottom: 72px; }
        h2 {
          font-family: var(--display); font-weight: 700; font-size: 30px; letter-spacing: -0.02em;
          margin-bottom: 22px; color: var(--text);
        }
        h2 small { display: block; font-family: var(--body); font-size: 14px; font-weight: 400; color: var(--text3); letter-spacing: 0; margin-top: 4px; }

        /* ── Chat ── */
        .chat {
          border-radius: 24px; overflow: hidden; position: relative;
          background: linear-gradient(180deg, rgba(23,32,72,0.82), rgba(14,21,51,0.82));
          border: 1px solid var(--line-strong);
          box-shadow: 0 30px 80px rgba(2,4,20,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        }
        .chat::before {
          content: ''; position: absolute; inset: 0 0 auto 0; height: 2px;
          background: linear-gradient(90deg, var(--teal), var(--sky), var(--violet), var(--pink));
        }
        .chat-head { display: flex; align-items: center; gap: 12px; padding: 20px 22px; border-bottom: 1px solid var(--line); }
        .chat-icon {
          width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; font-size: 17px; color: #fff;
          background: linear-gradient(135deg, var(--teal), var(--violet)); box-shadow: 0 0 24px rgba(139,92,246,0.45);
        }
        .chat-title { font-weight: 600; font-size: 15px; }
        .chat-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
        .suggests { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 18px 18px 0; }
        .suggest {
          text-align: left; font: inherit; font-size: 14px; line-height: 1.45; color: var(--text2); cursor: pointer;
          background: rgba(255,255,255,0.035); border: 1px solid var(--line); border-radius: 14px; padding: 13px 15px;
          transition: background .18s, border-color .18s, color .18s;
        }
        .suggest:hover { background: rgba(56,189,248,0.10); border-color: rgba(56,189,248,0.45); color: var(--text); }
        .log { padding: 22px; max-height: 440px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .log::-webkit-scrollbar { width: 6px; }
        .log::-webkit-scrollbar-thumb { background: rgba(148,163,255,0.25); border-radius: 6px; }
        .who { font-size: 12px; font-weight: 600; color: var(--text3); margin-bottom: 6px; }
        .row { display: flex; flex-direction: column; }
        .row.user { align-items: flex-end; }
        .bubble-user {
          max-width: 85%; padding: 11px 15px; border-radius: 16px 16px 4px 16px; font-size: 14.5px; line-height: 1.6;
          background: linear-gradient(120deg, #14B8A6, #0EA5E9); color: #fff;
        }
        .bubble-ai {
          max-width: 92%; padding: 14px 18px; border-radius: 16px 16px 16px 4px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--line); color: var(--text2);
        }
        .rt { font-size: 14.5px; line-height: 1.7; display: flex; flex-direction: column; gap: 10px; }
        .rt strong { color: var(--text); font-weight: 600; }
        .rt .rt-h { color: var(--text); font-weight: 600; }
        .rt ul, .rt ol { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
        .rt li::marker { color: var(--teal); }
        .dots span { display: inline-block; width: 6px; height: 6px; margin: 0 2px; border-radius: 50%; background: var(--sky); animation: pulse 1.3s infinite ease-in-out; }
        .dots span:nth-child(2) { animation-delay: .15s; } .dots span:nth-child(3) { animation-delay: .3s; }
        @keyframes pulse { 0%,80%,100% { opacity: .25; transform: scale(.7); } 40% { opacity: 1; transform: scale(1); } }
        .composer { display: flex; gap: 10px; padding: 16px; border-top: 1px solid var(--line); background: rgba(7,11,31,0.35); }
        .composer input {
          flex: 1; min-width: 0; font: inherit; font-size: 14.5px; color: var(--text);
          background: rgba(255,255,255,0.05); border: 1px solid var(--line-strong); border-radius: 12px; padding: 12px 15px; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .composer input::placeholder { color: var(--text3); }
        .composer input:focus { border-color: var(--sky); box-shadow: 0 0 0 3px rgba(56,189,248,0.18); }
        .send {
          font: inherit; font-weight: 600; font-size: 14px; border: 0; border-radius: 12px; padding: 0 20px; cursor: pointer;
          background: linear-gradient(120deg, var(--teal), var(--sky)); color: #04121F; transition: filter .2s, opacity .2s;
        }
        .send:disabled { opacity: .35; cursor: default; }
        .send:not(:disabled):hover { filter: brightness(1.1); }

        /* ── Experience timeline (a real sequence) ── */
        .timeline { position: relative; padding-left: 30px; }
        .timeline::before {
          content: ''; position: absolute; left: 7px; top: 10px; bottom: 10px; width: 2px;
          background: linear-gradient(180deg, var(--teal), var(--sky) 40%, var(--violet) 75%, rgba(167,139,250,0.1));
        }
        .job { position: relative; margin-bottom: 18px; }
        .job::before {
          content: ''; position: absolute; left: -30px; top: 24px; width: 16px; height: 16px; border-radius: 50%;
          background: var(--night); border: 2px solid var(--sky);
        }
        .job.current::before { background: var(--teal); border-color: #A7F3D0; box-shadow: 0 0 0 5px rgba(45,212,191,0.18), 0 0 18px var(--teal); }
        .job-card {
          background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 22px 24px;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        }
        .job.current .job-card { border-color: rgba(45,212,191,0.4); background: linear-gradient(160deg, rgba(20,184,166,0.14), var(--surface) 45%); }
        .job-top { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .job-role { font-family: var(--display); font-size: 21px; font-weight: 700; letter-spacing: -0.01em; }
        .job-org { font-size: 14px; color: var(--sky); margin-top: 3px; font-weight: 500; }
        .job-org span { color: var(--text3); font-weight: 400; }
        .job-period { font-size: 13px; color: var(--text3); white-space: nowrap; padding-top: 4px; }
        .job ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .job li { position: relative; padding-left: 18px; font-size: 14.5px; line-height: 1.6; color: var(--text2); }
        .job li::before { content: ''; position: absolute; left: 0; top: .62em; width: 6px; height: 6px; border-radius: 2px; background: var(--teal); opacity: .8; }

        /* ── Skills ── */
        .skills { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
        .skill { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 16px 16px 14px; }
        .skill h3 { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: var(--text); }
        .chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip { font-size: 12.5px; padding: 4px 10px; border-radius: 999px; border: 1px solid; }
        .tone-teal .chip { color: #99F6E4; background: rgba(45,212,191,0.10); border-color: rgba(45,212,191,0.28); }
        .tone-sky .chip { color: #BAE6FD; background: rgba(56,189,248,0.10); border-color: rgba(56,189,248,0.28); }
        .tone-violet .chip { color: #DDD6FE; background: rgba(167,139,250,0.12); border-color: rgba(167,139,250,0.30); }

        /* ── Lists (education, credentials) ── */
        .list { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .item { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 17px 22px; border-bottom: 1px solid var(--line); text-decoration: none; }
        .item:last-child { border-bottom: 0; }
        a.item { transition: background .18s; }
        a.item:hover { background: rgba(255,255,255,0.04); }
        .item-name { font-size: 15px; font-weight: 600; color: var(--text); }
        .item-sub { font-size: 13.5px; color: var(--text3); margin-top: 3px; }
        .pill { font-size: 12.5px; color: var(--text2); border: 1px solid var(--line-strong); border-radius: 8px; padding: 3px 10px; white-space: nowrap; }
        .featured { background: linear-gradient(110deg, rgba(167,139,250,0.20), rgba(56,189,248,0.10) 60%, transparent); }
        .featured .item-name { font-size: 16px; }
        .featured .pill { color: #E9D5FF; border-color: rgba(167,139,250,0.55); background: rgba(167,139,250,0.15); }
        .verify { color: var(--violet); font-size: 13px; font-weight: 500; margin-left: 6px; }

        footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding-top: 26px; border-top: 1px solid var(--line); font-size: 13px; color: var(--text3); }

        @media (max-width: 720px) {
          main { padding-top: 56px; }
          .hero { flex-direction: column; align-items: flex-start; gap: 24px; }
          .photo { width: 120px; height: 120px; }
          .suggests { grid-template-columns: 1fr; }
          .job-card { padding: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero { animation: none; }
          html { scroll-behavior: auto; }
        }
      `}</style>

      <div className="aurora" />
      <DataStreams />
      <div className="vignette" />

      <main>
        <header className="hero">
          <div className="photo">
            <img src="/profile.webp" alt="Naveen Kumar" />
          </div>
          <div>
            <div className="status"><i />Open to new roles</div>
            <h1>Naveen<br />Kumar</h1>
            <p className="lede">
              Senior Data Engineer with 7+ years leading enterprise-scale GCP migrations and data platforms across healthcare and enterprise analytics.
            </p>
            <div className="actions">
              <a href="https://www.linkedin.com/in/naveenkumarbrs/" target="_blank" rel="noopener noreferrer" className="btn primary">LinkedIn</a>
              <a href="mailto:nvnkmr1996@gmail.com" className="btn">Email me</a>
              <span className="btn place">Nashville, TN</span>
            </div>
          </div>
        </header>

        <section aria-label="Ask my portfolio">
          <div className="chat">
            <div className="chat-head">
              <div className="chat-icon">✦</div>
              <div>
                <div className="chat-title">Ask my portfolio anything</div>
                <div className="chat-sub">Answers come from my resume, powered by Claude</div>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="suggests">
                {suggestions.map((s) => (
                  <button key={s} className="suggest" onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            )}

            {messages.length > 0 && (
              <div className="log" ref={scrollRef} aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`row ${m.role === "user" ? "user" : ""}`}>
                    <div className="who">{m.role === "user" ? "You" : "Naveen"}</div>
                    {m.role === "user"
                      ? <div className="bubble-user">{m.content}</div>
                      : <div className="bubble-ai"><RichText text={m.content} /></div>}
                  </div>
                ))}
                {loading && (
                  <div className="row">
                    <div className="who">Naveen</div>
                    <div className="bubble-ai"><div className="dots"><span /><span /><span /></div></div>
                  </div>
                )}
              </div>
            )}

            <div className="composer" style={{ marginTop: messages.length === 0 ? 18 : 0 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Ask about my experience, skills or projects"
                aria-label="Your question"
              />
              <button className="send" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>Send</button>
            </div>
          </div>
        </section>

        <section>
          <h2>Experience<small>4+ years with CVS Health / Aetna across two employers</small></h2>
          <div className="timeline">
            {experience.map((job) => (
              <article key={job.company + job.period} className={`job ${job.current ? "current" : ""}`}>
                <div className="job-card">
                  <div className="job-top">
                    <div>
                      <div className="job-role">{job.role}</div>
                      <div className="job-org">{job.company}{job.client && <span>, client {job.client}</span>}</div>
                    </div>
                    <div className="job-period">{job.period}</div>
                  </div>
                  <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Skills</h2>
          <div className="skills">
            {skills.map((s) => (
              <div key={s.cat} className={`skill tone-${s.tone}`}>
                <h3>{s.cat}</h3>
                <div className="chips">{s.items.map((it) => <span key={it} className="chip">{it}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Certifications and awards</h2>
          <div className="list">
            {credentials.map((c) => {
              const body = (
                <>
                  <div>
                    <div className="item-name">{c.name}</div>
                    <div className="item-sub">{c.org}{c.href && <span className="verify">Verify on Credly</span>}</div>
                  </div>
                  <span className="pill">{c.tag}</span>
                </>
              );
              return c.href
                ? <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" className={`item ${c.featured ? "featured" : ""}`}>{body}</a>
                : <div key={c.name} className="item">{body}</div>;
            })}
          </div>
        </section>

        <section>
          <h2>Education</h2>
          <div className="list">
            {education.map((e) => (
              <div key={e.deg} className="item">
                <div>
                  <div className="item-name">{e.deg}</div>
                  <div className="item-sub">{e.school}</div>
                </div>
                <span className="pill">{e.year}</span>
              </div>
            ))}
          </div>
        </section>

        <footer>
          <span>Naveen Kumar, Nashville TN</span>
          <span>Built with Claude, Next.js and Vercel</span>
        </footer>
      </main>
    </>
  );
}
