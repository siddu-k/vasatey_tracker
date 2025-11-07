# 📁 VasateySec Monitor - File Structure

## 🌳 Complete File Tree

```
tracker/
│
├── 📱 app/                          # Next.js App Directory
│   ├── globals.css                  # Global styles, animations, Tailwind
│   ├── layout.tsx                   # Root layout, metadata, Leaflet CSS
│   └── page.tsx                     # 🔥 Main dashboard page (real-time logic)
│
├── 🧩 components/                   # React Components
│   ├── MapView.tsx                  # 🗺️ Interactive map with Leaflet
│   └── Sidebar.tsx                  # 📊 Alert list, filters, stats
│
├── 📚 lib/                          # Utility Libraries
│   ├── supabase.ts                  # Supabase client, types, connection
│   └── nearbyPlaces.ts              # Overpass API, nearby services
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies, scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tailwind.config.js           # Tailwind CSS config, colors
│   ├── postcss.config.js            # PostCSS configuration
│   ├── next.config.js               # Next.js configuration
│   └── .gitignore                   # Git ignore rules
│
├── 🔐 Environment Files
│   ├── .env.local                   # ⚠️ YOUR CREDENTIALS GO HERE
│   └── .env.local.example           # Example template
│
└── 📖 Documentation
    ├── README.md                    # Main documentation
    ├── QUICK_START.md               # 5-minute setup guide
    ├── SETUP_GUIDE.md               # Detailed setup instructions
    ├── FEATURES.md                  # Feature documentation
    ├── PROJECT_SUMMARY.md           # Complete project overview
    ├── CREDENTIALS_SETUP.md         # How to add Supabase credentials
    └── FILE_STRUCTURE.md            # This file
```

---

## 🔥 Key Files Explained

### Core Application Files

#### `app/page.tsx` - Main Dashboard
**What it does:**
- Manages all state (alerts, selected alert, nearby places)
- Connects to Supabase
- Subscribes to real-time updates
- Handles alert selection and nearby places
- Renders Sidebar and MapView components

**Key Functions:**
- `fetchAlerts()` - Load initial alerts
- `handleFindNearbyPlaces()` - Find emergency services
- `handleSelectAlert()` - Select and center on alert

