"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Topbar() {
  const pathname = usePathname();
  const isApp = pathname === "/postbox";

  return (
    <header className="relative z-50 flex items-center justify-between px-6 h-11 border-b border-white/5 bg-[#060d18]/90 backdrop-blur-md shrink-0">
      {/* Left — logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center transition-all group-hover:border-cyan-400/60 group-hover:bg-cyan-500/20">
            <span className="text-cyan-400 text-[11px] font-black">P</span>
          </div>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
            Postbox
          </span>
        </Link>

        {isApp && (
          <>
            <span className="text-white/15 text-xs">/</span>
            <span className="text-[11px] tracking-[0.15em] uppercase text-cyan-400/70">
              App
            </span>
          </>
        )}
      </div>

      {/* Center — nav links (hidden on app page to save space) */}
      {!isApp && (
        <nav className="hidden sm:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "Features", href: "/#features" },
            { label: "Shortcuts", href: "/#shortcuts" },
            {
              label: "GitHub",
              href: "https://github.com/Pantho-Haque/postbox",
              external: true,
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-cyan-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      {/* Right — CTA */}
      <div className="flex items-center gap-3">
        {isApp ? (
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
        ) : (
          <Link
            href="/postbox"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase rounded text-black transition-all hover:scale-105 active:scale-95"
            style={{
              background: "#00e5cc",
              boxShadow: "0 0 12px rgba(0,229,204,0.3)",
            }}
          >
            Open App
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent" />
    </header>
  );
}
