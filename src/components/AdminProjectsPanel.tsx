import React, { useEffect, useState } from 'react';
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
  type SaveProjectInput,
} from '../services/projectsService';
import type { ProjectItem } from '../types';

type Props = {
  isLoggedIn: boolean;
};

const initialForm: SaveProjectInput = {
  imageUrl: '',
  imageFile: null,
  displayOrder: 1,
  active: true,
  titleEn: '',
  titleRw: '',
  titleFr: '',
  goalEn: '',
  goalRw: '',
  goalFr: '',
  impactEn: '',
  impactRw: '',
  impactFr: '',
  activitiesEn: '',
  activitiesRw: '',
  activitiesFr: '',
};

export default function AdminProjectsPanel({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [form, setForm] = useState<SaveProjectInput>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    setItems(await listProjects(true));
  };

  useEffect(() => {
    if (open && isLoggedIn) loadItems();
  }, [open, isLoggedIn]);

  const setField = (name: keyof SaveProjectInput, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (item: ProjectItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: item.active,
      titleEn: item.translations.en.title,
      titleRw: item.translations.rw.title,
      titleFr: item.translations.fr.title,
      goalEn: item.translations.en.goal,
      goalRw: item.translations.rw.goal,
      goalFr: item.translations.fr.goal,
      impactEn: item.translations.en.impact,
      impactRw: item.translations.rw.impact,
      impactFr: item.translations.fr.impact,
      activitiesEn: item.translations.en.activities,
      activitiesRw: item.translations.rw.activities,
      activitiesFr: item.translations.fr.activities,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    await deleteProject(id);
    await loadItems();
    if (editingId === id) cancelEdit();
  };

  const handleToggleActive = async (item: ProjectItem) => {
    await updateProject({
      id: item.id,
      imageUrl: item.imageUrl,
      imageFile: null,
      displayOrder: item.displayOrder,
      active: !item.active,
      titleEn: item.translations.en.title,
      titleRw: item.translations.rw.title,
      titleFr: item.translations.fr.title,
      goalEn: item.translations.en.goal,
      goalRw: item.translations.rw.goal,
      goalFr: item.translations.fr.goal,
      impactEn: item.translations.en.impact,
      impactRw: item.translations.rw.impact,
      impactFr: item.translations.fr.impact,
      activitiesEn: item.translations.en.activities,
      activitiesRw: item.translations.rw.activities,
      activitiesFr: item.translations.fr.activities,
    });
    await loadItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    try {
      setSaving(true);
      if (editingId) {
        await updateProject({ ...form, id: editingId });
        setMessage('Project updated.');
      } else {
        await createProject(form);
        setMessage('Project uploaded.');
      }
      cancelEdit();
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-emerald-900">Projects Management</h3>
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
              <input value={form.titleEn} onChange={(e) => setField('titleEn', e.target.value)} placeholder="Title EN" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.titleRw} onChange={(e) => setField('titleRw', e.target.value)} placeholder="Title RW" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <input value={form.titleFr} onChange={(e) => setField('titleFr', e.target.value)} placeholder="Title FR" className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.goalEn} onChange={(e) => setField('goalEn', e.target.value)} placeholder="Goal EN" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.goalRw} onChange={(e) => setField('goalRw', e.target.value)} placeholder="Goal RW" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.goalFr} onChange={(e) => setField('goalFr', e.target.value)} placeholder="Goal FR" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.impactEn} onChange={(e) => setField('impactEn', e.target.value)} placeholder="Impact EN" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.impactRw} onChange={(e) => setField('impactRw', e.target.value)} placeholder="Impact RW" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.impactFr} onChange={(e) => setField('impactFr', e.target.value)} placeholder="Impact FR" rows={3} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <textarea value={form.activitiesEn} onChange={(e) => setField('activitiesEn', e.target.value)} placeholder="Activities EN" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.activitiesRw} onChange={(e) => setField('activitiesRw', e.target.value)} placeholder="Activities RW" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
              <textarea value={form.activitiesFr} onChange={(e) => setField('activitiesFr', e.target.value)} placeholder="Activities FR" rows={4} className="px-4 py-3 rounded-xl border border-emerald-900/10" />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setField('active', e.target.checked)} />
              Visible
            </label>

            <div className="flex gap-4">
              <button type="submit" disabled={saving} className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold">
                {saving ? 'Saving...' : editingId ? 'Update Project' : 'Upload Project'}
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
            <h4 className="text-xl font-bold text-emerald-900">Existing Projects</h4>
            {items.length === 0 ? (
              <p className="text-slate-500">No projects yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border border-emerald-900/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-emerald-900">{item.translations.en.title}</h5>
                    <p className="text-sm text-slate-600">Order: {item.displayOrder}</p>
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