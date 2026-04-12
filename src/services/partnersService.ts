import { ID, Permission, Query, Role } from 'appwrite';
import { databases, storage } from '../lib/appwrite';
import type { PartnerItem } from '../types';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_PARTNERS_COLLECTION_ID;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export type SavePartnerInput = {
  id?: string;
  name: string;
  imageUrl?: string;
  imageFile?: File | null;
  websiteUrl: string;
  displayOrder: number;
  active: boolean;
  descriptionEn: string;
  descriptionRw: string;
  descriptionFr: string;
};

function ensureConfig() {
  if (!databaseId || !collectionId || !bucketId) {
    throw new Error('Missing Appwrite partners configuration.');
  }
}

function safeText(v: unknown) {
  return typeof v === 'string' ? v : '';
}

function safeNumber(v: unknown) {
  return typeof v === 'number' ? v : 0;
}

function mapDocument(doc: any): PartnerItem {
  return {
    id: doc.$id,
    name: safeText(doc.name),
    imageUrl: safeText(doc.imageUrl),
    websiteUrl: safeText(doc.websiteUrl),
    displayOrder: safeNumber(doc.displayOrder),
    active: Boolean(doc.active),
    translations: {
      en: { description: safeText(doc.descriptionEn) },
      rw: { description: safeText(doc.descriptionRw) },
      fr: { description: safeText(doc.descriptionFr) },
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

export async function createPartner(input: SavePartnerInput) {
  ensureConfig();

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a partner image.');

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      name: input.name.trim(),
      imageUrl: finalImageUrl,
      websiteUrl: input.websiteUrl.trim(),
      displayOrder: input.displayOrder,
      active: input.active,
      descriptionEn: input.descriptionEn.trim(),
      descriptionRw: input.descriptionRw.trim(),
      descriptionFr: input.descriptionFr.trim(),
    },
    [Permission.read(Role.any())]
  );

  return mapDocument(created);
}

export async function updatePartner(input: SavePartnerInput) {
  ensureConfig();
  if (!input.id) throw new Error('Missing partner id.');

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a partner image.');

  const updated = await databases.updateDocument(databaseId, collectionId, input.id, {
    name: input.name.trim(),
    imageUrl: finalImageUrl,
    websiteUrl: input.websiteUrl.trim(),
    displayOrder: input.displayOrder,
    active: input.active,
    descriptionEn: input.descriptionEn.trim(),
    descriptionRw: input.descriptionRw.trim(),
    descriptionFr: input.descriptionFr.trim(),
  });

  return mapDocument(updated);
}

export async function deletePartner(id: string) {
  ensureConfig();
  await databases.deleteDocument(databaseId, collectionId, id);
}

export async function listPartners(includeInactive = true) {
  ensureConfig();
  const queries = [Query.orderAsc('displayOrder'), Query.limit(100)];
  if (!includeInactive) queries.push(Query.equal('active', true));

  const result = await databases.listDocuments(databaseId, collectionId, queries);
  return result.documents.map(mapDocument);
}

export function startPartnersPolling(
  onData: (items: PartnerItem[]) => void,
  onError?: (error: Error) => void,
  includeInactive = false,
  intervalMs = 15000
) {
  let active = true;

  const load = async () => {
    try {
      const items = await listPartners(includeInactive);
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