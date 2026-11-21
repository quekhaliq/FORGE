// ============================================================================
// Firebase — app init, analytics, auth (Google sign-in), Firestore sync
// ============================================================================
import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBwoew0fmi9JC19X4QzwazHxXAO4JHC53s',
  authDomain: 'forge-747d7.firebaseapp.com',
  projectId: 'forge-747d7',
  storageBucket: 'forge-747d7.firebasestorage.app',
  messagingSenderId: '682829554539',
  appId: '1:682829554539:web:0f5777b9c8b524afa5e22e',
  measurementId: 'G-7F5H7XK6CE',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Analytics only works in browser contexts with measurement support
analyticsSupported()
  .then((ok) => {
    if (ok && !navigator.webdriver) getAnalytics(app)
  })
  .catch(() => {})

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export function watchAuth(cb) {
  return onAuthStateChanged(auth, cb)
}

// Redirect flow — works in embedded/in-app browsers where popups are blocked.
// The result is picked up in CloudSyncCard via getRedirectResult on mount.
export function signInGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithRedirect(auth, provider)
}

export function getRedirectResultSafe() {
  return getRedirectResult(auth)
}

export async function signOutUser() {
  await fbSignOut(auth)
}

// ---------------------------------------------------------------------------
// Firestore sync — one doc per user: users/{uid}/meta/current
// ---------------------------------------------------------------------------
function userDoc(uid) {
  return doc(db, 'users', uid, 'data', 'current')
}

export async function cloudPull(uid) {
  const snap = await getDoc(userDoc(uid))
  if (!snap.exists()) return null
  return snap.data().state ?? null
}

export async function cloudPush(uid, state) {
  await setDoc(userDoc(uid), { state, updatedAt: serverTimestamp() }, { merge: false })
}
