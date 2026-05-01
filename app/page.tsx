"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// ── Animated terminal mock ────────────────────────────────────────────────────
const DEMO_LINES = [
  { delay: 0,    type: "label",    text: "POST  /api/users" },
  { delay: 400,  type: "key",      text: '  "Authorization":', value: ' "Bearer <<token>>"' },
  { delay: 700,  type: "key",      text: '  "Content-Type":', value: ' "application/json"' },
  { delay: 1100, type: "divider",  text: "" },
  { delay: 1300, type: "key",      text: '  "name":', value: ' "Pantho Haque"' },
  { delay: 1600, type: "key",      text: '  "role":', value: ' "admin"' },
  { delay: 2000, type: "divider",  text: "" },
  { delay: 2200, type: "status",   text: "200 OK", value: "  32ms" },
  { delay: 2500, type: "response", text: '  "id":', value: ' "usr_01j9xk"' },
  { delay: 2800, type: "response", text: '  "created":', value: ' "2025-03-08"' },
];

function TerminalDemo() {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const timers = DEMO_LINES.map((line, i) =>
      setTimeout(() => setVisible((p) => [...p, i]), line.delay + 600),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="relative w-full max-w-lg font-mono text-xs rounded-xl border border-white/8 bg-[#070e1a] overflow-hidden shadow-2xl"
      style={{ boxShadow: "0 0 0 1px rgba(0,229,204,0.06), 0 32px 80px rgba(0,0,0,0.7)" }}
    >
      <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl" />
      <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-xl" />
      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-xl" />
      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/40 rounded-br-xl" />
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0a1628]/80">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        <span className="ml-3 text-[10px] tracking-widest uppercase text-white/20">hittable · shop / create-user</span>
      </div>
      <div className="p-5 flex flex-col gap-1.5 min-h-[220px]">
        {DEMO_LINES.map((line, i) => (
          <div
            key={i}
            className="transition-all duration-300"
            style={{
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? "translateY(0)" : "translateY(4px)",
            }}
          >
            {line.type === "label" && <span className="text-[#4ade80] font-bold tracking-wider">{line.text}</span>}
            {line.type === "divider" && <div className="h-px bg-white/5 my-1" />}
            {(line.type === "key" || line.type === "response") && (
              <span>
                <span className="text-cyan-400/70">{line.text}</span>
                <span className="text-white/50">{line.value}</span>
              </span>
            )}
            {line.type === "status" && (
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/15 border border-green-500/25 text-green-400">{line.text}</span>
                <span className="text-white/25 text-[10px]">{line.value}</span>
              </div>
            )}
          </div>
        ))}
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400/70 rounded-sm animate-pulse mt-1" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: string }) {
  return (
    <div
      className="group relative rounded-xl border border-white/6 bg-[#0a1628]/60 p-5 hover:border-cyan-500/20 hover:bg-[#0a1628]/90 transition-all duration-300"
      style={{ animationDelay: delay }}
    >
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/0 group-hover:border-cyan-500/30 rounded-tl-xl transition-all duration-300" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/0 group-hover:border-cyan-500/30 rounded-br-xl transition-all duration-300" />
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-sm font-bold text-white/80 mb-1.5 tracking-wide">{title}</h3>
      <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
    </div>
  );
}

function KbdBadge({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {keys.map((k, i) => (
          <span key={i} className="px-2 py-1 rounded-md border border-white/10 bg-white/5 text-[10px] font-mono text-white/50 text-center min-w-[28px]">{k}</span>
        ))}
      </div>
      <span className="text-xs text-white/35">{label}</span>
    </div>
  );
}

