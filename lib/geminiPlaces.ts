// Gemini AI integration for finding nearby places with contact information

export interface GeminiPlace {
  name: string;
  type: 'hospital' | 'police' | 'fire_station';
  address: string;
  phone: string;
  distance: string;
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

    const prompt = `Find emergency services near coordinates ${lat}, ${lon} (within 5km radius).
    Return a valid JSON array of nearby hospitals, police stations, and fire stations.
    For each location, include: name, type ("hospital", "police", or "fire_station"), address, phone, and distance.
    Return ONLY the JSON array.`;

    // ✅ Updated endpoint & model name
    const res = await fetch( // Using the correct latest flash model
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!res.ok) {
      console.error('Gemini API Error:', await res.text());
      return [];
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error('Error fetching places from Gemini:', error);
    return [];
  }
}
