# VasateySec Monitor - Features Documentation

## 🎯 Core Features

### 1. Real-Time Alert Monitoring

**What it does:**
- Displays emergency alerts from your Android app in real-time
- Shows only the latest alert per user to avoid clutter
- Automatically updates when new alerts arrive

**Technical Details:**
- Uses Supabase Realtime subscriptions
- Listens to INSERT, UPDATE, DELETE events on `alert_history` table
- Updates UI instantly without page refresh

**User Experience:**
- Green pulse indicator shows live connection status
- New alerts appear at the top of the sidebar
- Map markers update automatically

---

### 2. Interactive Map Visualization

**What it does:**
- Displays all alerts on an interactive map
- Shows user locations with latitude/longitude coordinates
- Allows zooming, panning, and clicking on markers

**Technical Details:**
- Uses Leaflet.js with OpenStreetMap tiles (100% free)
- Custom red emergency markers for alerts
- Popup windows with detailed information
- Auto-centering when alert is selected

**Map Features:**
- 🔴 Red markers for emergency alerts
- 💫 Pulse animation for recent alerts (< 5 minutes)
- 📍 Click markers to see user details
- 🗺️ Zoom controls and pan navigation

---

### 3. Nearby Emergency Services

**What it does:**
- Finds hospitals, police stations, and fire departments near alert location
- Shows distance from alert location
- Displays up to 20 nearest places within 5km radius

**Technical Details:**
- Uses Overpass API (OpenStreetMap data)
- Free, no API key required
- Calculates distance using Haversine formula

**Place Types:**
- 🏥 **Hospitals** - Green markers
- 🚓 **Police Stations** - Blue markers
- 🚒 **Fire Departments** - Orange markers

**How to Use:**
1. Click on an alert in the sidebar
2. Click "Find Nearby Places" button
3. Wait 2-3 seconds for results
4. Click on place markers to see details

---

### 4. Alert Status Tracking

**What it does:**
- Shows current status of each alert
- Color-coded status indicators
- Real-time status updates

**Status Types:**
- 🔴 **Sent** - Alert just triggered (red, pulsing)
- 🟡 **Acknowledged** - Someone responded (yellow)
- 🟢 **Resolved** - Emergency handled (green)

**Display Locations:**
- Sidebar alert cards
- Map marker popups
- Stats counter (active alerts)

---

### 5. User Information Display

**What it shows:**
- User's full name
- Phone number
- Email address
- Alert timestamp
- Location coordinates
- Alert type (voice_help, manual, emergency)

**Where it appears:**
- Sidebar alert cards
- Map marker popups
- Detailed view when selected

---

### 6. Sidebar Dashboard

**Components:**

**Header:**
- VasateySec branding
- Total alerts counter
- Active alerts counter

**Filters:**
- Region filter (expandable)
- Status filter (sent/acknowledged/resolved)
- Reset button

**Alert List:**
- Scrollable list of recent alerts
- Color-coded status indicators
- Time since alert (e.g., "5 minutes ago")
- User contact information
- Location coordinates
- "Find Nearby Places" button

**Update Button:**
- Manual refresh option
- Auto-updates via realtime already active

---

### 7. Visual Design

**Color Scheme:**
- Primary: `#1dd3b0` (Teal/Cyan)
- Dark Background: `#1a1f2e`
- Card Background: `#252b3d`
- Lighter Elements: `#2d3548`

**Typography:**
- System fonts for performance
- Bold headings
- Clear hierarchy

**Animations:**
- Pulse effect for active alerts
- Smooth transitions
- Loading spinners

**Responsive:**
- Works on desktop monitors
- Sidebar fixed width (320px)
- Map fills remaining space

---

## 🔄 Real-Time Updates

### How It Works

1. **Connection:** Dashboard connects to Supabase on page load
2. **Subscription:** Subscribes to `alert_history` table changes
3. **Events:** Listens for INSERT, UPDATE, DELETE
4. **Update:** UI updates instantly when events occur

### Visual Indicators

- 🟢 Green pulse dot = Connected
- "Real-time updates active" label
- Instant alert appearance

### What Triggers Updates

- ✅ New alert from Android app
- ✅ Status change (sent → acknowledged → resolved)
- ✅ Alert deletion
- ✅ Location update

