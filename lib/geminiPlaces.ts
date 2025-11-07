// Gemini AI integration for finding nearby places with contact information
// Using Google's Gemini API (free tier available)

export interface GeminiPlace {
  name: string;
  type: 'hospital' | 'police' | 'fire_station';
  address: string;
  phone: string;
  distance: string;
}

export async function getGeminiNearbyPlaces(
  latitude: number,
  longitude: number
): Promise<GeminiPlace[]> {
  try {
    // Note: You'll need to add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key not configured. Using fallback method.');
      return [];
    }

    const prompt = `Find emergency services near coordinates ${latitude}, ${longitude} (within 5km radius).
    
    Please provide a JSON array of nearby:
    1. Hospitals
    2. Police stations
    3. Fire stations
    
    For each location, include:
    - name: Full name of the facility
    - type: "hospital", "police", or "fire_station"
    - address: Full address
    - phone: Contact phone number (if available, otherwise "Not available")
    - distance: Approximate distance from the coordinates (e.g., "2.5 km")
    
    Return ONLY valid JSON array format, no additional text.
    Example format:
    [
      {
        "name": "City Hospital",
        "type": "hospital",
        "address": "123 Main St, City",
        "phone": "+91-1234567890",
        "distance": "1.2 km"
      }
    ]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return [];
    }

    // Extract JSON from the response (Gemini might add markdown formatting)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in Gemini response');
      return [];
    }

    const places: GeminiPlace[] = JSON.parse(jsonMatch[0]);
    return places;
  } catch (error) {
    console.error('Error fetching places from Gemini:', error);
    return [];
  }
}
