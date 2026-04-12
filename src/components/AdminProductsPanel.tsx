import React, { useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type SaveProductInput,
} from '../services/productsService';
import type { ProductItem } from '../types';

type Props = {
  isLoggedIn: boolean;
};

const initialForm: SaveProductInput = {
  imageUrl: '',
  imageFile: null,
  displayOrder: 1,
  active: true,
  nameEn: '',
  nameRw: '',
  nameFr: '',
  descriptionEn: '',
  descriptionRw: '',
  descriptionFr: '',
  categoryEn: '',
  categoryRw: '',
  categoryFr: '',
};

export default function AdminProductsPanel({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [form, setForm] = useState<SaveProductInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setItems(await listProducts(true));
  };

  useEffect(() => {
    if (open && isLoggedIn) loadItems();
  }, [open, isLoggedIn]);

  const setField = (name: keyof SaveProductInput, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (item: ProductItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: item.active,
      nameEn: item.translations.en.name,
      nameRw: item.translations.rw.name,
      nameFr: item.translations.fr.name,
      descriptionEn: item.translations.en.description,
      descriptionRw: item.translations.rw.description,
      descriptionFr: item.translations.fr.description,
      categoryEn: item.translations.en.category,
      categoryRw: item.translations.rw.category,
      categoryFr: item.translations.fr.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    await loadItems();
    if (editingId === id) cancelEdit();
  };

  const handleToggleActive = async (item: ProductItem) => {
    await updateProduct({
      id: item.id,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: !item.active,
      nameEn: item.translations.en.name,
      nameRw: item.translations.rw.name,
      nameFr: item.translations.fr.name,
      descriptionEn: item.translations.en.description,
      descriptionRw: item.translations.rw.description,
      descriptionFr: item.translations.fr.description,
      categoryEn: item.translations.en.category,
      categoryRw: item.translations.rw.category,
      categoryFr: item.translations.fr.category,
    });
    await loadItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    try {
      setSaving(true);
      if (editingId) {
        await updateProduct({ ...form, id: editingId });
        setMessage('Product updated.');
      } else {
        await createProduct(form);
        setMessage('Product uploaded.');
      }
      cancelEdit();
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-emerald-900">Products Management</h3>
        <button onClick={() => setOpen((v) => !v)} className="bg-emerald-900 text-white px-5 py-3 rounded-xl font-bold">
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      {open && (
        <div className="mt-8 space-y-10">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="Image URL" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input type="file" accept="image/*" onChange={(e) => setField('imageFile', e.target.files?.[0] ?? null)} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input type="number" value={form.displayOrder} onChange={(e) => setField('displayOrder', Number(e.target.value))} placeholder="Display order" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.nameEn} onChange={(e) => setField('nameEn', e.target.value)} placeholder="Name EN" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.nameRw} onChange={(e) => setField('nameRw', e.target.value)} placeholder="Name RW" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.nameFr} onChange={(e) => setField('nameFr', e.target.value)} placeholder="Name FR" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input value={form.categoryEn} onChange={(e) => setField('categoryEn', e.target.value)} placeholder="Category EN" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.categoryRw} onChange={(e) => setField('categoryRw', e.target.value)} placeholder="Category RW" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.categoryFr} onChange={(e) => setField('categoryFr', e.target.value)} placeholder="Category FR" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
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
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Upload Product'}
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
            <h4 className="text-xl font-bold text-emerald-900">Existing Products</h4>
            {items.length === 0 ? (
              <p className="text-slate-500">No products yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border border-emerald-900/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-emerald-900">{item.translations.en.name}</h5>
                    <p className="text-sm text-slate-600">{item.translations.en.category}</p>
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