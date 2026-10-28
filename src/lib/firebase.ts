import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Unsubscribe 
} from 'firebase/firestore';
import { Book, BookNote, ReadingGoal } from '../types';

export const AUTHORIZED_EMAIL = 'kitapligim@emre.mozmail.com';

// Firebase configuration for Kitaplığım
export const firebaseConfig = {
  projectId: "benimkitapligim",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  storageBucket: "benimkitapligim.firebasestorage.app",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "benimkitapligim.firebaseapp.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  projectNumber: import.meta.env.VITE_FIREBASE_PROJECT_NUMBER || ""
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export function isAuthorized(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_EMAIL.toLowerCase();
}

export function isCurrentUserAuthorized(): boolean {
  return isAuthorized(auth.currentUser?.email);
}

// Authentication: Send Magic Link / Password to Email
export async function sendLoginLink(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
    throw new Error('Yetkisiz e-posta adresi.');
  }

  const actionCodeSettings = {
    url: window.location.origin + window.location.pathname,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
  window.localStorage.setItem('kitapligim_email_for_signin', cleanEmail);
}

// Check & Complete Email Link Sign In on App Load
export async function handleEmailLinkSignIn(): Promise<User | null> {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('kitapligim_email_for_signin');
    if (!email) {
      email = AUTHORIZED_EMAIL;
    }
    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem('kitapligim_email_for_signin');
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return result.user;
  }
  return null;
}

// Authentication with Password
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
    throw new Error('Yetkisiz e-posta adresi veya geçersiz şifre.');
  }
  const credential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  return credential.user;
}

export async function sendResetEmail(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
    throw new Error('Yetkisiz e-posta adresi.');
  }
  await sendPasswordResetEmail(auth, cleanEmail);
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null, isAuthUser: boolean) => void): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    callback(user, isAuthorized(user?.email));
  });
}

// ================= Firestore Data Sync =================

// Books Sync
export function subscribeToBooks(onData: (books: Book[]) => void, onError?: (err: Error) => void): Unsubscribe {
  const colRef = collection(db, 'books');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const items: Book[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as Book);
    });
    onData(items);
  }, (err) => {
    console.error('Books fetch error:', err);
    if (onError) onError(err);
  });
}

export async function saveBookToCloud(book: Book): Promise<void> {
  if (!isCurrentUserAuthorized()) {
    throw new Error('Veri değişikliği için yetkiniz bulunmamaktadır.');
  }
  const ref = doc(db, 'books', book.id);
  const data: Record<string, any> = { ...book, updatedAt: Date.now() };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  await setDoc(ref, data, { merge: true });
}

export async function deleteBookFromCloud(bookId: string): Promise<void> {
  if (!isCurrentUserAuthorized()) {
    throw new Error('Veri değişikliği için yetkiniz bulunmamaktadır.');
  }
  await deleteDoc(doc(db, 'books', bookId));
}

// Notes Sync
export function subscribeToNotes(onData: (notes: BookNote[]) => void, onError?: (err: Error) => void): Unsubscribe {
  const colRef = collection(db, 'notes');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const items: BookNote[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as BookNote);
    });
    onData(items);
  }, (err) => {
    console.error('Notes fetch error:', err);
    if (onError) onError(err);
  });
}

export async function saveNoteToCloud(note: BookNote): Promise<void> {
  if (!isCurrentUserAuthorized()) {
    throw new Error('Veri değişikliği için yetkiniz bulunmamaktadır.');
  }
  const ref = doc(db, 'notes', note.id);
  const data: Record<string, any> = { ...note, updatedAt: Date.now() };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  await setDoc(ref, data, { merge: true });
}

export async function deleteNoteFromCloud(noteId: string): Promise<void> {
  if (!isCurrentUserAuthorized()) {
    throw new Error('Veri değişikliği için yetkiniz bulunmamaktadır.');
  }
  await deleteDoc(doc(db, 'notes', noteId));
}

// Goals Sync
export function subscribeToGoal(year: number, onData: (goal: ReadingGoal | null) => void, onError?: (err: Error) => void): Unsubscribe {
  const ref = doc(db, 'goals', String(year));
  return onSnapshot(ref, (docSnap) => {
    if (docSnap.exists()) {
      onData(docSnap.data() as ReadingGoal);
    } else {
      onData(null);
    }
  }, (err) => {
    console.error('Goal fetch error:', err);
    if (onError) onError(err);
  });
}

export async function saveGoalToCloud(goal: ReadingGoal): Promise<void> {
  if (!isCurrentUserAuthorized()) {
    throw new Error('Veri değişikliği için yetkiniz bulunmamaktadır.');
  }
  const ref = doc(db, 'goals', String(goal.year));
  const data = { ...goal, updatedAt: Date.now() };
  await setDoc(ref, data, { merge: true });
}
