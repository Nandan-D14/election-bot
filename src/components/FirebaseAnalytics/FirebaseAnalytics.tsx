'use client';

import { useEffect } from 'react';
import { analytics, app } from '@/lib/firebase';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase Analytics Component
 * Initializes Google Analytics for the application
 * Must be placed in the root layout
 */
export default function FirebaseAnalytics() {
  useEffect(() => {
    // If analytics is already initialized in lib/firebase.ts, we're good
    if (analytics) {
      console.log('Firebase Analytics already active');
      return;
    }

    // If app exists but analytics doesn't, try to initialize it here
    // as a fallback for the async initialization in lib/firebase.ts
    const currentApp = app;
    if (currentApp) {
      isSupported().then(supported => {
        if (supported) {
          try {
            getAnalytics(currentApp);
            console.log('Firebase Analytics initialized on mount');
          } catch (error) {
            // Silence storage access errors in restricted contexts
            if (error instanceof Error && error.message.includes('storage')) {
              console.warn('Firebase Analytics: Storage access restricted.');
            } else {
              console.warn('Firebase Analytics initialization failed:', error);
            }
          }
        }
      }).catch(() => {});
    }
  }, []);

  return null;
}
