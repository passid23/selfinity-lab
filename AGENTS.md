# AGENTS.md - Selfinity-Lab

## Architecture
Monorepo consisting of a React frontend and a Node.js/Express backend.

- **Frontend**: `frontend/` - React, Vite, MUI, Recharts.
- **Backend**: `backend/` - Node.js, Express, Mongoose, TypeScript.

## Developer Commands

### Root
- `npm run dev`: Starts both frontend and backend concurrently.

### Backend (`backend/`)
- `npm run dev`: Starts backend with watch mode (`tsx watch server.ts`).
- `npm run start`: Starts backend.
- `npm run test`: Runs tests via Vitest.
- `npm run test:watch`: Runs tests in watch mode.

### Frontend (`frontend/`)
- `npm run dev`: Starts Vite development server.
- `npm run build`: Builds the frontend for production.
- `npm run lint`: Runs ESLint.

## Verification Workflow
1. `cd frontend && npm run lint`
2. `cd backend && npm run test`

## Important Notes
- **Ports**: 
  - Frontend: `http://localhost:5173/`
  - Backend: `http://localhost:5001/`
- **Environment**: Backend uses `.env` for configuration.
- **Database**: Uses MongoDB via Mongoose.
