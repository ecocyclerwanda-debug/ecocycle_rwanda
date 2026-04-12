import { ID, Permission, Query, Role } from 'appwrite';
import { databases, storage } from '../lib/appwrite';
import type { LeaderItem } from '../types';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_LEADERS_COLLECTION_ID;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export type SaveLeaderInput = {
  id?: string;
  name: string;
  imageUrl?: string;
  imageFile?: File | null;
  displayOrder: number;
  active: boolean;
  roleEn: string;
  roleRw: string;
  roleFr: string;
  bioEn: string;
  bioRw: string;
  bioFr: string;
};

function ensureConfig() {
  if (!databaseId || !collectionId || !bucketId) {
    throw new Error('Missing Appwrite leaders configuration.');
  }
}

function safeText(v: unknown) {
  return typeof v === 'string' ? v : '';
}

function safeNumber(v: unknown) {
  return typeof v === 'number' ? v : 0;
}

function mapDocument(doc: any): LeaderItem {
  return {
    id: doc.$id,
    name: safeText(doc.name),
    imageUrl: safeText(doc.imageUrl),
    displayOrder: safeNumber(doc.displayOrder),
    active: Boolean(doc.active),
    translations: {
      en: { role: safeText(doc.roleEn), bio: safeText(doc.bioEn) },
      rw: { role: safeText(doc.roleRw), bio: safeText(doc.bioRw) },
      fr: { role: safeText(doc.roleFr), bio: safeText(doc.bioFr) },
    },
  };
}

async function uploadImage(file: File) {
  ensureConfig();
  const uploaded = await storage.createFile(
    bucketId,
    ID.unique(),
    file,
    [Permission.read(Role.any())]
  );
  return storage.getFileView(bucketId, uploaded.$id).toString();
}

export async function createLeader(input: SaveLeaderInput) {
  ensureConfig();

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a leader image.');

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      name: input.name.trim(),
      imageUrl: finalImageUrl,
      displayOrder: input.displayOrder,
      active: input.active,
      roleEn: input.roleEn.trim(),
      roleRw: input.roleRw.trim(),
      roleFr: input.roleFr.trim(),
      bioEn: input.bioEn.trim(),
      bioRw: input.bioRw.trim(),
      bioFr: input.bioFr.trim(),
    },
    [Permission.read(Role.any())]
  );

  return mapDocument(created);
}

export async function updateLeader(input: SaveLeaderInput) {
  ensureConfig();
  if (!input.id) throw new Error('Missing leader id.');

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a leader image.');

  const updated = await databases.updateDocument(databaseId, collectionId, input.id, {
    name: input.name.trim(),
    imageUrl: finalImageUrl,
    displayOrder: input.displayOrder,
    active: input.active,
    roleEn: input.roleEn.trim(),
    roleRw: input.roleRw.trim(),
    roleFr: input.roleFr.trim(),
    bioEn: input.bioEn.trim(),
    bioRw: input.bioRw.trim(),
    bioFr: input.bioFr.trim(),
  });

  return mapDocument(updated);
}

export async function deleteLeader(id: string) {
  ensureConfig();
  await databases.deleteDocument(databaseId, collectionId, id);
}

export async function listLeaders(includeInactive = true) {
  ensureConfig();
  const queries = [Query.orderAsc('displayOrder'), Query.limit(100)];
  if (!includeInactive) queries.push(Query.equal('active', true));

  const result = await databases.listDocuments(databaseId, collectionId, queries);
  return result.documents.map(mapDocument);
}

export function startLeadersPolling(
  onData: (items: LeaderItem[]) => void,
  onError?: (error: Error) => void,
  includeInactive = false,
  intervalMs = 15000
) {
  let active = true;

  const load = async () => {
    try {
      const items = await listLeaders(includeInactive);
      if (active) onData(items);
    } catch (error) {
      if (active && onError) onError(error as Error);
    }
  };

  load();
  const timer = window.setInterval(load, intervalMs);

  return () => {
    active = false;
    window.clearInterval(timer);
  };
}