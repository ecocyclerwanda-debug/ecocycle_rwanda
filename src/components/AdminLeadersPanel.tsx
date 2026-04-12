import React, { useEffect, useState } from 'react';
import {
  createLeader,
  deleteLeader,
  listLeaders,
  updateLeader,
  type SaveLeaderInput,
} from '../services/leadersService';
import type { LeaderItem } from '../types';

type Props = {
  isLoggedIn: boolean;
};

const initialForm: SaveLeaderInput = {
  name: '',
  imageUrl: '',
  imageFile: null,
  displayOrder: 1,
  active: true,
  roleEn: '',
  roleRw: '',
  roleFr: '',
  bioEn: '',
  bioRw: '',
  bioFr: '',
};

export default function AdminLeadersPanel({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<LeaderItem[]>([]);
  const [form, setForm] = useState<SaveLeaderInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setItems(await listLeaders(true));
  };

  useEffect(() => {
    if (open && isLoggedIn) loadItems();
  }, [open, isLoggedIn]);

  const setField = (name: keyof SaveLeaderInput, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (item: LeaderItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: item.active,
      roleEn: item.translations.en.role,
      roleRw: item.translations.rw.role,
      roleFr: item.translations.fr.role,
      bioEn: item.translations.en.bio,
      bioRw: item.translations.rw.bio,
      bioFr: item.translations.fr.bio,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this leader?')) return;
    await deleteLeader(id);
    await loadItems();
    if (editingId === id) cancelEdit();
  };

  const handleToggleActive = async (item: LeaderItem) => {
    await updateLeader({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: !item.active,
      roleEn: item.translations.en.role,
      roleRw: item.translations.rw.role,
      roleFr: item.translations.fr.role,
      bioEn: item.translations.en.bio,
      bioRw: item.translations.rw.bio,
      bioFr: item.translations.fr.bio,
    });
    await loadItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    try {
      setSaving(true);
      if (editingId) {
        await updateLeader({ ...form, id: editingId });
        setMessage('Leader updated.');
      } else {
        await createLeader(form);
        setMessage('Leader uploaded.');
      }
      cancelEdit();
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save leader.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-emerald-900">Leadership Management</h3>
        <button onClick={() => setOpen((v) => !v)} className="bg-emerald-900 text-white px-5 py-3 rounded-xl font-bold">
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      {open && (
        <div className="mt-8 space-y-10">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Name" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.roleEn} onChange={(e) => setField('roleEn', e.target.value)} placeholder="Role EN" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.roleRw} onChange={(e) => setField('roleRw', e.target.value)} placeholder="Role RW" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.roleFr} onChange={(e) => setField('roleFr', e.target.value)} placeholder="Role FR" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.bioEn} onChange={(e) => setField('bioEn', e.target.value)} placeholder="Bio EN" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.bioRw} onChange={(e) => setField('bioRw', e.target.value)} placeholder="Bio RW" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.bioFr} onChange={(e) => setField('bioFr', e.target.value)} placeholder="Bio FR" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="Image URL" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input type="file" accept="image/*" onChange={(e) => setField('imageFile', e.target.files?.[0] ?? null)} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input type="number" value={form.displayOrder} onChange={(e) => setField('displayOrder', Number(e.target.value))} placeholder="Display order" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setField('active', e.target.checked)} />
              Visible
            </label>

            <div className="flex gap-4">
              <button type="submit" disabled={saving} className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold">
                {saving ? 'Saving...' : editingId ? 'Update Leader' : 'Upload Leader'}
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
            <h4 className="text-xl font-bold text-emerald-900">Existing Leaders</h4>
            {items.length === 0 ? (
              <p className="text-slate-500">No leaders yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border border-emerald-900/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-emerald-900">{item.name}</h5>
                    <p className="text-sm text-slate-600">{item.translations.en.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => startEdit(item)} className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold">Delete</button>
                    <button onClick={() => handleToggleActive(item)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">
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