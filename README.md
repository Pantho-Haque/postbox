# Postbox

> A developer-first HTTP API client built for speed. Organize requests into collections, manage environment variables, and fire HTTP requests — all from a clean, keyboard-driven browser interface.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-00e5cc?style=flat-square)](./LICENSE)
[![Open Source](https://img.shields.io/badge/open--source-yes-00e5cc?style=flat-square)](https://github.com/Pantho-Haque/postbox)

---

## What is Postbox?

Postbox is a lightweight, open-source HTTP API client that runs entirely in the browser. Think Postman — but minimal, keyboard-driven, and zero-install. No Electron app, no account required, no bloat.

It was built because existing tools are either too heavy or too simple. Postbox hits the sweet spot: collections, env variable interpolation, a server-side proxy to eliminate CORS errors, and persistent local storage — all in a single Next.js app you can self-host or deploy to Vercel in one click.

---

## Features

- **Collections & Routes** — Group API endpoints into named collections. Create, rename, and delete with instant feedback.
- **Environment Variables** — Define `<<KEY>>` variables per collection, resolved at request time. Perfect for switching between dev, staging, and prod.
- **CORS-Free Proxy** — All requests route through a Next.js server-side API route (`/api/proxy`), eliminating browser CORS errors entirely.
- **curl Import** — Paste any `curl` command into the URL bar and the method, headers, and body auto-parse instantly.
- **Persistent Storage** — Collections save to `localStorage` automatically on every change. Nothing is lost on refresh.
- **Keyboard Driven** — `Ctrl/Cmd+S` to save, `Ctrl/Cmd+Enter` to send. Every action has a shortcut.
- **Live JSON Validation** — Real-time syntax error feedback as you type in the body and headers editors.
- **Dark Theme** — Easy on the eyes during long debugging sessions.

---

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Framework | Next.js 15 (App Router)     |
| Language  | TypeScript 5                |
| Styling   | Tailwind CSS 3              |
| Icons     | Lucide React                |
| Storage   | localStorage (client-side)  |
| Proxy     | Next.js API Routes          |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Pantho-Haque/postbox.git
cd postbox

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pantho-Haque/postbox)

One-click deployment. No configuration needed.

---

## Project Structure

```
postbox/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── postbox/
│   │   └── page.tsx                      # Main app page
│   └── api/
│       └── proxy/
│           └── route.ts                  # Server-side CORS proxy
├── components/
│   └── postbox/
│       ├── RequestForm.tsx               # URL bar, editor, response panel
│       ├── Selector.tsx                  # Collections & routes sidebar
│       └── Modals.tsx                    # Create / Rename / Delete / Env modals
├── utils/
│   ├── curlConverter.ts                  # curl ↔ JSON parser
│   ├── formatJson.ts                     # JSON pretty-printer with error handling
│   ├── postboxCollectionModifier.ts      # Immutable collection state helpers
│   └── postboxProxy.ts                   # Fetch wrapper that calls /api/proxy
├── types/
│   └── index.ts                          # All TypeScript type definitions
├── services/
│   └── Postbox.ts                        # localStorage read/write
└── constants/
    └── index.ts                          # HTTP methods list
```

---

## Using the Proxy

When you hit **Send**, Postbox routes the request through `/api/proxy` on the server — not directly from the browser. This means:

- No CORS errors, for any external API
- Works from any deployed environment

One caveat: `localhost` URLs resolve to **the server's** localhost, not your local machine.

**Testing local servers from a deployed instance** — use [ngrok](https://ngrok.com) to create a public tunnel:

```bash
ngrok http 3000
# Use the generated https://xxxx.ngrok-free.app URL in Postbox
```

**Testing local servers when running Postbox locally** — `localhost` works fine because the proxy runs on your own machine.

---

## curl Import

Paste a full curl command directly into the URL bar:

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Pantho", "role": "admin"}'
```

Postbox auto-parses the method, URL, headers, and body.

---

## Environment Variable Syntax

Reference collection-level env variables anywhere in a URL, header, or body field:

```json
{
  "Authorization": "Bearer <<token>>",
  "X-Tenant-Id": "<<tenantId>>"
}
```

Define variables in the **Env Vars** modal per collection. They resolve at request time.

---

## Keyboard Shortcuts

| Shortcut           | Action                        |
|--------------------|-------------------------------|
| `Ctrl/Cmd + Enter` | Send request                  |
| `Ctrl/Cmd + S`     | Save changes to collection    |
| `Escape`           | Close modal                   |
| `Enter` in modal   | Confirm action                |

---

## Roadmap

- [x] Collections & routes
- [x] Environment variables with `<<KEY>>` interpolation
- [x] curl import
- [x] Server-side proxy (CORS bypass)
- [x] Persistent localStorage
- [x] Keyboard shortcuts
- [x] Live JSON validation
- [ ] Response history per route
- [ ] Collection import / export as JSON
- [ ] Syntax highlighting in the editor
- [ ] Auth helpers (Bearer, Basic, API Key)
- [ ] Request timing and performance metrics
- [ ] GraphQL support
- [ ] Pre-request scripts

---

## Contributing

Contributions are welcome. Postbox is open-source under the MIT license.

### Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: describe your change'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

### Code conventions

- TypeScript strict mode throughout
- Functional React components only
- Tailwind CSS for all styling — no separate CSS files
- No unnecessary dependencies

---

## License

MIT — see [LICENSE](./LICENSE) for details. Free to use, modify, and distribute.

---

## Author

Built by **Pantho Haque**

- GitHub: [github.com/Pantho-Haque](https://github.com/Pantho-Haque)
- Email: pantho.haque.dev@gmail.com

---

<p align="center"><sub>If Postbox saved you time, a ⭐ on GitHub goes a long way.</sub></p>