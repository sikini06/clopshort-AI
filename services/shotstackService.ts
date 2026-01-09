
import fetch from 'node-fetch';

const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const SHOTSTACK_URL = 'https://api.shotstack.io/v1/render';

export const shotstackService = {
  async render(videoUrl: string, count: number) {
    // Exemple simplifié de JSON d'édition pour Shotstack
    // En production, on boucle pour créer plusieurs clips
    const edit = {
      timeline: {
        background: "#000000",
        tracks: [
          {
            clips: [
              {
                asset: {
                  type: "video",
                  src: videoUrl,
                  trim: 5 // Début à 5s
                },
                start: 0,
                length: 15 // Durée 15s
              }
            ]
          }
        ]
      },
      output: {
        format: "mp4",
        resolution: "hd",
        aspectRatio: "9:16"
      }
    };

    const response = await fetch(SHOTSTACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SHOTSTACK_API_KEY || ''
      },
      body: JSON.stringify(edit)
    });

    return response.json();
  }
};
