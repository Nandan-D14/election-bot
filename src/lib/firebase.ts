import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration - uses environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required config values are present and valid (not empty strings or "undefined" strings)
const isConfigValid = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "undefined" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "undefined" &&
  firebaseConfig.appId &&
  firebaseConfig.appId !== "undefined"
);

// Initialize Firebase
let app: ReturnType<typeof initializeApp> | null = null;
if (isConfigValid) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  // Only warn in development to avoid cluttering production logs,
  // but this is likely why features are failing if env vars aren't set.
  if (process.env.NODE_ENV === "development") {
    console.warn("Firebase configuration is missing or incomplete. Check your .env.local file.");
  }
}

// Initialize Analytics (only in browser and if app is valid and supported)
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== "undefined" && app) {
  const currentApp = app;
  // isSupported() checks if the browser environment allows Analytics (e.g. IndexedDB availability)
  isSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(currentApp);
        } catch (error) {
          console.warn("Firebase Analytics initialization failed:", error);
        }
      }
    })
    .catch((err) => {
      console.warn("Error checking Firebase Analytics support:", err);
    });
}

export { app, analytics };
