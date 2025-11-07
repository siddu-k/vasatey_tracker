# 🔄 Alert Filtering Logic

## Overview

The dashboard implements smart filtering to ensure clean, manageable data display:

---

## ✅ Duplicate Prevention (Latest Alert Only)

### How It Works

**Only the most recent alert from each user is displayed.**

### Implementation

#### 1. Initial Load (fetchAlerts)
```typescript
// Filter to show only the latest alert per user within the last hour
const latestAlerts = data.reduce((acc: Alert[], alert: Alert) => {
  const existingAlert = acc.find((a) => a.user_id === alert.user_id);
  if (!existingAlert) {
    acc.push(alert);
  }
  return acc;
}, []);
```

**What this does:**
- Fetches all alerts from the last hour
- Groups by `user_id`
- Keeps only the newest alert per user
- Removes duplicates automatically

#### 2. Real-Time Updates
```typescript
if (payload.eventType === 'INSERT') {
  const newAlert = payload.new as Alert;
  if (new Date(newAlert.created_at) >= oneHourAgo) {
    setAlerts((prev) => {
      // Remove any existing alert from the same user
      const filtered = prev.filter((alert) => alert.user_id !== newAlert.user_id);
      return [newAlert, ...filtered];
    });
  }
}
```

**What this does:**
- When a new alert arrives
- Removes any previous alert from the same user
- Adds the new alert to the top
- Ensures no duplicates

---

## ⏰ 1-Hour Fresh Alert Filter

### How It Works

**Only alerts from the last 1 hour are shown on the map.**

### Implementation

#### 1. Database Query
```typescript
const oneHourAgo = new Date();
oneHourAgo.setHours(oneHourAgo.getHours() - 1);

const { data, error } = await supabase
  .from('alert_history')
  .select('*')
  .gte('created_at', oneHourAgo.toISOString())
  .order('created_at', { ascending: false });
```

**What this does:**
- Calculates timestamp for 1 hour ago
- Fetches only alerts created after that time
- Orders by newest first

#### 2. Real-Time Filter
```typescript
if (payload.eventType === 'INSERT') {
  const newAlert = payload.new as Alert;
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
  if (new Date(newAlert.created_at) >= oneHourAgo) {
    // Add to alerts
  }
}
```

**What this does:**
- Checks if new alert is within last hour
- Only adds if it's fresh
- Ignores old alerts

#### 3. Auto-Cleanup
```typescript
const cleanupInterval = setInterval(() => {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
  setAlerts((prev) =>
    prev.filter((alert) => new Date(alert.created_at) >= oneHourAgo)
  );
}, 60000); // Check every minute
```

**What this does:**
- Runs every 60 seconds (1 minute)
- Removes alerts older than 1 hour
- Keeps map clean automatically

---

## 📊 Example Scenarios

### Scenario 1: User Triggers Multiple Alerts

**Timeline:**
- 8:00 PM - User A triggers alert #1
- 8:15 PM - User A triggers alert #2
- 8:30 PM - User A triggers alert #3

**What Shows on Map:**
- Only alert #3 (latest)
- Alerts #1 and #2 are automatically removed

---

### Scenario 2: Multiple Users

**Timeline:**
- 8:00 PM - User A triggers alert
- 8:10 PM - User B triggers alert
- 8:20 PM - User C triggers alert
- 8:25 PM - User A triggers another alert

**What Shows on Map:**
- User A: Latest alert (8:25 PM)
- User B: Alert (8:10 PM)
- User C: Alert (8:20 PM)

**Total:** 3 alerts (one per user)

---

### Scenario 3: Old Alerts Auto-Removal

**Timeline:**
- 7:00 PM - User A triggers alert
- 8:00 PM - User B triggers alert
- 9:00 PM - Current time

**What Shows on Map:**
- User B: Alert (8:00 PM) ✅ Still visible
- User A: Alert (7:00 PM) ❌ Removed (older than 1 hour)

---

## 🎯 Benefits

### 1. Clean Map Display
- No clutter from duplicate alerts
- Easy to see current situation
- One marker per user

