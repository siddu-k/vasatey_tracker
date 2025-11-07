# 🚀 VasateySec Monitor - Quick Start (5 Minutes)

## ⚡ Super Fast Setup

### 1️⃣ Add Supabase Credentials (2 minutes)

Open `.env.local` and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://acgsmcxmesvsftzugeik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
```

**Where to find these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click Settings → API
4. Copy "Project URL" and "anon public" key

---

### 2️⃣ Enable Realtime (1 minute)

In Supabase Dashboard:
1. Go to **Database** → **Replication**
2. Find `alert_history` table
3. Toggle **Realtime** to ON ✅

---

### 3️⃣ Run the Dashboard (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

### 4️⃣ Test It (1 minute)

**Option A: Use Your Android App**
- Trigger an emergency alert
- It should appear on the dashboard instantly

**Option B: Insert Test Data**

In Supabase SQL Editor, run:

```sql
INSERT INTO alert_history (
  id, user_id, user_name, user_email, user_phone,
  latitude, longitude, alert_type, status, created_at
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'Test Emergency User',
  'test@example.com',
  '+1234567890',
  12.9716,  -- Bangalore, India
  77.5946,
  'voice_help',
  'sent',
  NOW()
);
```

The alert should appear immediately on your dashboard!

---

## ✅ You're Done!

Your dashboard is now:
- ✅ Connected to Supabase
- ✅ Receiving real-time updates
- ✅ Displaying alerts on map
- ✅ Ready to find nearby places

---

## 🎯 What to Do Next

### Click on an Alert
- Map centers on location
- Shows user details

### Find Nearby Places
1. Click an alert in sidebar
2. Click "Find Nearby Places" button
3. See hospitals, police, fire stations

### Monitor in Real-Time
- Leave dashboard open
- New alerts appear automatically
- No refresh needed

---

## 🆘 Troubleshooting

### Dashboard shows "No alerts yet"
- Check Supabase credentials in `.env.local`
- Verify `alert_history` table has data
- Check browser console for errors

### Map not loading
- Check internet connection
- Clear browser cache
- Verify Leaflet CSS is loaded

### Real-time not working
- Enable Realtime in Supabase (Step 2)
- Restart dev server after changing `.env.local`
- Check browser console for errors

---

## 📚 More Information

- **Full Setup:** See `SETUP_GUIDE.md`
- **Features:** See `FEATURES.md`
- **Overview:** See `README.md`
- **Summary:** See `PROJECT_SUMMARY.md`

---

## 🚀 Deploy to Production

### Vercel (Easiest)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

Your dashboard will be live at `https://your-project.vercel.app`

---

## 🎉 That's It!

You now have a **professional emergency monitoring dashboard** running in less than 5 minutes!

**Features:**
- ✅ Real-time alerts
- ✅ Interactive map
- ✅ Nearby emergency services
- ✅ Professional UI
- ✅ 100% free to run

**Need help?** Check the documentation files or browser console for errors.

---

**Happy Monitoring! 🚨**
