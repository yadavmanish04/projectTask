# Team Task Manager — Backend

Express + MongoDB + JWT API.

## Setup
```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

## Environment
See `.env`. Key vars:
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `CLIENT_URL` — Allowed CORS origin
- `IMAGEKIT_*` — Optional image upload keys

## API Overview

### Auth (`/api/auth`)
- `POST /register` `{ name, email, password, role? }`
- `POST /login` `{ email, password }`
- `GET /me` (Bearer token)

### Users (`/api/users`)
- `GET /?search=` — list users (for member picker)
- `PATCH /me` — update profile

### Projects (`/api/projects`)
- `GET /` `?search=&status=&page=&limit=`
- `POST /` `{ title, description, teamMembers[], deadline }`
- `GET /:id` · `PUT /:id` · `DELETE /:id`
- `POST /:id/members` `{ userId }`
- `DELETE /:id/members/:userId`
- `GET /stats/dashboard`

### Tasks (`/api/tasks`)
- `GET /` `?project=&status=&priority=&assignedTo=&search=`
- `POST /` `{ title, project, assignedTo[], priority, status, dueDate }`
- `GET /:id` · `PUT /:id` · `DELETE /:id`
- `POST /:id/comments` `{ message }`

All endpoints (except `register`/`login`) require `Authorization: Bearer <token>`.

## Deployment (Railway)
1. Push repo to GitHub.
2. Create Railway project → "Deploy from GitHub" → select `backend/` as root.
3. Set env vars (MONGO_URI, JWT_SECRET, CLIENT_URL).
4. Start command: `npm start`.
