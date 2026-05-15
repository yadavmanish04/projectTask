# TaskFlow — Frontend

React + Vite + Tailwind CSS + Redux Toolkit.

## Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Environment
`.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

For production, set these to your deployed backend URL.

## Stack
- React 18 + Vite
- React Router v6 (protected routes)
- Redux Toolkit (auth, projects, tasks)
- React Hook Form + Zod validation
- Axios with JWT interceptor
- Tailwind CSS + dark mode
- Framer Motion + Lucide icons + Recharts
- @hello-pangea/dnd Kanban board
- Socket.io client (real-time task updates per project)

## Features
- Login / Signup with JWT persistence
- Dashboard with stats + charts
- Projects CRUD + member management
- Tasks with priority, status, due dates, assignees
- Drag & drop Kanban board (Todo / In Progress / Done)
- Real-time updates via Socket.io
- Dark/light theme toggle
- Fully responsive

## Build
```bash
npm run build
npm run preview
```

## Deploy on Railway
1. Push the repo to GitHub.
2. New Railway project → Deploy from GitHub → set root to `frontend`.
3. Build command: `npm install && npm run build`
4. Start command: `npm run preview`
5. Set env: `VITE_API_URL`, `VITE_SOCKET_URL` (your backend URL).