// ── Social link ───────────────────────────────────────────────────────────────
function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 bg-white/3 text-white/40 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all text-[11px] tracking-wide"
    >
      {children}
      {label}
    </a>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-full bg-[#080f1a] text-white overflow-x-hidden font-mono selection:bg-cyan-500/30">

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-500/6 blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-400/4 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-cyan-500/3 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,229,204,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {[
          { top: "8%", left: "4%", size: 32 },
          { top: "8%", right: "4%", size: 24 },
          { top: "28%", left: "1%", size: 20 },
          { bottom: "35%", right: "2%", size: 28 },
          { bottom: "15%", left: "3%", size: 18 },
          { bottom: "10%", right: "5%", size: 22 },
        ].map((pos, i) => (
          <svg key={i} width={pos.size} height={pos.size} viewBox="0 0 32 32" fill="none"
            className="absolute opacity-20" style={pos as React.CSSProperties}>
            <path d="M8 0 L0 0 L0 8" stroke="#00e5cc" strokeWidth="2" />
            <path d="M24 32 L32 32 L32 24" stroke="#00e5cc" strokeWidth="2" />
          </svg>
        ))}
      </div>

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/8">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-cyan-400/80">Open Source · MIT License</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              <span className="text-white">Hittable: API testing,</span>
              <br />
              <span style={{ color: "#00e5cc" }}>without</span>
              <br />
              <span className="text-white">the bloat.</span>
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-md">
              Hittable is a keyboard-driven HTTP client that lives in your browser. Collections, environment variables, curl import, and a server-side proxy — everything you need, nothing you don&apos;t.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/hittable"
                className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-lg text-black transition-all hover:scale-105 active:scale-95"
                style={{ background: "#00e5cc", boxShadow: "0 0 24px rgba(0,229,204,0.4)" }}
              >
                Launch Hittable
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="https://github.com/Pantho-Haque/hittable"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-lg border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013.01-.4c1.02 0 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Star on GitHub
              </a>
            </div>
            <div className="flex items-center gap-6 pt-2">
              {[
                { val: "Zero", label: "config needed" },
                { val: "100%", label: "browser-based" },
                { val: "MIT", label: "licensed" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-lg font-black" style={{ color: "#00e5cc" }}>{s.val}</p>
                  <p className="text-[10px] text-white/25 tracking-wider uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <TerminalDemo />
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/15">Features</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
        </div>

        {/* ── Features ── */}
        <section id="features" className="max-w-6xl mx-auto px-8 py-16">
          <div className="mb-10">
            <p className="text-[9px] tracking-[0.3em] uppercase text-cyan-500/50 mb-2">What you get</p>
            <h2 className="text-2xl font-black text-white/85">Built for developers who move fast.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "📁", title: "Collections & Routes", desc: "Organize every API endpoint into named collections. Create, rename, delete — full control with instant feedback.", delay: "0ms" },
              { icon: "🔀", title: "Environment Variables", desc: "Define <<KEY>> vars per collection. Switch between dev, staging, and prod without touching your requests.", delay: "60ms" },
              { icon: "🛡️", title: "CORS-Free Proxy", desc: "Requests route through a Next.js server-side proxy. No more CORS errors blocking your flow in the browser.", delay: "120ms" },
              { icon: "📋", title: "curl Import", desc: "Paste any curl command into the URL bar. Method, headers, and body auto-parse instantly.", delay: "180ms" },
              { icon: "💾", title: "Persistent Storage", desc: "Collections save to localStorage automatically. Close the tab, come back later — everything is still there.", delay: "240ms" },
              { icon: "⌨️", title: "Keyboard Driven", desc: "Ctrl+Enter to send, Ctrl+S to save. Every action has a shortcut — your mouse is optional.", delay: "300ms" },
            ].map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="max-w-6xl mx-auto px-8 py-10">
          <div className="rounded-xl border border-white/6 bg-[#0a1628]/40 p-8 relative overflow-hidden">
            <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/25 rounded-tl-xl" />
            <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/25 rounded-br-xl" />
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.3em] uppercase text-cyan-500/50 mb-2">How it works</p>
              <h2 className="text-xl font-black text-white/85">From collection to response in seconds.</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-0">
              {[
                { step: "01", title: "Create a collection", desc: "Group related API routes under a named collection." },
                { step: "02", title: "Set env vars", desc: "Define <<token>>, <<host>>, or any variable your routes need." },
                { step: "03", title: "Add your request", desc: "Set method, URL, headers, body — or paste a curl command." },
                { step: "04", title: "Send & inspect", desc: "Hit Ctrl+Enter. View the response status, headers, and body." },
              ].map((s, i) => (
                <div key={i} className="relative flex flex-col gap-3 px-6 py-4 border-r border-white/5 last:border-0">
                  <span className="text-3xl font-black" style={{ color: "rgba(0,229,204,0.12)" }}>{s.step}</span>
                  <h3 className="text-xs font-bold text-white/70">{s.title}</h3>
                  <p className="text-[11px] text-white/30 leading-relaxed">{s.desc}</p>
                  {i < 3 && (
                    <span className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-cyan-500/20 text-lg">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Keyboard shortcuts ── */}
        <section id="shortcuts" className="max-w-6xl mx-auto px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <p className="text-[9px] tracking-[0.3em] uppercase text-cyan-500/50 mb-2">Shortcuts</p>
              <h2 className="text-xl font-black text-white/85 mb-1">Stay in the flow.</h2>
              <p className="text-xs text-white/30 max-w-xs leading-relaxed">Every action is a keystroke away. No clicking through menus — just code and send.</p>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <KbdBadge keys={["Ctrl", "↵"]} label="Send request" />
              <KbdBadge keys={["Ctrl", "S"]} label="Save changes to collection" />
              <KbdBadge keys={["Esc"]} label="Close any modal" />
              <KbdBadge keys={["↵"]} label="Confirm modal action" />
            </div>
          </div>
        </section>

        {/* ── Open source CTA ── */}
        <section className="max-w-6xl mx-auto px-8 py-16">
          <div
            className="relative rounded-xl border border-cyan-500/15 bg-[#0a1628]/60 p-10 text-center overflow-hidden"
            style={{ boxShadow: "0 0 60px rgba(0,229,204,0.05)" }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-cyan-500/6 blur-[80px] rounded-full" />
            </div>
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-xl" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-xl" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl" />
            <div className="relative z-10 flex flex-col items-center gap-5">
              <p className="text-[9px] tracking-[0.3em] uppercase text-cyan-500/60">Open Source</p>
              <h2 className="text-3xl font-black text-white/90">Built in public. Free forever.</h2>
              <p className="text-sm text-white/35 max-w-md leading-relaxed">
                Hittable is MIT licensed. Fork it, modify it, self-host it. PRs welcome — check the roadmap for what&apos;s next.
              </p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <a
                  href="https://github.com/Pantho-Haque/hittable"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-lg border border-white/15 text-white/60 hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013.01-.4c1.02 0 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
                <Link
                  href="/hittable"
                  className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-lg text-black transition-all hover:scale-105"
                  style={{ background: "#00e5cc", boxShadow: "0 0 20px rgba(0,229,204,0.35)" }}
                >
                  Try Hittable Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Built by ── */}
        <section className="max-w-6xl mx-auto px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center gap-8 rounded-xl border border-white/6 bg-[#0a1628]/40 p-8 relative overflow-hidden">
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/20 rounded-tl-xl" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/20 rounded-br-xl" />

            {/* Avatar placeholder */}
            <div className="shrink-0 w-16 h-16 rounded-full border-2 border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-2xl font-black text-cyan-400">
              P
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <p className="text-[9px] tracking-[0.3em] uppercase text-cyan-500/50">Built by</p>
              <h3 className="text-base font-black text-white/85 tracking-wide">Pantho Haque</h3>
              <p className="text-xs text-white/30 leading-relaxed max-w-sm">
                Full-stack developer passionate about clean tooling and great DX. Hittable was built out of frustration with bloated API clients.
              </p>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto justify-center sm:justify-end">
              <SocialLink href="https://panthohaque.vercel.app" label="Portfolio">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://github.com/Pantho-Haque" label="GitHub">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013.01-.4c1.02 0 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://www.linkedin.com/in/panthohaque/" label="LinkedIn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialLink>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="max-w-6xl mx-auto px-8 py-8 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-cyan-500/25 bg-cyan-500/8 flex items-center justify-center">
              <span className="text-cyan-400 text-[10px] font-bold">P</span>
            </div>
            <span className="text-[11px] text-white/25">Hittable · MIT License</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://panthohaque.vercel.app" target="_blank" rel="noopener noreferrer"
              className="text-[11px] text-white/25 hover:text-cyan-400 transition-colors">Pantho Haque</a>
            <a href="https://github.com/Pantho-Haque" target="_blank" rel="noopener noreferrer"
              className="text-[11px] text-white/25 hover:text-cyan-400 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/panthohaque/" target="_blank" rel="noopener noreferrer"
              className="text-[11px] text-white/25 hover:text-cyan-400 transition-colors">LinkedIn</a>
            <Link href="/hittable" className="text-[11px] text-white/25 hover:text-cyan-400 transition-colors">App</Link>
          </div>
        </footer>

      </div>
    </main>
  );
}