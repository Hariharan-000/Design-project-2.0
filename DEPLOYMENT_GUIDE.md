# Deployment Guide for Design Project 2.0

## Overview
This project has two components:
- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Node.js + Express + MongoDB (needs separate deployment)

## ✅ Frontend Deployment (Vercel)

Your frontend is deployed at: https://design-project-2-0.vercel.app/

### Current Status
- ✅ Build: Successful
- ✅ HTML/CSS/JS: Working
- ⚠️ API Calls: Disabled (Backend not connected)

---

## 📦 Backend Deployment Options

Choose ONE option below to deploy your backend so the full app works:

### Option 1: Deploy to Railway (RECOMMENDED - Easy & Free)

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → Deploy from GitHub repo
4. Select `Design-project-2.0` repository
5. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/design_project
   PORT=5002
   GEMINI_API_KEY=AIzaSyDHGsehWKIfq3OTSY3TgbSA71DJaVf3uq8
   ```
6. Wait for deployment → Copy the Railway URL
7. Update Vercel with this URL (see Step 4 below)

### Option 2: Deploy to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set Build Command: `npm install`
5. Set Start Command: `npm run server`
6. Add environment variables (same as Railway)
7. Deploy and copy the URL

### Option 3: Deploy to Heroku

1. Go to https://www.heroku.com
2. Create new app
3. Connect GitHub
4. Set buildpacks for Node.js
5. Add environment variables
6. Deploy

---

## 🔗 Step 4: Connect Frontend to Backend on Vercel

1. Go to https://vercel.com/dashboard
2. Select `Design-project-2-0` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-railway-url.railway.app/api
   ```
   (Replace with your actual backend URL)

5. Go to **Deployments** → Click the three dots on latest deployment
6. Select **Redeploy** 

Wait 2-3 minutes for redeployment.

---

## 🧪 Testing Full Deployment

After backend is deployed:

1. Visit: https://design-project-2-0.vercel.app/
2. Try these features:
   - Sign In / Register
   - Search products
   - Add to cart
   - Use AI chat

If features don't work, check:
- Browser DevTools (F12) → Console for errors
- Vercel logs → Deployments
- Backend logs on Railway/Render

---

## 📝 Local Development

To test everything locally before deploying:

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Run both together
npm run dev:all
```

Visit: http://localhost:3000

---

## 🐛 If Deployment Still Fails

**Check these in order:**

1. **Vercel Build Logs**: https://vercel.com → Deployments → Click build
2. **Environment Variables**: Must have `VITE_API_BASE_URL` set
3. **Backend Running**: Test your backend URL in browser
4. **CORS Issues**: Ensure backend has proper CORS configuration
5. **Database**: Verify MongoDB connection string is correct

---

## 📊 Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway/Render
- [ ] Environment variable `VITE_API_BASE_URL` set on Vercel
- [ ] Vercel redeployed after env variable change
- [ ] Can access https://design-project-2-0.vercel.app/
- [ ] Can Sign In / Register (tests backend)
- [ ] Can view products (tests API)
- [ ] Can use AI chat (tests Gemini integration)

---

## 🚀 For Others to Access

Share this link: **https://design-project-2-0.vercel.app/**

They can:
- Browse products
- Create account and login
- Add products to cart
- Chat with AI assistant
- Use all features (if backend is deployed)
