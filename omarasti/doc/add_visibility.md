# Feature: Marker Visibility Configuration

## Overview
Add configurable visibility settings to track markers that determine when runners can see markers and mark them as visited based on their distance from the marker.

## Business Logic

### Default Visibility
- All markers have a default visibility of **50 meters**
- When loading tracks without visibility data, API must populate default 50m visibility for all markers
- **Special rule: The last marker (finish) always has 100m visibility** when loading tracks, regardless of saved value

### Visibility Options
Markers can have one of four visibility settings:
- **100m** - Long range visibility
- **50m** - Medium range visibility (default)
- **25m** - Short range visibility  
- **10m** - Very short range visibility

### Distance-Based UI Behavior During Run

The visibility setting determines TWO thresholds:

#### 1. "Can See Marker" Threshold (shows marker location indicator)
- **100m visibility** → show when runner is within **100m** of marker
- **50m visibility** → show when runner is within **50m** of marker
- **25m visibility** → show when runner is within **25m** of marker
- **10m visibility** → show when runner is within **10m** of marker

Formula: `canSeeThreshold = visibility`

#### 2. "Can Touch Marker" Threshold (allows marking as visited)
- **100m or 50m visibility** → allow marking when within **25m** of marker
- **25m visibility** → allow marking when within **10m** of marker
- **10m visibility** → allow marking when within **7m** of marker

---

## Required Changes

### 1. Database Model Changes

**File:** `models/Track.ts`

#### Changes:
- Add `visibility` field to marker interface (type: number, default: 50)
- Update TypeScript interfaces: `Track`, `TrackPopulatedType`, `TrackListType`
- Update Mongoose schema to include visibility in markers array

```typescript
// Before
markers: { description: string; latlng: { lat: number; lng: number } }[]

// After  
markers: { 
  description: string; 
  latlng: { lat: number; lng: number }; 
  visibility: number; // 10 | 25 | 50 | 100
}[]
```

#### Implementation Details:
- Add default value of 50 in schema
- Ensure backward compatibility with existing tracks

---

### 2. API Changes

**File:** `pages/api/tracks/[id].ts` (GET operations)

#### Changes:
- When retrieving tracks, check each marker for visibility field
- If `visibility` is undefined/null, set it to 50 (default)
- **Always set the last marker (finish) to 100m visibility**
- Apply this logic in `getTrack()` function

```typescript
// Pseudo-code
markers: track.markers.map((marker, index) => ({
  ...marker,
  // Last marker always has 100m visibility, others default to 50m
  visibility: index === track.markers.length - 1 ? 100 : (marker.visibility ?? 50)
}))
```

**File:** `pages/api/tracks/index.ts` (GET all tracks)

#### Changes:
- Same default visibility logic when returning track lists
- Last marker always gets 100m visibility
- Other markers default to 50m if not set

---

### 3. UI Changes: Track Creation/Editing

**File:** `components/TrackMarker.tsx`

#### Changes to Popup Component (lines 134-156):
- Add visibility state: `const [visibility, setVisibility] = useState(marker.visibility ?? 50)`
- Add radio input group for visibility options (100m, 50m, 25m, 10m)
- Update `updateMarkers()` calls to include visibility
- Modify `updateDescription()` to also save visibility: `updateMarkers({ ...marker, description, visibility })`

#### New UI Elements in Popup:
```jsx
<div className='flex flex-col'>
  <label>Näkyvyys:</label>
  {published ? (
    <div>{marker.visibility ?? 50}m</div>
  ) : (
    <div className='flex gap-2'>
      <label><input type="radio" name={`visibility-${index}`} value="100" 
        checked={visibility === 100} onChange={(e) => setVisibility(100)} />100m</label>
      <label><input type="radio" name={`visibility-${index}`} value="50" 
        checked={visibility === 50} onChange={(e) => setVisibility(50)} />50m</label>
      <label><input type="radio" name={`visibility-${index}`} value="25" 
        checked={visibility === 25} onChange={(e) => setVisibility(25)} />25m</label>
      <label><input type="radio" name={`visibility-${index}`} value="10" 
        checked={visibility === 10} onChange={(e) => setVisibility(10)} />10m</label>
    </div>
  )}
</div>
```

#### TypeScript Interface Update:
Change marker prop type from:
```typescript
marker: { latlng: { lat: number; lng: number }; description: string }
```
To:
```typescript
marker: { 
  latlng: { lat: number; lng: number }; 
  description: string;
  visibility?: number;
}
```

---

**File:** `components/DesignMap.tsx`

#### Changes (line 25):
When adding new markers, include default visibility:

```typescript
// Before
const markers = [...track.markers, { latlng: e.latlng, description: '' }]

// After
const markers = [...track.markers, { 
  latlng: e.latlng, 
  description: '', 
  visibility: 50 
}]
```

---

### 4. UI Changes: Running Mode

**File:** `pages/tracks/[...default].tsx`

#### Create Utility Function (add at top of file):
```typescript
/**
 * Calculate distance thresholds based on marker visibility setting
 * @param visibility - Marker visibility in meters (10, 25, 50, or 100)
 * @returns Object with canSee and canTouch thresholds
 */
function getVisibilityThresholds(visibility: number) {
  let canSeeThreshold: number;
  let canTouchThreshold: number;
  
  // "can see" threshold 
  canSeeThreshold = visibility;
  
  // Calculate "can touch" threshold based on visibility
  if (visibility >= 50) {
    canTouchThreshold = 25;
  } else if (visibility === 25) {
    canTouchThreshold = 10;
  } else { // visibility === 10
    canTouchThreshold = 7;
  }
  
  return { canSeeThreshold, canTouchThreshold };
}
```