### 2. Fresh Data Only
- Shows only recent emergencies
- Auto-removes old alerts
- Focuses on active situations

### 3. Performance
- Limits number of markers on map
- Faster rendering
- Better user experience

### 4. Accurate Status
- Always shows latest user status
- No confusion from old alerts
- Current emergency state

---

## 🔧 Customization

### Change Time Window

To show alerts from last 2 hours instead of 1:

```typescript
// Change this line in all places:
oneHourAgo.setHours(oneHourAgo.getHours() - 1);

// To:
oneHourAgo.setHours(oneHourAgo.getHours() - 2);
```

**Locations to change:**
1. `fetchAlerts()` function
2. Real-time INSERT handler
3. Auto-cleanup interval

### Change Cleanup Frequency

To check every 30 seconds instead of 60:

```typescript
// Change:
}, 60000); // Check every minute

// To:
}, 30000); // Check every 30 seconds
```

---

## 📝 Summary

### Duplicate Prevention
✅ Only latest alert per user
✅ Automatic removal of old alerts from same user
✅ Works on initial load and real-time updates

### Time-Based Filtering
✅ Only shows alerts from last 1 hour
✅ Auto-removes alerts older than 1 hour
✅ Runs cleanup every minute

### Result
✅ Clean, manageable map display
✅ No duplicate markers
✅ Only fresh, relevant alerts
✅ Automatic maintenance

---

## 🎨 Visual Example

### Before Filtering:
```
Map Markers:
🔴 User A - Alert 1 (7:00 PM) - OLD
🔴 User A - Alert 2 (7:30 PM) - OLD
🔴 User A - Alert 3 (8:00 PM) - DUPLICATE
🔴 User A - Alert 4 (8:30 PM) - LATEST
🔴 User B - Alert 1 (8:15 PM)
🔴 User B - Alert 2 (8:25 PM) - LATEST

Total: 6 markers (CLUTTERED!)
```

### After Filtering:
```
Map Markers:
🔴 User A - Alert 4 (8:30 PM) ✅
🔴 User B - Alert 2 (8:25 PM) ✅

Total: 2 markers (CLEAN!)
```

---

## 🚀 How to Test

### Test Duplicate Prevention

1. Insert alert for User A:
```sql
INSERT INTO alert_history (id, user_id, user_name, user_email, user_phone, latitude, longitude, alert_type, status, created_at)
VALUES (gen_random_uuid(), 'user-a-id', 'User A', 'usera@test.com', '+1234567890', 12.9716, 77.5946, 'voice_help', 'sent', NOW());
```

2. Wait 5 seconds

3. Insert another alert for User A:
```sql
INSERT INTO alert_history (id, user_id, user_name, user_email, user_phone, latitude, longitude, alert_type, status, created_at)
VALUES (gen_random_uuid(), 'user-a-id', 'User A', 'usera@test.com', '+1234567890', 12.9800, 77.6000, 'voice_help', 'sent', NOW());
```

4. **Result:** Only the second alert shows on map (first one removed)

### Test 1-Hour Filter

1. Insert old alert (2 hours ago):
```sql
INSERT INTO alert_history (id, user_id, user_name, user_email, user_phone, latitude, longitude, alert_type, status, created_at)
VALUES (gen_random_uuid(), gen_random_uuid(), 'Old User', 'old@test.com', '+9999999999', 12.9716, 77.5946, 'voice_help', 'sent', NOW() - INTERVAL '2 hours');
```

2. **Result:** Alert does NOT appear on map (too old)

3. Insert fresh alert:
```sql
INSERT INTO alert_history (id, user_id, user_name, user_email, user_phone, latitude, longitude, alert_type, status, created_at)
VALUES (gen_random_uuid(), gen_random_uuid(), 'New User', 'new@test.com', '+8888888888', 12.9716, 77.5946, 'voice_help', 'sent', NOW());
```

4. **Result:** Alert appears immediately (fresh)

---

**Filtering is automatic and requires no manual intervention!** ✅
