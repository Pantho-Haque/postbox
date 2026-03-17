# <p align="center">📦 Postbox</p>

<p align="center">
  <strong>A developer-first HTTP client built for speed, transparency, and DX.</strong><br>
  No Electron, no accounts, no bloat. Just fire requests.
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-00e5cc?style=for-the-badge" alt="License"></a>
</p>

---

## 🚀 Live Demo

**[postbox-pantho.vercel.app](https://postbox-pantho.vercel.app/postbox)**

---

## What is Postbox?

Postbox is a lightweight, open-source HTTP API client that runs entirely in your browser. It hits the "sweet spot" between simplified online testers and heavy desktop apps like Postman.

### Why Postbox?
- **Zero Install**: Lives in your browser, persistent to `localStorage`.
- **CORS Bypass**: Integrated server-side proxy eliminates CORS headaches during development.
- **Keyboard First**: Every major action has a shortcut. Stop reaching for the mouse.
- **Privacy Centric**: Your data stays in your browser's local storage. No cloud syncing of sensitive API keys unless you choose to.

---

## ✨ Key Features

- **📂 Smart Collections**: Group routes into logical folders. Rename or delete them with the integrated context menu.
- **🌐 Environment Variables**: Define `<<KEY>>` placeholders. Perfect for switching between `localhost:3000` and `api.production.com`.
- **⚡ curl to App**: Paste a raw `curl` command into the URL bar. Postbox instantly parses headers, method, and body.
- **🛠 Integrated Proxy**: Optional server-side proxy (`/api/proxy`) to test APIs that don't have permissive CORS headers.
- **⌨️ Pro Shortcuts**: `Cmd/Ctrl + Enter` to send, `Cmd/Ctrl + S` to save.
- **🛡️ Type Safe**: Built with strict TypeScript for maximum reliability and great developer experience.
- **🔍 SEO Optimized**: Metadata and sitemaps are ready for public deployment.

---

## 🛠 Tech Stack

| Component | Choice |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Vanilla CSS + Tailwind CSS 3 |
| **Icons** | Lucide React |
| **State Management** | React Hooks + Immutable Updates |
| **Persistence** | Browser `localStorage` |

---

## 🏗 Project Structure

```bash
postbox/
├── app/
│   ├── layout.tsx         # Global layout with SEO & Topbar
│   ├── page.tsx           # High-conversion landing page
│   ├── sitemap.ts         # Dynamic SEO sitemap
│   └── postbox/           # Main application engine
│       └── page.tsx       # State orchestrator
├── components/
│   ├── Topbar.tsx         # Global navigation header
│   └── postbox/
│       ├── RequestForm.tsx # Method/URL/Body/Headers/Response UI
│       ├── Selector.tsx    # Sidebar navigation
│       ├── Menu.tsx        # Context menu for collections/routes
│       └── Modals.tsx      # Env / Create / Delete / Rename logic
├── utils/
│   ├── curlConverter.ts   # Advanced curl command parser
│   ├── JsonStringParsing.ts # Robust JSON handling
│   └── postboxCollectionModifier.ts # Immutable state logic
└── types/
    └── index.ts           # Centralized type definitions
```

---

## 🏁 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Pantho-Haque/postbox.git
cd postbox
npm install
```

### 2. Run Development
```bash
npm run dev
```

### 3. Deploy
One-click deployment to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pantho-Haque/postbox)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl/Cmd + Enter` | **Send Request** |
| `Ctrl/Cmd + S` | **Save to Collection** |
| `Esc` | **Close Modal** |
| `Enter` (in modal) | **Confirm Action** |

---

## 🗺 Roadmap

- [x] Collections & Route management
- [x] Environment Variables (`<<VAR>>` syntax)
- [x] curl command auto-import
- [x] Server-side CORS Proxy
- [x] Keyboard-driven UI
- [x] Context Menu (Rename/Delete)
- [x] SEO & Sitemap support
- [ ] Collection Import/Export (JSON/OpenAPI)
- [ ] Response History
- [ ] Auth presets (OAuth2, AWS Signature)
- [ ] Multi-window layout

---

## 🤝 Contributing

We love contributions! Whether it's adding a feature, fixing a bug, or improving the documentation:

1. **Fork** the repo.
2. **Branch**: `git checkout -b feat/your-feature`.
3. **Commit**: Keep messages descriptive.
4. **Push**: Open a Pull Request.

---

## 📄 License

MIT © [Pantho Haque](https://github.com/Pantho-Haque)

---

<p align="center">
  Built with ❤️ for the developer community.<br>
  <strong>Don't forget to star ⭐ if you use it!</strong>
</p>