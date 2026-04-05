// lib/types.ts
export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category_id: string | null;
  price: number | null;
  featured: boolean;
  created_at: string;
  category?: Category;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  avatar_url: string | null;
}
