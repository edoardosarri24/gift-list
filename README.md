# Gift List
A modern, self-hosted web application to manage and share gift wish lists. Designed to keep the surprise alive for the celebrant while ensuring guests don't buy duplicate gifts.

## Overview
The **Gift List** application allows:
- **Celebrants**: Create personalized wish lists, add items with descriptions and links, and share a unique link with friends. Claims are hidden from the celebrant to preserve the surprise.
- **Guests**: View shared lists, claim items to help others avoid duplicates, and unclaim if necessary. Guests access lists via an email-based session for notifications.

## Architecture
The project is structured as a **PNPM Monorepo**:
- **`apps/backend`**: Node.js & Express API using Prisma ORM with PostgreSQL (includes Dockerfile).
- **`apps/frontend`**: React SPA built with Vite and TypeScript (includes Dockerfile & nginx.conf).
- **`packages/shared`**: Shared Zod schemas and TypeScript types used by both frontend and backend.

## Tech Stack
- **Backend**: Node.js, Express, Prisma, PostgreSQL, JWT (Authentication), Nodemailer.
- **Frontend**: React, Vite, TypeScript, TanStack Query, Axios, React Hook Form, CSS Modules.
- **Infrastructure**: Docker, Docker Compose, Cloudflare Tunnels (for secure remote access).

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) (v24+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for containerized deployment)

### Local Development
1. **Install dependencies**:
   ```bash
   pnpm install
   ```
2. **Setup environment variables**:
   Copy the example file and fill in your values (database URL, JWT secret, etc.):
   ```bash
   cp .env.example .env
   ```
3. **Database Migration**:
   ```bash
   cd apps/backend
   npx prisma migrate dev
   ```
4. **Run in development mode**:
   ```bash
   pnpm dev
   ```
   *The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.*

## Deployment with Docker
The application is optimized for self-hosting (e.g., on a Raspberry Pi) using Docker Compose.
1. **Build and start the stack**:
   ```bash
   docker compose up -d --build
   ```
2. **Access the app**:
   - **Frontend**: `http://localhost` (mapped to port 80)
   - **Backend API**: `http://localhost/api/v1` (proxied via Nginx) or `http://localhost:3000/api/v1` (direct)

### Included Services:
- **`frontend`**: Nginx serving the React build.
- **`api`**: Node.js backend.
- **`db`**: PostgreSQL 17 database.
- **`db-backup`**: Automated daily database backups.
- **`tunnel`**: Cloudflare Tunnel for secure external access without port forwarding.

## Documentation
Detailed technical documentation (LaTeX) is available in the `documentation/` directory, covering backend design, frontend architecture, and deployment strategies.