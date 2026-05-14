# TaskFlow — Team Task Manager

Production-ready full-stack collaboration app for managing teams, projects, and tasks.

## Stack
- **Frontend:** React (Vite), React Router, Redux Toolkit, Tailwind CSS, React Hook Form + Zod, Framer Motion, Lucide, Recharts, @hello-pangea/dnd, Socket.io-client
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Helmet, Socket.io, Zod
- **Database:** MongoDB Atlas (`projectTask`)
- **Deploy:** Railway

## Project Structure
```
projectTask/
├── backend/      # Express API
└── frontend/     # React app
```

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for setup and details.

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run dev          # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

The Vite dev server proxies `/api` and `/socket.io` to the backend automatically.

## Features
- JWT auth (register / login / persistent session) with role-based access (`admin` / `member`)
- Projects: create, edit, delete, add/remove members, deadlines, status
- Tasks: priority (low → urgent), status (todo / in-progress / done), assignees, due dates, comments
- Drag & drop Kanban board per project + global tasks page
- Real-time task updates via Socket.io rooms (`project:<id>`)
- Dashboard with counts + Recharts pie/bar visualizations
- Search & filtering (projects, tasks)
- Pagination on list endpoints
- Dark/light mode, fully responsive UI
- Secure: helmet, CORS, rate-limit on auth, bcrypt, Zod validation, central error handler

## Deployment (Railway)

Create **two services** from the same GitHub repo (one per folder):

### Backend service
- Root directory: `backend`
- Start: `npm start`
- Env vars:
  - `MONGO_URI` (provided)
  - `JWT_SECRET`
  - `CLIENT_URL` = your frontend Railway URL
  - `IMAGEKIT_PRIVATE_KEY` (provided)
  - `PORT` = `5000` (Railway will inject its own; the app respects it)

### Frontend service
- Root directory: `frontend`
- Build: `npm install && npm run build`
- Start: `npm run preview`
- Env vars:
  - `VITE_API_URL` = `https://<backend>.up.railway.app/api`
  - `VITE_SOCKET_URL` = `https://<backend>.up.railway.app`

## Default Credentials
None — register a user via the Signup page. The first user can be created with role `admin`.

## License
MIT
