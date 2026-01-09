
/**
 * Configuration centralisée pour Clopshort.
 * Ces valeurs doivent être injectées dans les variables d'environnement 
 * de votre instance Google Cloud Run ou App Engine.
 */

export const CONFIG = {
  FIREBASE: {
    API_KEY: process.env.FIREBASE_API_KEY || "AIzaSyBEdWAY2itBcWIlh9GfqqBwnhqW-NsH3GQ",
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "clopshort-3eb0a",
    SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT || "{}"
  },
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  SHOTSTACK_API_KEY: process.env.SHOTSTACK_API_KEY || "",
  AIMLAPI_KEY: process.env.AIMLAPI_KEY || "",
  NOWPAYMENTS_IPN_SECRET: process.env.NOWPAYMENTS_IPN_SECRET || "",
  JWT_SECRET: process.env.JWT_SECRET || "clopshort-ultra-secret-2025",
  R2: {
    ENDPOINT: process.env.R2_ENDPOINT || "",
    BUCKET: process.env.R2_BUCKET_NAME || "clopshort-shorts"
  }
};
