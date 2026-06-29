# Interactive AI-Powered Portfolio 🤖

A high-performance, responsive portfolio featuring a secure, server-side AI proxy integrated with Google Gemini. This architecture allows users to chat directly with my project history, UX case studies, and engineering metrics in real-time without exposing sensitive API credentials.

## 🚀 Key Features
- **Gemini AI Proxy:** Interactive chat agent tailored to mirror my professional persona and instantly parse deep project metrics.
- **Server-Side Architecture:** Built with a secure PHP backend bridge to safely handle API requests and protect keys.
- **Privacy & Security:** Implemented strict directory privacy controls to prevent public indexing and direct configuration access.
- **Performance First:** Optimized for near-instantaneous loading speeds and clean asset delivery.

## 🛠️ Tech Stack
- **Frontend:** Semantic HTML5, CSS3, JavaScript (ES6+)
- **Backend:** PHP (Server-side API bridge)
- **AI Engine:** Google Gemini 3.5 Flash API
- **Build Tools:** esbuild (Zero-config JS bundler)

## 🏗️ Development & Build Architecture
To ensure lightning-fast load times for recruiters while keeping the developer experience clean, case study data is managed modularly and compiled into a single static payload.

**Authoring Environment:** Individual case studies are authored as isolated ES Modules inside the `scripts/src/cases/` directory. 

**Compilation:**
To add or update a case study, edit the respective file in `src/` and run the build script. This aggregates all modules into the single, production-ready `scripts/data.js` file.

```bash
# Ensure local esbuild dependencies are locked
npm install esbuild --save-dev

# Option 1: Run the build shortcut defined in package.json
npm run build

# Option 2: Run esbuild directly via npx from local project dependencies
npx esbuild scripts/src/data.js --bundle --outfile=scripts/data.js --charset=utf8