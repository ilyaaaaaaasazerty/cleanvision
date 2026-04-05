import { db, storage, isConfigured } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ─── Helpers ─────────────────────────────────────────────────────
function toDate(ts: Timestamp | null | undefined): string {
  if (!ts) return '';
  return ts.toDate().toISOString();
}

function requireDb() {
  if (!db) throw new Error('Firebase not configured');
  return db;
}

function requireStorage() {
  if (!storage) throw new Error('Firebase Storage not configured');
  return storage;
}

// ─── Services ──────────────────────────────────────────────────
export async function getServices() {
  const firestore = requireDb();
  const q = query(collection(firestore, 'services'), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  const services = await Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data();
      let category = null;
      if (data.category_id) {
        try {
          const catSnap = await getDoc(doc(firestore, 'categories', data.category_id));
          if (catSnap.exists()) {
            category = { id: catSnap.id, name: catSnap.data().name, created_at: toDate(catSnap.data().created_at) };
          }
        } catch { /* ignore */ }
      }
      return {
        id: d.id,
        title: data.title ?? '',
        description: data.description ?? '',
        image_url: data.image_url ?? null,
        category_id: data.category_id ?? null,
        price: data.price ?? null,
        featured: data.featured ?? false,
        created_at: toDate(data.created_at),
        category,
      };
    })
  );
  return services;
}

export async function getFeaturedServices() {
  const firestore = requireDb();
  const q = query(
    collection(firestore, 'services'),
    where('featured', '==', true),
    limit(6)
  );
  const snap = await getDocs(q);
  const services = await Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data();
      let category = null;
      if (data.category_id) {
        try {
          const catSnap = await getDoc(doc(firestore, 'categories', data.category_id));
          if (catSnap.exists()) {
            category = { id: catSnap.id, name: catSnap.data().name, created_at: toDate(catSnap.data().created_at) };
          }
        } catch { /* ignore */ }
      }
      return {
        id: d.id,
        title: data.title ?? '',
        description: data.description ?? '',
        image_url: data.image_url ?? null,
        category_id: data.category_id ?? null,
        price: data.price ?? null,
        featured: data.featured ?? false,
        created_at: toDate(data.created_at),
        category,
      };
    })
  );
  return services;
}

export async function getServiceById(id: string) {
  const firestore = requireDb();
  const snap = await getDoc(doc(firestore, 'services', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  let category = null;
  if (data.category_id) {
    try {
      const catSnap = await getDoc(doc(firestore, 'categories', data.category_id));
      if (catSnap.exists()) {
        category = { id: catSnap.id, name: catSnap.data().name, created_at: toDate(catSnap.data().created_at) };
      }
    } catch { /* ignore */ }
  }
  return {
    id: snap.id,
    title: data.title ?? '',
    description: data.description ?? '',
    image_url: data.image_url ?? null,
    category_id: data.category_id ?? null,
    price: data.price ?? null,
    featured: data.featured ?? false,
    created_at: toDate(data.created_at),
    category,
  };
}

export async function createService(service: {
  title: string;
  description: string;
  image_url: string | null;
  category_id: string | null;
  price: number | null;
  featured: boolean;
}) {
  const firestore = requireDb();
  const docRef = await addDoc(collection(firestore, 'services'), {
    ...service,
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, ...service, created_at: new Date().toISOString() };
}

export async function updateService(id: string, updates: Record<string, unknown>) {
  const firestore = requireDb();
  const docRef = doc(firestore, 'services', id);
  await updateDoc(docRef, updates);
  return { id, ...updates };
}

export async function deleteService(id: string) {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, 'services', id));
}

// ─── Categories ────────────────────────────────────────────────
export async function getCategories() {
  const firestore = requireDb();
  const q = query(collection(firestore, 'categories'), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name ?? '',
    created_at: toDate(d.data().created_at),
  }));
}

export async function createCategory(name: string) {
  const firestore = requireDb();
  const docRef = await addDoc(collection(firestore, 'categories'), {
    name,
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, name, created_at: new Date().toISOString() };
}

export async function deleteCategory(id: string) {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, 'categories', id));
}

// ─── Bookings ──────────────────────────────────────────────────
export async function createBooking(booking: {
  name: string;
  phone: string;
  service: string;
  message: string;
}) {
  const firestore = requireDb();
  const docRef = await addDoc(collection(firestore, 'bookings'), {
    ...booking,
    status: 'pending',
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, ...booking, status: 'pending' as const, created_at: new Date().toISOString() };
}

export async function getBookings() {
  const firestore = requireDb();
  const q = query(collection(firestore, 'bookings'), orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name ?? '',
    phone: d.data().phone ?? '',
    service: d.data().service ?? '',
    message: d.data().message ?? '',
    status: d.data().status ?? 'pending',
    created_at: toDate(d.data().created_at),
  }));
}

export async function updateBookingStatus(id: string, status: string) {
  const firestore = requireDb();
  await updateDoc(doc(firestore, 'bookings', id), { status });
}

// ─── Storage ───────────────────────────────────────────────────
export async function uploadServiceImage(file: File): Promise<string> {
  const store = requireStorage();
  const ext = file.name.split('.').pop();
  const filename = `service-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef = ref(store, filename);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