**Real-time Logic:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel('alert_changes')
    .on('postgres_changes', ...)
    .subscribe();
}, []);
```

---

#### `components/MapView.tsx` - Interactive Map
**What it does:**
- Renders Leaflet map with OpenStreetMap tiles
- Displays alert markers (red)
- Shows nearby place markers (green/blue/orange)
- Handles map interactions and popups
- Auto-centers on selected alert

**Key Features:**
- Custom marker icons
- Popup information windows
- Pulse animation for recent alerts
- Dynamic map controller

---

#### `components/Sidebar.tsx` - Alert List
**What it does:**
- Displays VasateySec branding
- Shows alert statistics
- Lists all alerts in scrollable view
- Provides filters (expandable)
- "Find Nearby Places" button for each alert

**Key Features:**
- Color-coded status indicators
- Time since alert (e.g., "5 minutes ago")
- User contact information
- Location coordinates

---

#### `lib/supabase.ts` - Database Connection
**What it does:**
- Creates Supabase client
- Exports typed interfaces
- Manages database connection

**Types Defined:**
```typescript
interface Alert {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  latitude: number | null;
  longitude: number | null;
  alert_type: 'voice_help' | 'manual' | 'emergency';
  status: 'sent' | 'acknowledged' | 'resolved';
  created_at: string;
}
```

---

#### `lib/nearbyPlaces.ts` - Nearby Services
**What it does:**
- Queries Overpass API (OpenStreetMap)
- Finds hospitals, police, fire stations
- Calculates distances using Haversine formula
- Returns sorted results (nearest first)

**Function:**
```typescript
getNearbyPlaces(lat, lon, radius) → NearbyPlace[]
```

---

### Configuration Files

#### `package.json` - Dependencies
**Installed Packages:**
- `next` - Framework
- `react` - UI library
- `@supabase/supabase-js` - Database client
- `leaflet` - Map library
- `react-leaflet` - React wrapper for Leaflet
- `date-fns` - Date formatting
- `tailwindcss` - Styling
- `typescript` - Type safety

---

#### `tailwind.config.js` - Styling
**Custom Colors:**
```javascript
colors: {
  primary: '#1dd3b0',        // Teal accent
  'primary-dark': '#17b899',  // Darker teal
  dark: '#1a1f2e',           // Background
  'dark-light': '#252b3d',   // Cards
  'dark-lighter': '#2d3548', // Borders
}
```

---

#### `.env.local` - Credentials
**⚠️ IMPORTANT: You need to configure this!**

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

---

### Style Files

#### `app/globals.css` - Global Styles
**Contains:**
- Tailwind imports
- Reset styles
- Leaflet map styling
- Custom scrollbar
- Pulse animation
- Dark theme colors

**Key Animation:**
```css
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Android App    │
│  (Emergency)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │
│  alert_history  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Realtime       │
│  Subscription   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  app/page.tsx   │
│  (State Mgmt)   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌─────────┐
│ Sidebar │ │ MapView │
└─────────┘ └─────────┘
```

---

## 🎯 File Responsibilities

### Frontend (UI)
- `app/layout.tsx` - HTML structure, metadata
- `app/globals.css` - Styling, animations
- `components/Sidebar.tsx` - Alert list UI
- `components/MapView.tsx` - Map visualization

### Logic (Functionality)
- `app/page.tsx` - State management, real-time
- `lib/supabase.ts` - Database connection
- `lib/nearbyPlaces.ts` - Location services

### Configuration
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript rules
- `tailwind.config.js` - Design tokens
- `.env.local` - Credentials

### Documentation
- `README.md` - Overview
- `QUICK_START.md` - Fast setup
- `SETUP_GUIDE.md` - Detailed guide
- `FEATURES.md` - Feature docs
- `PROJECT_SUMMARY.md` - Complete summary

---

## 🔍 Where to Look for...

### Real-time Updates
- **File:** `app/page.tsx`
- **Lines:** ~30-70
- **Look for:** `supabase.channel()`

### Map Rendering
- **File:** `components/MapView.tsx`
- **Lines:** ~100-180
- **Look for:** `<MapContainer>`

### Alert Display
- **File:** `components/Sidebar.tsx`
- **Lines:** ~80-160
- **Look for:** `alerts.map()`

### Nearby Places Logic
- **File:** `lib/nearbyPlaces.ts`
- **Lines:** ~20-60
- **Look for:** `getNearbyPlaces()`

### Styling
- **File:** `app/globals.css`
- **Lines:** All
- **Look for:** Custom classes and animations

### Database Types
- **File:** `lib/supabase.ts`
- **Lines:** ~10-30
- **Look for:** `interface Alert`

---

## 📝 File Sizes

```
app/page.tsx           ~170 lines  (Main logic)
components/MapView.tsx ~180 lines  (Map component)
components/Sidebar.tsx ~175 lines  (Sidebar component)
lib/supabase.ts        ~30 lines   (DB config)
lib/nearbyPlaces.ts    ~80 lines   (Location API)
app/globals.css        ~80 lines   (Styles)
```

**Total Code:** ~715 lines of TypeScript/CSS
**Total Docs:** ~2000+ lines of documentation

---

## 🚀 Build Output

When you run `npm run build`, Next.js creates:

```
.next/
├── static/          # Static assets
├── server/          # Server-side code
└── cache/           # Build cache
```

**Don't commit `.next/` to git!** (Already in `.gitignore`)

---

## 📦 node_modules/

Contains 169 packages after `npm install`:

```
node_modules/
├── next/
├── react/
├── @supabase/
├── leaflet/
├── tailwindcss/
└── ... 164 more packages
```

**Don't commit `node_modules/` to git!** (Already in `.gitignore`)

---

## ✅ What You Need to Edit

### Required (Before Running)
- ✅ `.env.local` - Add Supabase credentials

### Optional (Customization)
- `tailwind.config.js` - Change colors
- `components/MapView.tsx` - Change default map center
- `lib/nearbyPlaces.ts` - Change search radius
- `app/globals.css` - Modify styles

### Never Edit
- ❌ `node_modules/` - Auto-generated
- ❌ `.next/` - Auto-generated
- ❌ `package-lock.json` - Auto-generated

---

## 🎨 UI Component Hierarchy

```
app/page.tsx (Main Container)
│
├── Sidebar
│   ├── Header (Logo + Stats)
│   ├── Filters (Region + Status)
│   ├── Alert List
│   │   └── Alert Cards
│   │       └── "Find Nearby Places" Button
│   └── Update Button
│
└── MapView
    ├── Map Container
    ├── Tile Layer (OpenStreetMap)
    ├── Alert Markers (Red)
    │   └── Popups (User Info)
    ├── Nearby Place Markers (Green/Blue/Orange)
    │   └── Popups (Place Info)
    └── Live Status Indicator
```

---

## 📱 Responsive Breakpoints

Currently optimized for desktop:
- Sidebar: Fixed 320px width
- Map: Flexible, fills remaining space

For mobile support, you'd need to:
- Make sidebar collapsible
- Add hamburger menu
- Adjust map controls

---

## 🔧 Development vs Production

### Development (`npm run dev`)
- Hot reload enabled
- Source maps included
- Verbose error messages
- Runs on http://localhost:3000

### Production (`npm run build && npm start`)
- Optimized bundle
- Minified code
- Error boundaries
- Runs on http://localhost:3000 (or custom port)

---

**File structure complete!** 📁✅
