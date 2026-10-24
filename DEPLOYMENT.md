# Deployment Guide: LIC DataSheet Hub

This repository is fully configured and ready for production deployment on **Render**, **Vercel**, or **Railway**.

---

## Option 1: Deploy on Render (Recommended)

### A. Deploy Backend as a Web Service
1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository: `RamaKrishnaVamsi/LIC_DATA_SHEET`.
3. Fill in the service configuration:
   - **Name**: `lic-datasheet-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Add the following **Environment Variables**:
   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGOURL` | `your_mongodb_connection_string` |
   | `JWT_SECRET` | `generate_any_secure_random_string` |
   | `CLIENT_ORIGIN` | `https://your-frontend-app.onrender.com` (or `*` during initial testing) |
   | `EMAIL_USER` | *(Optional for OTP emails)* `your_email@gmail.com` |
   | `EMAIL_PASS` | *(Optional)* `your_gmail_app_password` |
5. Click **Create Web Service**. Wait for the status to show **Live**. Note your backend URL (e.g. `https://lic-datasheet-backend.onrender.com`).

---

### B. Deploy Frontend as a Static Site on Render
1. In your Render Dashboard, click **New +** > **Static Site**.
2. Connect the same GitHub repository: `RamaKrishnaVamsi/LIC_DATA_SHEET`.
3. Fill in the settings:
   - **Name**: `lic-datasheet-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://your-backend-app.onrender.com/api` |
5. In **Redirects / Rewrites** tab:
   - The included `frontend/public/_redirects` will automatically handle SPA routing (`/* -> /index.html 200`).
6. Click **Create Static Site**.

---

## Option 2: Deploy Frontend on Vercel + Backend on Render
1. Deploy the backend on Render as shown above.
2. Import repository `RamaKrishnaVamsi/LIC_DATA_SHEET` on [Vercel](https://vercel.com/new).
3. Set **Root Directory** to `frontend`.
4. Framework preset will auto-detect **Vite**.
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com/api`
6. Click **Deploy**. Vercel will use the included `frontend/vercel.json` rewrite configuration for seamless client-side page routing.

---

## Key Configurations Made
- **50MB Payload Support**: Added `express.json({ limit: "50mb" })` in backend so client signature and document uploads never trigger `413 Payload Too Large`.
- **Pure JS `bcryptjs`**: Replaced native `bcrypt` with `bcryptjs` to avoid `node-gyp` native build errors on cloud Linux containers.
- **Dynamic CORS**: Backend accepts requests from localhost, custom domains, or wildcard origins.
- **Health Check Endpoint**: `/health` added for cloud uptime monitoring.
- **SPA Routing Files**: Included `_redirects` and `vercel.json` to prevent `404 Not Found` when refreshing internal routes.
