// Using Overpass API (OpenStreetMap) for free nearby places search
export interface NearbyPlace {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire_station';
  lat: number;
  lon: number;
}

export async function getNearbyPlaces(
  lat: number,
  lon: number,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  // Overpass API query for hospitals, police stations, and fire stations
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      node["amenity"="police"](around:${radiusMeters},${lat},${lon});
      way["amenity"="police"](around:${radiusMeters},${lat},${lon});
      node["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
      way["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      console.error(`Overpass API request failed with status ${response.status}`);
      return [];
    }

    // The API can return non-JSON on error (like HTML), so we get text first.
    const responseText = await response.text();
    const data = JSON.parse(responseText);

    const places: NearbyPlace[] = data.elements.map((element: any) => {
      const elementLat = element.lat || element.center?.lat;
      const elementLon = element.lon || element.center?.lon;
      
      let type: 'hospital' | 'police' | 'fire_station' = 'hospital';
      if (element.tags.amenity === 'police') type = 'police';
      if (element.tags.amenity === 'fire_station') type = 'fire_station';

      return {
        id: element.id.toString(),
        name: element.tags.name || `${type.replace('_', ' ')} (unnamed)`,
        type,
        lat: elementLat,
        lon: elementLon
      };
    });

    // Return unsorted list since we're not calculating distance
    return places;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
}


// New function for reverse geocoding using Nominatim (OpenStreetMap)
export async function reverseGeocodeWithNominatim(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'VasateySec-Alert-Monitor/1.0 (contact@example.com)' // Replace with your app's info
        }
      }
    );

    if (!response.ok) {
      console.error(`Nominatim API request failed with status ${response.status}`);
      return "";
    }

    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    } else {
      return "Unknown location";
    }
  } catch (error) {
    console.error('Error during reverse geocoding with Nominatim:', error);
    return "";
  }
}