#### Changes to `updateRun()` function (line 68):
Replace hardcoded distance checks with dynamic thresholds:

```typescript
// Before
const d = distance(latlng, track?.markers[run.targetMarker].latlng)
setLocation({ latlng, canSeeMarker: d < 100, canTouchMarker: d < 25, distance: d })

// After
const targetMarker = track?.markers[run.targetMarker];
const d = distance(latlng, targetMarker.latlng);
const { canSeeThreshold, canTouchThreshold } = getVisibilityThresholds(
  targetMarker.visibility ?? 50
);
setLocation({ 
  latlng, 
  canSeeMarker: d < canSeeThreshold, 
  canTouchMarker: d < canTouchThreshold, 
  distance: d 
});
```

#### Changes to `touchMarker()` function (line 107):
Update for next marker's visibility:

```typescript
// Before
const d = distance(location.latlng, track?.markers[run.targetMarker + 1].latlng)
setLocation({ ...location, canSeeMarker: d < 100, canTouchMarker: d < 20, distance: d })

// After
const nextMarker = track?.markers[run.targetMarker + 1];
const d = distance(location.latlng, nextMarker.latlng);
const { canSeeThreshold, canTouchThreshold } = getVisibilityThresholds(
  nextMarker.visibility ?? 50
);
setLocation({ 
  ...location, 
  canSeeMarker: d < canSeeThreshold, 
  canTouchMarker: d < canTouchThreshold, 
  distance: d 
});
```

---

### 5. Additional Files to Review

These files may need updates if they directly handle markers:

**Files to check:**
- `components/Panels.tsx` - May display marker information during run
- `pages/tracks/view.tsx` - May need to pass visibility data
- `pages/tracks/run/start.tsx` - Initial run setup
- `pages/tracks/run/stop.tsx` - May display marker statistics

**Action:** Review these files for any marker-related logic that needs visibility awareness.

---

## Implementation Steps

### Phase 1: Backend & Model
1. ✅ Update `models/Track.ts` - Add visibility field to interfaces and schema
2. ✅ Update `pages/api/tracks/[id].ts` - Add default visibility logic
3. ✅ Update `pages/api/tracks/index.ts` - Add default visibility logic
4. ✅ Test API endpoints to ensure visibility defaults are applied

### Phase 2: Track Editor UI
5. ✅ Update `components/DesignMap.tsx` - Add visibility when creating markers
6. ✅ Update `components/TrackMarker.tsx` - Add visibility radio inputs to popup
7. ✅ Test marker creation and editing with visibility options
8. ✅ Verify visibility is saved correctly

### Phase 3: Running Mode UI
9. ✅ Add `getVisibilityThresholds()` utility function to `pages/tracks/[...default].tsx`
10. ✅ Update `updateRun()` function to use dynamic thresholds
11. ✅ Update `touchMarker()` function to use dynamic thresholds
12. ✅ Test running mode with different visibility settings

### Phase 4: Testing & Validation
13. ✅ Test with existing tracks (should get 50m default)
14. ✅ Test with new tracks (should allow setting visibility)
15. ✅ Test running mode with all visibility options (10m, 25m, 50m, 100m)
16. ✅ Verify UI panels appear at correct distances
17. ✅ Verify marker can be marked as visited at correct distances

---

## Testing Scenarios

### Scenario 1: Existing Track (No Visibility Data)
- **Setup:** Load a track created before this feature
- **Expected:** Regular markers should have 50m visibility, finish marker should have 100m visibility
- **Verify:** Runner sees regular markers at 50m/can mark at 25m, sees finish at 100m/can mark at 25m

### Scenario 2: Create Track with Mixed Visibility
- **Setup:** Create track with markers having different visibility settings
  - Marker 1 (start): 100m
  - Marker 2: 25m  
  - Marker 3 (finish): User sets to 10m in editor
- **Expected:** Start uses 100m, middle uses 25m, but finish will always load as 100m (override rule)

### Scenario 3: Edit Existing Track
- **Setup:** Edit an old track and change marker visibility
- **Expected:** New visibility should be saved and used during runs (except finish marker which always loads as 100m)

### Scenario 4: Running with Different Visibility
Test each visibility setting (note: finish marker always uses 100m):
- **100m:** See at 100m, mark at 25m
- **50m:** See at 50m, mark at 25m
- **25m:** See at 25m, mark at 10m
- **10m:** See at 10m, mark at 7m
- **Finish (always 100m):** See at 100m, mark at 25m

---

## Edge Cases & Considerations

1. **Backward Compatibility:** Existing tracks without visibility must default to 50m
2. **Database Migration:** No migration needed - defaults applied at read time
3. **Invalid Visibility Values:** API should validate only accepts [10, 25, 50, 100]
4. **Finish Marker Override:** The last marker (finish) ALWAYS has 100m visibility when loading tracks, regardless of what's saved in DB. This ensures runners can always see the finish from a reasonable distance.
5. **Start Marker:** Start marker follows normal visibility rules (default 50m, configurable)
6. **Published Tracks:** Visibility is read-only for published tracks (matches description behavior), but finish marker 100m rule still applies

---

## Future Enhancements (Out of Scope)

- Visual indication of visibility range on map during track design
- Bulk edit visibility for all markers
- Visibility presets (easy/medium/hard track difficulty)
- Analytics on how visibility affects completion times

