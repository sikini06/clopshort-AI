
import fetch from 'node-fetch';

const SHOTSTACK_URL = 'https://api.shotstack.io/v1/render';

export const shotstackService = {
  async render(videoUrl: string, segments: any[], backgroundMusicUrl?: string) {
    const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
    
    if (!SHOTSTACK_API_KEY) {
      throw new Error("SHOTSTACK_API_KEY is missing in environment variables.");
    }

    const clips = segments.map((seg, index) => ({
      asset: {
        type: "video",
        src: videoUrl,
        trim: seg.start
      },
      start: index * 15,
      length: seg.end - seg.start,
      transition: { in: "fade", out: "fade" }
    }));

    const edit = {
      timeline: {
        background: "#000000",
        tracks: [
          { clips: clips },
          {
            clips: backgroundMusicUrl ? [{
              asset: { type: "audio", src: backgroundMusicUrl },
              start: 0,
              length: 300,
              effect: "loop"
            }] : []
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
        'x-api-key': SHOTSTACK_API_KEY
      },
      body: JSON.stringify(edit)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shotstack API Error:", errorText);
    }

    return response.json();
  }
};
