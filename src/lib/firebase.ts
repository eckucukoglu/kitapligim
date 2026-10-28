import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "kitapligim55.firebaseapp.com",
  projectId: "kitapligim55",
  storageBucket: "kitapligim55.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
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

// Authentication
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
    throw new Error(`Yalnızca yetkili e-posta adresi (${AUTHORIZED_EMAIL}) ile giriş yapılabilir.`);
  }
  const credential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  return credential.user;
}

export async function sendResetEmail(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
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
    throw new Error('Veri ekleme/düzenleme yetkisi yalnızca kitapligim@emre.mozmail.com adresine aittir.');
  }
  const ref = doc(db, 'books', book.id);
  const data: Record<string, any> = { ...book, updatedAt: Date.now() };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  await setDoc(ref, data, { merge: true });
}

export async function deleteBookFromCloud(bookId: string): Promise<void> {
  if (!isCurrentUserAuthorized()) {
    throw new Error('Veri silme yetkisi yalnızca kitapligim@emre.mozmail.com adresine aittir.');
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
    throw new Error('Not ekleme/düzenleme yetkisi yalnızca kitapligim@emre.mozmail.com adresine aittir.');
  }
  const ref = doc(db, 'notes', note.id);
  const data: Record<string, any> = { ...note, updatedAt: Date.now() };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  await setDoc(ref, data, { merge: true });
}

export async function deleteNoteFromCloud(noteId: string): Promise<void> {
  if (!isCurrentUserAuthorized()) {
    throw new Error('Not silme yetkisi yalnızca kitapligim@emre.mozmail.com adresine aittir.');
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
    throw new Error('Hedef güncelleme yetkisi yalnızca kitapligim@emre.mozmail.com adresine aittir.');
  }
  const ref = doc(db, 'goals', String(goal.year));
  const data = { ...goal, updatedAt: Date.now() };
  await setDoc(ref, data, { merge: true });
}
