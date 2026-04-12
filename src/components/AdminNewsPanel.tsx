import React, { useEffect, useState } from 'react';
import type { NewsCategory, NewsItem } from '../types';
import {
  createNews,
  deleteNews,
  listNews,
  updateNews,
  type SaveNewsInput,
} from '../services/newsService';

type Props = {
  labels: Record<NewsCategory, string>;
  isLoggedIn: boolean;
};

const initialForm: SaveNewsInput = {
  category: 'training',
  date: '',
  featured: false,
  active: true,
  imageUrl: '',
  imageFile: null,
  titleEn: '',
  titleRw: '',
  titleFr: '',
  summaryEn: '',
  summaryRw: '',
  summaryFr: '',
  contentEn: '',
  contentRw: '',
  contentFr: '',
};

export default function AdminNewsPanel({ labels, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<SaveNewsInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    const data = await listNews(true);
    setItems(data);
  };

  useEffect(() => {
    if (open && isLoggedIn) loadItems();
  }, [open, isLoggedIn]);

  const setField = (name: keyof SaveNewsInput, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      category: item.category,
      date: item.date,
      featured: item.featured,
      active: true,
      imageUrl: item.imageUrl,
      imageFile: null,
      titleEn: item.translations.en.title,
      titleRw: item.translations.rw.title,
      titleFr: item.translations.fr.title,
      summaryEn: item.translations.en.summary,
      summaryRw: item.translations.rw.summary,
      summaryFr: item.translations.fr.summary,
      contentEn: item.translations.en.content,
      contentRw: item.translations.rw.content,
      contentFr: item.translations.fr.content,
    });
    setMessage('Editing selected news item.');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this news item?')) return;
    await deleteNews(id);
    setMessage('News deleted.');
    await loadItems();
    if (editingId === id) cancelEdit();
  };

  const handleToggleActive = async (item: NewsItem) => {
    await updateNews({
      id: item.id,
      category: item.category,
      date: item.date,
      featured: item.featured,
      active: !true, // kept for compatibility if collection doesn't yet use active on old rows
      imageUrl: item.imageUrl,
      imageFile: null,
      titleEn: item.translations.en.title,
      titleRw: item.translations.rw.title,
      titleFr: item.translations.fr.title,
      summaryEn: item.translations.en.summary,
      summaryRw: item.translations.rw.summary,
      summaryFr: item.translations.fr.summary,
      contentEn: item.translations.en.content,
      contentRw: item.translations.rw.content,
      contentFr: item.translations.fr.content,
    });
    await loadItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage('Please log in first.');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateNews({ ...form, id: editingId });
        setMessage('News updated.');
      } else {
        await createNews(form);
        setMessage('News uploaded.');
      }
      cancelEdit();
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save news.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-emerald-900">News Management</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="bg-emerald-900 text-white px-5 py-3 rounded-xl font-bold"
        >
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      {open && (
        <div className="mt-8 space-y-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={form.category}
                onChange={(e) => setField('category', e.target.value as NewsCategory)}
                className="px-4 py-3 rounded-xl border border-emerald-900/10"
              >
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <input
                type="date"
                value={form.date}
                onChange={(e) => setField('date', e.target.value)}
                className="px-4 py-3 rounded-xl border border-emerald-900/10"
              />

              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setField('imageUrl', e.target.value)}
                placeholder="Image URL"
                className="px-4 py-3 rounded-xl border border-emerald-900/10"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setField('imageFile', e.target.files?.[0] ?? null)}
              className="px-4 py-3 rounded-xl border border-emerald-900/10"
            />

            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.titleEn} onChange={(e) => setField('titleEn', e.target.value)} placeholder="Title EN" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.titleRw} onChange={(e) => setField('titleRw', e.target.value)} placeholder="Title RW" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.titleFr} onChange={(e) => setField('titleFr', e.target.value)} placeholder="Title FR" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.summaryEn} onChange={(e) => setField('summaryEn', e.target.value)} placeholder="Summary EN" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.summaryRw} onChange={(e) => setField('summaryRw', e.target.value)} placeholder="Summary RW" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.summaryFr} onChange={(e) => setField('summaryFr', e.target.value)} placeholder="Summary FR" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.contentEn} onChange={(e) => setField('contentEn', e.target.value)} placeholder="Content EN" rows={6} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.contentRw} onChange={(e) => setField('contentRw', e.target.value)} placeholder="Content RW" rows={6} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.contentFr} onChange={(e) => setField('contentFr', e.target.value)} placeholder="Content FR" rows={6} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.active} onChange={(e) => setField('active', e.target.checked)} />
                Visible
              </label>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={saving} className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold">
                {saving ? 'Saving...' : editingId ? 'Update News' : 'Upload News'}
              </button>
              {editingId ? (
                <button type="button" onClick={cancelEdit} className="bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold">
                  Cancel Edit
                </button>
              ) : null}
            </div>

            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </form>

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-emerald-900">Existing News</h4>
            {items.length === 0 ? (
              <p className="text-slate-500">No news yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border border-emerald-900/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-emerald-900">{item.translations.en.title}</h5>
                    <p className="text-sm text-slate-600">{labels[item.category]} • {item.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => startEdit(item)} className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold">Delete</button>
                    <button onClick={() => handleToggleActive(item)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                      Hide/Show
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}