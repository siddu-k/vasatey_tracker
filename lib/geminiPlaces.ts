// Gemini AI integration for finding nearby places with contact information

import { getNearbyPlaces, NearbyPlace } from './nearbyPlaces';

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
    const apiKey = 'AIzaSyBN_5zc031kOWR3gUkgFqavb2R3_PJHT2k';

    const prompt = `Find the TOP 5 CLOSEST emergency services to coordinates ${lat}, ${lon}.THINK TWISE SEARCH WEB ADN GIVE , USE GOOGEL MAPS TOO
I need a JSON array of the nearest hospitals, police stations, and fire stations within a 10km radius.
The results MUST be sorted by distance, from closest to farthest.

For each location, include:
- name: Full name of the facility
- type: "hospital", "police", or "fire_station"
- address: Full address
- phone: Contact phone number (if available, otherwise "Not available")

Return ONLY the valid JSON array, with no other text before or after it.`;

    const res = await fetch(
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
