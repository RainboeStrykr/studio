'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate Google Sign-In with popup. Returns promise for error handling. */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  // Call signInWithPopup and return the promise so callers can handle errors
  return signInWithPopup(authInstance, provider)
    .then(() => {
      // Success - auth state change is handled by onAuthStateChanged listener
    })
    .catch((error) => {
      // Handle specific error cases
      console.error('Google Sign-In Error:', error);

      // Error codes reference: https://firebase.google.com/docs/reference/js/auth#autherrorcodes
      let userMessage = 'Failed to sign in with Google. Please try again.';

      if (error.code === 'auth/popup-blocked') {
        userMessage = 'Popup was blocked. Please allow popups for this site and try again.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        userMessage = 'Sign-in was cancelled.';
      } else if (error.code === 'auth/operation-not-allowed') {
        userMessage = 'Google Sign-In is not enabled. Please enable it in Firebase Console.';
      } else if (error.code === 'auth/unauthorized-domain') {
        userMessage = 'This domain is not authorized. Please add it to Firebase authorized domains.';
      }

      // Re-throw with user-friendly message
      throw new Error(userMessage);
    });
}
