import React, { useEffect, useState } from 'react';
import {
  createImpactStory,
  deleteImpactStory,
  listImpactStories,
  updateImpactStory,
} from '../services/impactsService';
import type { ImpactStoryItem } from '../types';

type Props = {
  isLoggedIn: boolean;
};

type FormState = {
  id?: string;
  name: string;
  roleEn: string;
  roleRw: string;
  roleFr: string;
  quoteEn: string;
  quoteRw: string;
  quoteFr: string;
  imageUrl: string;
  videoUrl: string;
  displayOrder: number;
  active: boolean;
  imageFile: File | null;
};

const initialState: FormState = {
  name: '',
  roleEn: '',
  roleRw: '',
  roleFr: '',
  quoteEn: '',
  quoteRw: '',
  quoteFr: '',
  imageUrl: '',
  videoUrl: '',
  displayOrder: 1,
  active: true,
  imageFile: null,
};

export default function AdminImpactsPanel({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ImpactStoryItem[]>([]);
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadItems = async () => {
    const data = await listImpactStories();
    setItems(data);
  };

  useEffect(() => {
    if (open && isLoggedIn) loadItems();
  }, [open, isLoggedIn]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleEdit = (item: ImpactStoryItem) => {
    setForm({
      id: item.id,
      name: item.name,
      roleEn: item.translations.en.role,
      roleRw: item.translations.rw.role,
      roleFr: item.translations.fr.role,
      quoteEn: item.translations.en.quote,
      quoteRw: item.translations.rw.quote,
      quoteFr: item.translations.fr.quote,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      displayOrder: item.displayOrder,
      active: item.active,
      imageFile: null,
    });

    setMessage('Editing selected impact story.');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this impact story?')) return;

    try {
      await deleteImpactStory(id);
      setMessage('Impact story deleted.');
      await loadItems();
    } catch {
      setMessage('Failed to delete impact story.');
    }
  };

  const handleToggleActive = async (item: ImpactStoryItem) => {
    try {
      await updateImpactStory({
        id: item.id,
        name: item.name,
        roleEn: item.translations.en.role,
        roleRw: item.translations.rw.role,
        roleFr: item.translations.fr.role,
        quoteEn: item.translations.en.quote,
        quoteRw: item.translations.rw.quote,
        quoteFr: item.translations.fr.quote,
        imageUrl: item.imageUrl,
        imageFile: null,
        videoUrl: item.videoUrl,
        displayOrder: item.displayOrder,
        active: !item.active,
      });

      setMessage('Impact visibility updated.');
      await loadItems();
    } catch {
      setMessage('Failed to update impact visibility.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!isLoggedIn) {
      setMessage('Please log in first.');
      return;
    }

    try {
      setSaving(true);

      if (form.id) {
        await updateImpactStory(form);
        setMessage('Impact story updated successfully.');
      } else {
        await createImpactStory(form);
        setMessage('Impact story uploaded successfully.');
      }

      setForm(initialState);
      await loadItems();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Failed to save impact story.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm">
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-2xl font-bold text-emerald-900">Impact Management</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-6 py-3 rounded-xl bg-emerald-900 text-white font-bold"
        >
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      {open && (
        <div className="mt-8 space-y-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Person name"
              className="px-6 py-4 rounded-xl border border-emerald-900/10"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input name="roleEn" value={form.roleEn} onChange={handleChange} placeholder="Role in English" className="px-6 py-4 rounded-xl border border-emerald-900/10" />
              <input name="roleRw" value={form.roleRw} onChange={handleChange} placeholder="Role in Kinyarwanda" className="px-6 py-4 rounded-xl border border-emerald-900/10" />
              <input name="roleFr" value={form.roleFr} onChange={handleChange} placeholder="Role in French" className="px-6 py-4 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <textarea name="quoteEn" value={form.quoteEn} onChange={handleChange} placeholder="Quote/story in English" rows={4} className="px-6 py-4 rounded-xl border border-emerald-900/10" />
              <textarea name="quoteRw" value={form.quoteRw} onChange={handleChange} placeholder="Quote/story in Kinyarwanda" rows={4} className="px-6 py-4 rounded-xl border border-emerald-900/10" />
              <textarea name="quoteFr" value={form.quoteFr} onChange={handleChange} placeholder="Quote/story in French" rows={4} className="px-6 py-4 rounded-xl border border-emerald-900/10" />
            </div>

            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL (optional if uploading file)"
              className="px-6 py-4 rounded-xl border border-emerald-900/10"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="px-6 py-4 rounded-xl border border-emerald-900/10 bg-white"
            />

            <input
              type="url"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="Video URL"
              className="px-6 py-4 rounded-xl border border-emerald-900/10"
            />

            <input
              type="number"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              placeholder="Display order"
              className="px-6 py-4 rounded-xl border border-emerald-900/10"
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Show this impact story
            </label>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={saving || !isLoggedIn}
                className="bg-emerald-900 text-white py-4 px-6 rounded-xl font-bold disabled:opacity-60"
              >
                {saving
                  ? 'Saving...'
                  : form.id
                  ? 'Update Impact Story'
                  : 'Upload Impact Story'}
              </button>

              {form.id ? (
                <button
                  type="button"
                  onClick={() => setForm(initialState)}
                  className="bg-slate-200 text-slate-800 py-4 px-6 rounded-xl font-bold"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          {message && <p className="text-sm text-slate-600">{message}</p>}

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-emerald-900">Existing Impact Stories</h4>

            {items.length === 0 ? (
              <p className="text-slate-500">No impact stories yet.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="border border-emerald-900/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h5 className="font-bold text-emerald-900">{item.name}</h5>
                    <p className="text-sm text-slate-600">{item.translations.en.role}</p>
                    <p className="text-xs text-slate-500">
                      Order: {item.displayOrder} • {item.active ? 'Visible' : 'Hidden'}
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggleActive(item)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                    >
                      {item.active ? 'Hide' : 'Show'}
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