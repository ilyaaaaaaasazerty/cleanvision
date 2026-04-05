import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Allow build to succeed even without env vars — runtime calls will fail gracefully
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// ─── Services ──────────────────────────────────────────────────
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*, category:categories(id, name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getFeaturedServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*, category:categories(id, name)')
    .eq('featured', true)
    .limit(6);

  if (error) throw error;
  return data;
}

export async function getServiceById(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*, category:categories(id, name)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createService(service: Omit<import('./types').Service, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateService(id: string, updates: Partial<import('./types').Service>) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

// ─── Categories ────────────────────────────────────────────────
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createCategory(name: string) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ─── Bookings ──────────────────────────────────────────────────
export async function createBooking(booking: {
  name: string;
  phone: string;
  service: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ ...booking, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ─── Storage ───────────────────────────────────────────────────
export async function uploadServiceImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('service-images')
    .upload(filename, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from('service-images')
    .getPublicUrl(filename);

  return data.publicUrl;
}
