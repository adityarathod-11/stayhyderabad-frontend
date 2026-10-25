# StayHyderabad Frontend (React + Vite + TypeScript + Tailwind CSS)

The client-side single page web application for **StayHyderabad** — Hyderabad's accommodation discovery and booking portal for students, freshers, and working professionals.

## 🚀 Live Hosting on Vercel
This repository is configured for 1-click deployment on [Vercel](https://vercel.com):
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install --legacy-peer-deps`

### Required Environment Variable
| Name | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of your deployed Spring Boot backend API | `https://your-backend.onrender.com/api` |

`vercel.json` is included to handle client-side routing automatically without 404s on page refresh.

---

## 🛠️ Local Development

### 1. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
In local development, the Vite proxy directs `/api` requests to `http://localhost:8080`.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 4. Build Production Bundle
```bash
npm run build
```
Generates production assets in `dist/`.
