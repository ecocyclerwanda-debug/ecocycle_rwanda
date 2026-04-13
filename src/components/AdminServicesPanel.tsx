import React, { useEffect, useState } from 'react';
import {
  createService,
  deleteService,
  listServices,
  updateService,
  type SaveServiceInput,
} from '../services/servicesService';
import type { ServiceItem } from '../types';

type Props = {
  isLoggedIn: boolean;
};

const initialForm: SaveServiceInput = {
  slug: '',
  imageUrl: '',
  imageFile: null,
  displayOrder: 1,
  active: true,

  titleEn: '',
  titleRw: '',
  titleFr: '',

  subtitleEn: '',
  subtitleRw: '',
  subtitleFr: '',

  descriptionEn: '',
  descriptionRw: '',
  descriptionFr: '',

  featuresEn: '',
  featuresRw: '',
  featuresFr: '',

  outcomesEn: '',
  outcomesRw: '',
  outcomesFr: '',
};

export default function AdminServicesPanel({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState<SaveServiceInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setItems(await listServices(true));
  };

  useEffect(() => {
    if (open && isLoggedIn) loadItems();
  }, [open, isLoggedIn]);

  const setField = (name: keyof SaveServiceInput, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (item: ServiceItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      slug: item.slug,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: item.active,

      titleEn: item.translations.en.title,
      titleRw: item.translations.rw.title,
      titleFr: item.translations.fr.title,

      subtitleEn: item.translations.en.subtitle,
      subtitleRw: item.translations.rw.subtitle,
      subtitleFr: item.translations.fr.subtitle,

      descriptionEn: item.translations.en.description,
      descriptionRw: item.translations.rw.description,
      descriptionFr: item.translations.fr.description,

      featuresEn: item.translations.en.features.join('\n'),
      featuresRw: item.translations.rw.features.join('\n'),
      featuresFr: item.translations.fr.features.join('\n'),

      outcomesEn: item.translations.en.outcomes.join('\n'),
      outcomesRw: item.translations.rw.outcomes.join('\n'),
      outcomesFr: item.translations.fr.outcomes.join('\n'),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setMessage('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    await deleteService(id);
    await loadItems();
    if (editingId === id) cancelEdit();
  };

  const handleToggleActive = async (item: ServiceItem) => {
    await updateService({
      id: item.id,
      slug: item.slug,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: !item.active,

      titleEn: item.translations.en.title,
      titleRw: item.translations.rw.title,
      titleFr: item.translations.fr.title,

      subtitleEn: item.translations.en.subtitle,
      subtitleRw: item.translations.rw.subtitle,
      subtitleFr: item.translations.fr.subtitle,

      descriptionEn: item.translations.en.description,
      descriptionRw: item.translations.rw.description,
      descriptionFr: item.translations.fr.description,

      featuresEn: item.translations.en.features.join('\n'),
      featuresRw: item.translations.rw.features.join('\n'),
      featuresFr: item.translations.fr.features.join('\n'),

      outcomesEn: item.translations.en.outcomes.join('\n'),
      outcomesRw: item.translations.rw.outcomes.join('\n'),
      outcomesFr: item.translations.fr.outcomes.join('\n'),
    });

    await loadItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    try {
      setSaving(true);

      if (editingId) {
        await updateService({ ...form, id: editingId });
        setMessage('Service updated.');
      } else {
        await createService(form);
        setMessage('Service uploaded.');
      }

      cancelEdit();
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-emerald-900">Services Management</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="bg-emerald-900 text-white px-5 py-3 rounded-xl font-bold"
        >
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      {open && (
        <div className="mt-8 space-y-10">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                value={form.slug}
                onChange={(e) => setField('slug', e.target.value)}
                placeholder="Slug (example: farming)"
                className="px-4 py-3 rounded-xl border border-emerald-900/10"
              />
              <input
                value={form.imageUrl}
                onChange={(e) => setField('imageUrl', e.target.value)}
                placeholder="Image URL"
                className="px-4 py-3 rounded-xl border border-emerald-900/10"
              />
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setField('displayOrder', Number(e.target.value))}
                placeholder="Display order"
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
              <input value={form.subtitleEn} onChange={(e) => setField('subtitleEn', e.target.value)} placeholder="Subtitle EN" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.subtitleRw} onChange={(e) => setField('subtitleRw', e.target.value)} placeholder="Subtitle RW" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.subtitleFr} onChange={(e) => setField('subtitleFr', e.target.value)} placeholder="Subtitle FR" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.descriptionEn} onChange={(e) => setField('descriptionEn', e.target.value)} placeholder="Description EN" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.descriptionRw} onChange={(e) => setField('descriptionRw', e.target.value)} placeholder="Description RW" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.descriptionFr} onChange={(e) => setField('descriptionFr', e.target.value)} placeholder="Description FR" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.featuresEn} onChange={(e) => setField('featuresEn', e.target.value)} placeholder="Features EN (one per line)" rows={5} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.featuresRw} onChange={(e) => setField('featuresRw', e.target.value)} placeholder="Features RW (one per line)" rows={5} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.featuresFr} onChange={(e) => setField('featuresFr', e.target.value)} placeholder="Features FR (one per line)" rows={5} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.outcomesEn} onChange={(e) => setField('outcomesEn', e.target.value)} placeholder="Outcomes EN (one per line)" rows={5} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.outcomesRw} onChange={(e) => setField('outcomesRw', e.target.value)} placeholder="Outcomes RW (one per line)" rows={5} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.outcomesFr} onChange={(e) => setField('outcomesFr', e.target.value)} placeholder="Outcomes FR (one per line)" rows={5} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setField('active', e.target.checked)} />
              Visible
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold"
              >
                {saving ? 'Saving...' : editingId ? 'Update Service' : 'Upload Service'}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>

            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </form>

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-emerald-900">Existing Services</h4>

            {items.length === 0 ? (
              <p className="text-slate-500">No services yet.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="border border-emerald-900/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h5 className="font-bold text-emerald-900">{item.translations.en.title}</h5>
                    <p className="text-sm text-slate-600">Slug: {item.slug}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => startEdit(item)}
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