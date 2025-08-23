# Medkart Warehouse Inward

Small full-stack project with separate frontend and backend folders.

## Project structure
- frontend/ — React (or other) UI
- backend/  — Node.js API
- .env.example — example backend environment variables

## Prerequisites
- Node.js (LTS)
- npm or yarn
- PostgreSQL instance

## Setup

1. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

Edit `backend/.env.example` and set:
```
Database_Url=postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>
PORT=3000
```
(Do not commit real credentials.)

## Run (development)
Start backend:
```bash
cd backend
npm run dev
```

Start frontend:
```bash
cd frontend
npm run dev
```

By default the backend listens on the PORT from `.env.example` (example uses 3000) and connects to Postgres using `DATABASE_URL`.

## Notes
- Ensure PostgreSQL is reachable using the connection string in `Database_Url`.
- Adjust ports or proxy config in the frontend if needed.
## Prisma setup (backend)

1. Push schema to PostgreSQL and generate the client
```bash
npx prisma db push
```

Notes:
- `npx prisma db push` applies the Prisma schema to the database without migrations.
