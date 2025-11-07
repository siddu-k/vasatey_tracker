# 🔧 Troubleshooting Guide

## ✅ Server Restarted Successfully!

The dashboard is now running fresh on: **http://localhost:3000**

---

## 🐛 Common Issues & Solutions

### Issue 1: "Loading emergency alerts..." Stuck

**Symptoms:**
- Page shows loading spinner forever
- Console shows 404 errors
- Webpack/JS files not loading

**Solution:**
```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Restart dev server
npm run dev
```

**Result:** ✅ Fixed! Server restarted successfully.

---

### Issue 2: Leaflet CSS Tracking Prevention

**Error:**
```
Tracking Prevention blocked access to storage for 
https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
```

**This is a browser warning, not an error!**
- Leaflet CSS still loads correctly
- Map will work fine
- Can be safely ignored

**To disable warning (optional):**
1. Open browser settings
2. Disable "Tracking Prevention" for localhost
3. Refresh page

---

### Issue 3: No Alerts Showing

**Possible Causes:**

#### A. No Data in Database
**Check:**
```sql
SELECT * FROM alert_history 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

**Solution:** Insert test alert (see below)

#### B. Realtime Not Enabled
**Check:** Supabase Dashboard → Database → Replication → alert_history

**Solution:** Enable Realtime toggle

#### C. Wrong Credentials
**Check:** `.env.local` file has correct values

**Solution:** Verify Supabase URL and anon key

---

### Issue 4: Map Not Loading

**Symptoms:**
- Gray screen where map should be
- No map tiles

**Solutions:**

1. **Check Internet Connection**
   - Map tiles load from OpenStreetMap
   - Requires active internet

2. **Clear Browser Cache**
   ```
   Ctrl + Shift + Delete
   Clear cached images and files
   ```

3. **Check Console for Errors**
   - Press F12
   - Look for red errors
   - Share error message for help

---

### Issue 5: Photos Not Showing

**Symptoms:**
- Popup shows but no photos
- Broken image icons

**Check:**

1. **Database has photo URLs**
   ```sql
   SELECT front_photo_url, back_photo_url 
   FROM alert_history 
   WHERE id = 'your-alert-id';
   ```

2. **URLs are accessible**
   - Copy URL from database
   - Paste in browser
   - Should show image

3. **Supabase Storage is public**
   - Check bucket permissions
   - Ensure public read access

---

### Issue 6: Status Filter Not Working

**Symptoms:**
- Filter dropdown doesn't change map
- All alerts show regardless of filter

**Solution:**
1. Refresh browser (Ctrl + R)
2. Clear cache
3. Check browser console for errors

---

### Issue 7: Nearby Places Not Loading

**Symptoms:**
- Button shows loading forever
- No places appear

**Possible Causes:**

#### A. No Gemini API Key
**Expected:** Falls back to OpenStreetMap
**Check:** Console for "Gemini API key not configured" message
**Solution:** Add API key or use fallback (automatic)

#### B. API Rate Limit
**OpenStreetMap/Overpass API has limits**
**Solution:** Wait a few minutes and try again

#### C. No Places Nearby
**Some locations have no emergency services nearby**
**Solution:** Try different alert location

---

## 🧪 Test Your Setup

### Test 1: Insert Sample Alert

```sql
INSERT INTO alert_history (
  id, user_id, user_name, user_email, user_phone,
  latitude, longitude, alert_type, status,
  front_photo_url, back_photo_url, created_at
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'Test Emergency User',
  'test@vasateysec.com',
  '+919876543210',
  12.9716,  -- Bangalore
  77.5946,
  'voice_help',
  'sent',
  'https://acgsmcxmesvsftzugeik.supabase.co/storage/v1/object/public/emergency-photos/test_front.jpg',
  'https://acgsmcxmesvsftzugeik.supabase.co/storage/v1/object/public/emergency-photos/test_back.jpg',
  NOW()
);
```

**Expected Result:**
- Red marker appears on map
- Alert shows in sidebar
- Click marker to see popup
- Photos display (if URLs valid)

---

### Test 2: Check Realtime Connection

**Open Browser Console (F12):**

Look for:
```
Real-time update: { eventType: 'INSERT', ... }
```

**If you see this:** ✅ Realtime working

**If you don't see this:**
1. Enable Realtime in Supabase
2. Restart server
3. Refresh browser

---

### Test 3: Verify Environment Variables

**Check `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://acgsmcxmesvsftzugeik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**Must have:**
- ✅ Correct URL
- ✅ Valid anon key
- ✅ No extra spaces
- ✅ No quotes around values

---

## 🔄 Complete Reset

If nothing works, try a complete reset:

```bash
# 1. Stop all Node processes
taskkill /F /IM node.exe

# 2. Clear Next.js cache
rmdir /s /q .next

# 3. Reinstall dependencies (if needed)
rmdir /s /q node_modules
npm install

# 4. Start fresh
npm run dev
```

---

## 📊 Health Check

### ✅ Dashboard is Healthy When:

1. **Server Running**
   - Console shows "Ready in X.Xs"
   - No error messages

2. **Page Loads**
   - Map displays
   - Sidebar shows
   - No infinite loading

3. **Real-time Works**
   - Green indicator shows "Real-time updates active"
   - New alerts appear automatically

4. **Features Work**
   - Can click markers
   - Popups show details
   - Filters work
   - Photos display

---

## 🆘 Still Having Issues?

### Check These:

1. **Browser Console (F12)**
   - Look for red errors
   - Note the error message

2. **Server Terminal**
   - Check for compilation errors
   - Look for warnings

3. **Supabase Dashboard**
   - Verify table exists
   - Check data is present
   - Confirm Realtime enabled

4. **Network Tab (F12)**
   - Check API calls
   - Look for failed requests
   - Verify WebSocket connection

---

## 📞 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Stuck loading | Restart server |
| 404 errors | Clear cache + restart |
| No alerts | Check database + Realtime |
| No map | Check internet + clear cache |
| No photos | Verify URLs in database |
| Filter broken | Refresh browser |
| Nearby places stuck | Wait + try again |

---

## ✅ Current Status

**Server:** ✅ Running on port 3000
**Build:** ✅ Compiled successfully
**Features:** ✅ All implemented
**Issues:** ✅ Resolved

---

## 🎯 Next Steps

1. ✅ Server is running
2. ✅ Open http://localhost:3000
3. ✅ Test with sample alert
4. ✅ Verify all features work
5. ⚠️ Enable Realtime in Supabase (if not done)

---

**Dashboard is ready to use!** 🚀
