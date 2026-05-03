'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';

/**
 * Firebase Analytics Component
 * Initializes Google Analytics for the application
 * Must be placed in the root layout
 */
export default function FirebaseAnalytics() {
  useEffect(() => {
    // Analytics is initialized in lib/firebase.ts
    // This component ensures it's loaded on the client side
    if (analytics) {
      console.log('Firebase Analytics initialized');
    }
  }, []);

  return null;
}
