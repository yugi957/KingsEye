/**
 * mock/auth.ts — DEMO BRANCH
 *
 * Drop-in replacement for FIREBASE_AUTH. Auto-logged in as "Demo User".
 * Exported as FIREBASE_AUTH so existing imports work unchanged when
 * FirebaseConfig.ts is swapped to this module via tsconfig path alias.
 */

export const DEMO_USER = {
  email: 'demo@kingseye.app',
  uid: 'demo_user_001',
  displayName: 'Demo User',
};

// Minimal shape of the Firebase Auth object used across the app
export const FIREBASE_AUTH = {
  currentUser: DEMO_USER,
  signOut: async () => {
    // no-op in demo
  },
};

export const FIREBASE_APP = null;