---

## 📊 Data Flow

### From Android App to Dashboard

```
Android App
    ↓
Triggers Emergency
    ↓
Sends to Supabase
    ↓
Inserts into alert_history
    ↓
Supabase Realtime
    ↓
Dashboard Receives Event
    ↓
Updates UI Instantly
```

### Alert Data Structure

```typescript
{
  id: "uuid",
  user_id: "uuid",
  user_name: "John Doe",
  user_email: "john@example.com",
  user_phone: "+1234567890",
  latitude: 12.9716,
  longitude: 77.5946,
  location_accuracy: 10.5,
  alert_type: "voice_help",
  status: "sent",
  created_at: "2024-01-01T12:00:00Z"
}
```

---

## 🎨 UI Components

### Sidebar Component
- **File:** `components/Sidebar.tsx`
- **Props:** alerts, selectedAlert, onSelectAlert, onFindNearbyPlaces
- **Features:** Alert list, filters, stats

### MapView Component
- **File:** `components/MapView.tsx`
- **Props:** alerts, selectedAlert, nearbyPlaces, showNearbyPlaces
- **Features:** Map display, markers, popups

### Main Page
- **File:** `app/page.tsx`
- **Features:** State management, real-time subscriptions, data fetching

---

## 🔧 Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** React 18

### Backend
- **Database:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime
- **Auth:** Not implemented (can be added)

### Maps & Location
- **Map Library:** Leaflet.js
- **Map Tiles:** OpenStreetMap (free)
- **Nearby Places:** Overpass API (free)

### Utilities
- **Date Formatting:** date-fns
- **HTTP Requests:** Fetch API

---

## 🚀 Performance

### Optimizations

1. **Dynamic Import:** Map component loaded only on client
2. **Efficient Queries:** Limit to 100 most recent alerts
3. **Deduplication:** Show only latest alert per user
4. **Lazy Loading:** Map tiles load on demand

### Load Times

- Initial page load: ~1-2 seconds
- Map render: ~500ms
- Real-time update: Instant
- Nearby places: 2-5 seconds

---

## 🔐 Security

### Current Implementation

- Uses Supabase anon key (safe for browser)
- Relies on Supabase RLS policies
- No authentication required

### Recommended for Production

- Add authentication (Supabase Auth)
- Restrict dashboard access to authorized users
- Implement role-based access control
- Add audit logging

---

## 📱 Mobile Compatibility

### Current Status
- Optimized for desktop monitors
- Sidebar fixed width
- Map responsive

### Future Enhancements
- Mobile-responsive sidebar
- Touch-friendly controls
- Progressive Web App (PWA)

---

## 🎯 Use Cases

### Police/Emergency Services
- Monitor all emergency calls in real-time
- Dispatch nearest units
- Track response status

### Community Safety
- Central monitoring for neighborhood watch
- Quick response coordination
- Emergency service location

### Campus Security
- Monitor student safety alerts
- Coordinate security personnel
- Track incident resolution

---

## 📈 Future Enhancements

### Planned Features
- [ ] Alert filtering by date range
- [ ] Export alerts to CSV/PDF
- [ ] Statistics dashboard
- [ ] Alert acknowledgment from dashboard
- [ ] Multi-user collaboration
- [ ] Push notifications
- [ ] Historical playback
- [ ] Heatmap visualization

### Advanced Features
- [ ] AI-powered alert prioritization
- [ ] Automatic dispatch suggestions
- [ ] Integration with emergency services
- [ ] Voice commands
- [ ] Mobile app for responders

---

## 🆘 Emergency Response Workflow

### Recommended Process

1. **Alert Received**
   - Dashboard shows new alert
   - Review user information
   - Check location on map

2. **Assess Situation**
   - Click "Find Nearby Places"
   - Identify nearest emergency services
   - Note distance and travel time

3. **Take Action**
   - Contact user via phone
   - Dispatch emergency services
   - Update alert status to "acknowledged"

4. **Follow Up**
   - Monitor situation
   - Update status to "resolved" when complete
   - Document incident

---

**Last Updated:** November 2024
**Version:** 1.0.0
**Status:** Production Ready
