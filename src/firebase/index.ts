
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Initializes Firebase with a focus on robustness for both Web and Capacitor (Mobile).
 * On the client, it intelligently switches between local config and App Hosting auto-config.
 * During build (Node.js), it uses the config object to prevent app/no-options error.
 */
export function initializeFirebase() {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return getSdks(existingApps[0]);
  }

  const isBrowser = typeof window !== 'undefined';
  let firebaseApp: FirebaseApp;

  if (!isBrowser) {
    // During SSR/SSG build phase (Node.js), always provide the config
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    // Detect environment on the client
    const isLocalOrMobile = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.protocol === 'file:' ||
      window.location.hostname.includes('capacitor');

    if (isLocalOrMobile) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      try {
        // Attempt to initialize via Firebase App Hosting environment variables
        firebaseApp = initializeApp();
      } catch (e) {
        // Fallback to config if auto-init fails (e.g., during preview or local prod test)
        firebaseApp = initializeApp(firebaseConfig);
      }
    }
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
