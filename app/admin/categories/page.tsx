'use client';

import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '@/lib/db';
import type { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await getCategories();
      setCategories(data as Category[]);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const cat = await createCategory(newName.trim());
      setCategories((prev) => [...prev, cat as Category]);
      setNewName('');
    } catch (err: any) {
      alert(`Failed to create category: ${err?.message || 'Unknown error'}`);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    setDeleting(id);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-alabaster mb-1">Categories</h1>
        <p className="font-mono text-xs text-alabaster/30 tracking-wider">
          Organise services by category
        </p>
      </div>

      <div className="max-w-lg">
        {/* Add form */}
        <form onSubmit={handleAdd} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="flex-1 bg-white/[0.03] border border-white/10 text-alabaster text-sm px-4 py-3 placeholder-alabaster/25 focus:outline-none focus:border-ice-blue/40 font-body"
          />
          <button
            type="submit"
            disabled={adding || !newName.trim()}
            className="px-6 py-3 bg-ice-blue text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-deep-teal hover:text-alabaster transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? '...' : 'Add'}
          </button>
        </form>

        {/* List */}
        {loading ? (
          <div className="py-10 text-center">
            <div className="w-5 h-5 border border-ice-blue/30 border-t-ice-blue rounded-full animate-spin mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <p className="font-body text-sm text-alabaster/30 py-8 border border-white/5 text-center">
            No categories yet. Add one above.
          </p>
        ) : (
          <div className="border border-white/5 divide-y divide-white/5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <span className="font-body text-sm text-alabaster/70">{cat.name}</span>
                  <span className="ml-3 font-mono text-[10px] text-alabaster/20">{cat.id.slice(0, 8)}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={deleting === cat.id}
                  className="font-mono text-xs text-alabaster/20 hover:text-red-400 transition-colors px-2 py-1 disabled:opacity-40"
                >
                  {deleting === cat.id ? '...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
