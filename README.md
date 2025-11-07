# VasateySec - Emergency Monitoring Dashboard

A real-time emergency alert monitoring system for community safety applications. This dashboard displays emergency alerts from your mobile app users on an interactive map with nearby emergency services.

## Features

- 🗺️ **Real-time Map Visualization** - View all emergency alerts on an interactive map using OpenStreetMap (free)
- 🔴 **Live Updates** - Automatic real-time updates via Supabase subscriptions
- 📍 **Location Tracking** - Display user locations with latitude/longitude coordinates
- 🏥 **Nearby Places** - Find nearby hospitals, police stations, and fire departments
- 📊 **Alert Management** - View alert status, user details, and timestamps
- 🎨 **Modern UI** - Clean, dark-themed interface inspired by professional monitoring systems

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Maps**: Leaflet + OpenStreetMap (free)
- **Nearby Places**: Overpass API (OpenStreetMap data, free)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your actual Supabase credentials.

### 3. Supabase Setup

Make sure your Supabase database has the schema from your Android app setup. The dashboard uses the `alert_history` table.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Real-time Updates

The dashboard subscribes to Supabase's real-time changes on the `alert_history` table:

- **INSERT**: New alerts appear immediately on the map and sidebar
- **UPDATE**: Alert status changes are reflected in real-time
- **DELETE**: Removed alerts disappear from the view

### Alert Display

- Only the **latest alert per user** is displayed to avoid clutter
- Alerts with valid coordinates are shown as red markers on the map
- Recent alerts (< 5 minutes) have a pulsing circle animation

### Nearby Places

When you click "Find Nearby Places" on an alert:

1. The map centers on the alert location
2. Queries Overpass API for nearby emergency services within 5km
3. Displays hospitals (green), police stations (blue), and fire stations (orange)
4. Shows distance from the alert location

## Project Structure

```
tracker/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── MapView.tsx          # Map component with markers
│   └── Sidebar.tsx          # Alert list and filters
├── lib/
│   ├── supabase.ts          # Supabase client and types
│   └── nearbyPlaces.ts      # Nearby places API integration
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Features Breakdown

### Sidebar

- **Stats**: Total alerts and active alerts count
- **Filters**: Region and status filters (expandable)
- **Alert List**: Scrollable list of recent alerts with:
  - User name, phone, email
  - Alert status (sent/acknowledged/resolved)
  - Time since alert was created
  - Location coordinates
  - "Find Nearby Places" button

### Map

- **Base Layer**: OpenStreetMap tiles (free, no API key required)
- **Alert Markers**: Red emergency icons for each alert
- **Nearby Places**: Color-coded markers for emergency services
- **Popups**: Click markers to see detailed information
- **Auto-centering**: Map centers on selected alert

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## API Usage

### Supabase

- Real-time subscriptions for live updates
- Query `alert_history` table for alerts
- No additional configuration needed beyond environment variables

### Overpass API

- Free OpenStreetMap data API
- No API key required
- Rate limit: ~10,000 queries per day
- Used for finding nearby hospitals, police, and fire stations

## Customization

### Change Map Center

Edit `defaultCenter` in `components/MapView.tsx`:

```typescript
const defaultCenter: [number, number] = [20.5937, 78.9629]; // India
```

### Adjust Nearby Places Radius

Edit `radiusMeters` in `lib/nearbyPlaces.ts`:

```typescript
radiusMeters: number = 5000 // 5km default
```

### Modify Alert Filters

Add custom filters in `components/Sidebar.tsx` in the filters section.

## Troubleshooting

### Map not loading

- Check browser console for errors
- Ensure Leaflet CSS is loaded in `app/layout.tsx`
- Verify no SSR issues (MapView is dynamically imported)

### Real-time updates not working

- Verify Supabase URL and anon key in `.env.local`
- Check Supabase dashboard for real-time enabled
- Ensure RLS policies allow reading from `alert_history`

### Nearby places not showing

- Check browser console for Overpass API errors
- Verify alert has valid latitude/longitude
- Try increasing the search radius

## License

MIT

## Support

For issues or questions, please contact your development team.
