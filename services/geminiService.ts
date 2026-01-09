
import { GoogleGenAI, Type } from "@google/genai";

export interface VideoClip {
  start: number;
  end: number;
  hook: string;
  title: string;
}

/**
 * Analyse une vidéo via son URL en utilisant Gemini 3 Flash.
 * Utilise la configuration correcte pour l'extraction de JSON structuré.
 */
export const analyzeVideoWithGemini = async (videoUrl: string, requestedCount: number = 3): Promise<VideoClip[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Agis en tant qu'expert en viralité TikTok/Reels. 
  Analyse le potentiel de cette vidéo YouTube : ${videoUrl}.
  Génère EXACTEMENT ${requestedCount} segments (clips) optimisés pour devenir viraux.
  Pour chaque clip, fournis : un titre accrocheur, un "hook" (phrase d'accroche), un temps de début et de fin (en secondes).
  Réponds uniquement en JSON valide selon le schéma fourni.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              start: {
                type: Type.NUMBER,
                description: "Secondes de début du clip"
              },
              end: {
                type: Type.NUMBER,
                description: "Secondes de fin du clip"
              },
              hook: {
                type: Type.STRING,
                description: "Phrase d'accroche pour le texte à l'écran"
              },
              title: {
                type: Type.STRING,
                description: "Titre du segment"
              },
            },
            required: ['start', 'end', 'hook', 'title']
          }
        }
      }
    });

    const text = response.text;
    
    if (!text) {
      console.warn("L'API a retourné une réponse vide.");
      return [];
    }
    
    const clips = JSON.parse(text.trim());
    return clips;
  } catch (e) {
    console.error("Erreur critique lors de l'appel Gemini API:", e);
    throw e;
  }
};
