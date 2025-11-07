# VasateySec Monitor - Setup Guide

## 🚀 Quick Start

### Step 1: Configure Supabase Credentials

1. Copy the example environment file:
   ```bash
   copy .env.local.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Where to find these:**
   - Go to your Supabase project dashboard
   - Click on "Settings" → "API"
   - Copy "Project URL" → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Verify Database Schema

Make sure your Supabase database has the `alert_history` table with these columns:
- `id` (UUID)
- `user_id` (UUID)
- `user_name` (TEXT)
- `user_email` (TEXT)
- `user_phone` (TEXT)
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `location_accuracy` (REAL)
- `alert_type` (TEXT)
- `status` (TEXT)
- `created_at` (TIMESTAMP)

### Step 3: Enable Realtime

1. In Supabase dashboard, go to "Database" → "Replication"
2. Find the `alert_history` table
3. Enable "Realtime" for this table

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 How to Use

### Viewing Alerts

- All emergency alerts appear automatically on the map and in the sidebar
- Click on any alert in the sidebar to center the map on that location
- Click on map markers to see detailed information

### Finding Nearby Places

1. Click on an alert in the sidebar
2. Click the "Find Nearby Places" button
3. The map will show:
   - 🏥 **Green markers** - Hospitals
   - 🚓 **Blue markers** - Police Stations
   - 🚒 **Orange markers** - Fire Departments

### Real-time Updates

The dashboard automatically updates when:
- New alerts are created
- Alert status changes
- Alerts are deleted

You'll see a green "Real-time updates active" indicator in the top-right corner.

## 🔧 Troubleshooting

### Map not displaying

**Issue:** Blank map or loading forever

**Solutions:**
1. Check browser console for errors
2. Verify internet connection (map tiles are loaded from OpenStreetMap)
3. Clear browser cache and reload

### No alerts showing

**Issue:** Sidebar shows "No alerts yet"

**Solutions:**
1. Verify Supabase credentials in `.env.local`
2. Check if `alert_history` table has data
3. Verify RLS policies allow reading from `alert_history`
4. Check browser console for errors

### Real-time updates not working

**Issue:** New alerts don't appear automatically

**Solutions:**
1. Enable Realtime for `alert_history` table in Supabase
2. Check Supabase credentials
3. Verify RLS policies
4. Check browser console for subscription errors

### Nearby places not loading

**Issue:** "Find Nearby Places" doesn't show anything

**Solutions:**
1. Verify the alert has valid latitude/longitude
2. Check internet connection (uses Overpass API)
3. Wait a few seconds (API can be slow)
4. Try again later if API is rate-limited

## 🎨 Customization

### Change Default Map Location

Edit `components/MapView.tsx`:

```typescript
const defaultCenter: [number, number] = [YOUR_LAT, YOUR_LON];
```

### Adjust Nearby Places Search Radius

Edit `lib/nearbyPlaces.ts`:

```typescript
radiusMeters: number = 5000 // Change to your preferred radius in meters
```

### Modify Color Scheme

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#1dd3b0',        // Main accent color
  'primary-dark': '#17b899',  // Darker accent
  dark: '#1a1f2e',           // Background
  'dark-light': '#252b3d',   // Card background
  'dark-lighter': '#2d3548', // Lighter elements
}
```

## 📱 Testing with Your Android App

1. Make sure your Android app is sending alerts to the same Supabase project
2. Trigger an alert from your mobile app
3. The alert should appear on the dashboard within 1-2 seconds

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your dashboard will be live at `https://your-project.vercel.app`

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Deploy

## 🔐 Security Notes

- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose in the browser
- Make sure your Supabase RLS policies are properly configured
- For production, consider adding authentication to the dashboard
- Use environment variables for all sensitive data

## 📊 Features Overview

### ✅ Implemented Features

- ✅ Real-time alert monitoring
- ✅ Interactive map with OpenStreetMap
- ✅ Nearby emergency services (hospitals, police, fire)
- ✅ Alert status tracking
- ✅ User information display
- ✅ Auto-centering on selected alerts
- ✅ Pulse animation for recent alerts
- ✅ Dark theme UI
- ✅ Responsive design
- ✅ Live update indicator

### 🔄 Potential Enhancements

- Add authentication for dashboard access
- Filter alerts by status, date, region
- Export alerts to CSV/PDF
- Alert statistics and analytics
- Push notifications for new alerts
- Multi-language support
- Alert acknowledgment from dashboard
- Historical alert playback

## 📞 Support

If you encounter any issues:

1. Check this guide first
2. Review the browser console for errors
3. Verify Supabase configuration
4. Check the README.md for additional information

## 🎯 Next Steps

1. ✅ Set up environment variables
2. ✅ Verify database connection
3. ✅ Test with sample alert
4. ✅ Customize colors/branding
5. ✅ Deploy to production

---

**Built with:** Next.js 14, React, TypeScript, Tailwind CSS, Supabase, Leaflet

**Free APIs Used:**
- OpenStreetMap (map tiles)
- Overpass API (nearby places)
- Supabase (database & realtime)
