// Gemini AI integration for finding nearby places with contact information

export interface GeminiPlace {
  name: string;
  type: 'hospital' | 'police' | 'fire_station';
  address: string;
  phone: string;
  distance: string; // e.g., "1.2 km"
}

// New function to get a location name from coordinates
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return "";

    const prompt = `Provide a brief, common location name for the coordinates ${lat}, ${lon}. Include the main locality or neighborhood and the city. For example: "Koramangala, Bengaluru" or "Times Square, New York". Return only the location name.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!res.ok) {
      console.error('Reverse Geocode API Error:', await res.text());
      return "";
    }

    const data = await res.json();
    const locationName = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    // Clean up potential markdown or quotes from the response
    return locationName.replace(/["`*]/g, '');
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return "";
  }
}

export async function getGeminiNearbyPlaces(
  lat: number,
  lon: number
): Promise<GeminiPlace[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('Gemini API key not configured. Using fallback method.');
      return [];
    }

    // 1. Get location name from coordinates first
    const locationName = await reverseGeocode(lat, lon);
    console.log(`Reverse geocoded location: ${locationName}`);

    // 2. Use the location name in the prompt for more accuracy
    const prompt = `You are an emergency response assistant. Find the TOP 3 CLOSEST emergency services to "${locationName}" (coordinates: ${lat}, ${lon}).
Search the web and use map data to ensure accuracy.
I need a JSON array of the nearest hospitals, police stations, and fire stations.

For each location, include:
- name: Full name of the facility
- type: "hospital", "police", or "fire_station"
- address: Full street address
- phone: Local contact phone number (if available, otherwise "Not available")

Return ONLY the valid JSON array, with no other text, comments, or markdown before or after it.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      console.error('Gemini API Error:', await res.text());
      return [];
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // The response should be a clean JSON string because of responseMimeType
    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching places from Gemini:', error);
    return [];
  }
}
