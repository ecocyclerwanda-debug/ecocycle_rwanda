import React, { useEffect, useState } from 'react';
import {
  createPartner,
  deletePartner,
  listPartners,
  updatePartner,
  type SavePartnerInput,
} from '../services/partnersService';
import type { PartnerItem } from '../types';

type Props = {
  isLoggedIn: boolean;
};

const initialForm: SavePartnerInput = {
  name: '',
  imageUrl: '',
  imageFile: null,
  websiteUrl: '',
  displayOrder: 1,
  active: true,
  descriptionEn: '',
  descriptionRw: '',
  descriptionFr: '',
};

export default function AdminPartnersPanel({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [form, setForm] = useState<SavePartnerInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setItems(await listPartners(true));
  };

  useEffect(() => {
    if (open && isLoggedIn) loadItems();
  }, [open, isLoggedIn]);

  const setField = (name: keyof SavePartnerInput, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (item: PartnerItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      imageFile: null,
      websiteUrl: item.websiteUrl,
      displayOrder: item.displayOrder,
      active: item.active,
      descriptionEn: item.translations.en.description,
      descriptionRw: item.translations.rw.description,
      descriptionFr: item.translations.fr.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this partner?')) return;
    await deletePartner(id);
    await loadItems();
    if (editingId === id) cancelEdit();
  };

  const handleToggleActive = async (item: PartnerItem) => {
    await updatePartner({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      imageFile: null,
      websiteUrl: item.websiteUrl,
      displayOrder: item.displayOrder,
      active: !item.active,
      descriptionEn: item.translations.en.description,
      descriptionRw: item.translations.rw.description,
      descriptionFr: item.translations.fr.description,
    });
    await loadItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    try {
      setSaving(true);
      if (editingId) {
        await updatePartner({ ...form, id: editingId });
        setMessage('Partner updated.');
      } else {
        await createPartner(form);
        setMessage('Partner uploaded.');
      }
      cancelEdit();
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save partner.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-emerald-900">Partners Management</h3>
        <button onClick={() => setOpen((v) => !v)} className="bg-emerald-900 text-white px-5 py-3 rounded-xl font-bold">
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      {open && (
        <div className="mt-8 space-y-10">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Partner name" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.websiteUrl} onChange={(e) => setField('websiteUrl', e.target.value)} placeholder="Website URL" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input type="number" value={form.displayOrder} onChange={(e) => setField('displayOrder', Number(e.target.value))} placeholder="Display order" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input value={form.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="Image URL" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input type="file" accept="image/*" onChange={(e) => setField('imageFile', e.target.files?.[0] ?? null)} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.descriptionEn} onChange={(e) => setField('descriptionEn', e.target.value)} placeholder="Description EN" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.descriptionRw} onChange={(e) => setField('descriptionRw', e.target.value)} placeholder="Description RW" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.descriptionFr} onChange={(e) => setField('descriptionFr', e.target.value)} placeholder="Description FR" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setField('active', e.target.checked)} />
              Visible
            </label>

            <div className="flex gap-4">
              <button type="submit" disabled={saving} className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold">
                {saving ? 'Saving...' : editingId ? 'Update Partner' : 'Upload Partner'}
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
            <h4 className="text-xl font-bold text-emerald-900">Existing Partners</h4>
            {items.length === 0 ? (
              <p className="text-slate-500">No partners yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border border-emerald-900/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-emerald-900">{item.name}</h5>
                    <p className="text-sm text-slate-600">{item.websiteUrl || 'No website'}</p>
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