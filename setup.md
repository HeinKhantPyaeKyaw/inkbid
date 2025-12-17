# InkBid — Setup Guide

This document explains how to set up **InkBid** locally for both **development runtime** and **local Docker deployment**.

The platform depends on **Firebase (Authentication + Storage)**, **MongoDB**, **PayPal**, **Redis**, and environment-based configuration via `.env.development.local`.

---

## 1. Prerequisites

Before starting, ensure you have:

- Node.js 18+
- npm or pnpm
- Docker & Docker Compose
- A Firebase project
- A MongoDB Atlas cluster
- A PayPal Developer (Sandbox) account

---

## 2. Third-Party Service Setup

### 2.1 Firebase (Authentication & Storage)

1. Go to **Firebase Console** → Create a new project
2. Enable **Authentication**
   - Sign-in method: Email / Password
3. Enable **Firebase Storage**
4. Go to **Project Settings → Service Accounts**
   - Generate a **new private key** (JSON)

From the service account JSON, you will need:

- `project_id`
- `client_email`
- `private_key`

From **Project Settings → General**, copy:

- **Web API Key** (`apiKey`)

These values will be used in `.env.development.local` and `docker-compose.yaml`.

---

### 2.2 MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a **cluster** (free tier is sufficient)
3. Create a **database user**
4. Whitelist your IP address (or allow all: `0.0.0.0/0` for local dev)
5. Copy the **connection string**

Example:

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/inkbid
```

---

### 2.3 PayPal Sandbox

1. Go to **PayPal Developer Dashboard**
2. Create a **Sandbox App**
3. Copy:
   - Client ID
   - Client Secret

Use PayPal **Sandbox API**:

```
https://api-m.sandbox.paypal.com
```

---

## 3. Local Runtime (Node.js Development)

This mode runs the frontend and backend directly using `npm`.

### 3.1 Environment Variables

InkBid uses environment-based configuration via:

```
.env.development.local
```

#### Backend — `backend/.env.development.local`

```env
# Server
PORT=5500
NODE_ENV=development

# Database
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inkbid

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web API Key
FIREBASE_API_KEY=

# Client URL
CLIENT_URL=http://localhost:3000

# PayPal Sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
PAYPAL_MODE=sandbox

# Redis
REDIS_URL=redis://localhost:6379
```

> ⚠️ Important: Escape newlines in `FIREBASE_PRIVATE_KEY` using `\n`

---

#### Frontend — `frontend/.env.development.local`

```env
NEXT_PUBLIC_API_BASE=http://localhost:5500/api/v1
```

---

### 3.2 Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 3.3 Run the Application

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

Application URLs:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5500

---

## 4. Local Deployment (Docker + Docker Compose)

This mode runs the full system using Docker containers.

---

### 4.1 Build Docker Images

From each service directory:

```bash
# Frontend
docker build -t inkbid-frontend:latest ./frontend

# Backend
docker build -t inkbid-backend:latest ./backend

# AI Backend
docker build -t inkbid-ai-backend:latest ./ai-backend
```

---

### 4.2 Create `docker-compose.yaml`

Use `docker-compose.yaml` **template in the project root or create one at a suitable directory**:

```yaml
services:
  frontend:
    image: inkbid-frontend:latest
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_BASE=http://localhost:5500/api/v1

  backend:
    image: inkbid-backend:latest
    ports:
      - '5500:5500'
    environment:
      - PORT=5500
      - NODE_ENV=development

      # Database
      - DB_URI=

      # Firebase Admin SDK
      - FIREBASE_PROJECT_ID=
      - FIREBASE_CLIENT_EMAIL=
      - FIREBASE_PRIVATE_KEY=

      # Firebase Web API Key
      - FIREBASE_API_KEY=

      - CLIENT_URL=http://localhost:3000

      # PayPal Sandbox
      - PAYPAL_CLIENT_ID=
      - PAYPAL_CLIENT_SECRET=
      - PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
      - PAYPAL_MODE=sandbox

      # Redis
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  redis:
    image: redis:latest
    ports:
      - '6379:6379'

  ai-backend:
    image: inkbid-ai-backend:latest
    ports:
      - '5050:5050'
```

---

### 4.3 Run Docker Compose

```bash
docker-compose up --build
```

Services will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5500
- AI Backend: http://localhost:5050
- Redis: localhost:6379

---

## 5. Configuration Loader (Reference)

The backend loads environment variables using:

```ts
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  REDIS_URL,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_API_BASE,
  PAYPAL_MODE,
} = process.env;
```

This is why the environment file **must be named**:

```
.env.development.local
```

---

## 6. Notes

- Never commit `.env.development.local` and `docker-compose.yaml` to version control
- Use PayPal Sandbox credentials for local testing
- Firebase Admin credentials must remain private

---

✅ You are now ready to run InkBid locally or via Docker.

