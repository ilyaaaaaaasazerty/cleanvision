'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  createService,
  updateService,
  getCategories,
  uploadServiceImage,
} from '@/lib/supabaseClient';
import type { Service, Category } from '@/lib/types';

interface Props {
  initial?: Partial<Service>;
  mode: 'create' | 'edit';
}

export default function ServiceForm({ initial, mode }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initial?.image_url ?? '');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    image_url: initial?.image_url ?? '',
    category_id: initial?.category_id ?? '',
    price: initial?.price?.toString() ?? '',
    featured: initial?.featured ?? false,
  });

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data as Category[]))
      .catch(() => setCategories([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);

    try {
      let imageUrl = form.image_url;

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadServiceImage(imageFile);
        } catch {
          alert('Image upload failed. Saving without image.');
        } finally {
          setUploadingImage(false);
        }
      }

      const payload = {
        title: form.title,
        description: form.description,
        image_url: imageUrl || null,
        category_id: form.category_id || null,
        price: form.price ? parseFloat(form.price) : null,
        featured: form.featured,
      };

      if (mode === 'create') {
        await createService(payload as never);
      } else if (initial?.id) {
        await updateService(initial.id, payload);
      }

      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      alert(`Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full bg-white/[0.03] border border-white/10 text-alabaster text-sm px-4 py-3 placeholder-alabaster/25 focus:outline-none focus:border-ice-blue/40 transition-colors font-body';
  const labelClass = 'font-mono text-[10px] tracking-widest uppercase text-alabaster/40 block mb-2';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Residential Deep Clean"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Detailed description of this service..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Image upload */}
      <div>
        <label className={labelClass}>Service Image</label>
        <div className="flex gap-4 items-start">
          {imagePreview && (
            <div className="relative w-24 h-16 overflow-hidden border border-white/10 flex-shrink-0">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-alabaster/40 file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-white/5 file:text-alabaster/60 file:font-mono file:text-xs file:tracking-wider file:cursor-pointer hover:file:bg-white/10 transition-colors"
            />
            <p className="font-mono text-[10px] text-alabaster/20 mt-2">
              Or enter URL directly below
            </p>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => {
                setForm({ ...form, image_url: e.target.value });
                if (!imageFile) setImagePreview(e.target.value);
              }}
              placeholder="https://..."
              className={`${inputClass} mt-2`}
            />
          </div>
        </div>
      </div>

      {/* Category + Price row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className={`${inputClass} cursor-pointer`}
            style={{ appearance: 'none' }}
          >
            <option value="" style={{ background: '#0D0D0D' }}>None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} style={{ background: '#0D0D0D' }}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Starting Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="120"
            className={inputClass}
          />
        </div>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setForm({ ...form, featured: !form.featured })}
            className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${
              form.featured ? 'bg-deep-teal' : 'bg-white/10'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                form.featured ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="font-mono text-xs text-alabaster/50 tracking-wider uppercase group-hover:text-alabaster/70 transition-colors">
            Feature this service on homepage
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="px-8 py-3 bg-ice-blue text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-deep-teal hover:text-alabaster transition-all duration-300 disabled:opacity-50"
        >
          {saving ? (uploadingImage ? 'Uploading...' : 'Saving...') : mode === 'create' ? 'Create Service' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/services')}
          className="px-8 py-3 border border-white/10 text-alabaster/40 font-mono text-xs tracking-widest uppercase hover:border-white/20 hover:text-alabaster/60 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
