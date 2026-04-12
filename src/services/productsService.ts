import { ID, Permission, Query, Role } from 'appwrite';
import { databases, storage } from '../lib/appwrite';
import type { ProductItem } from '../types';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export type SaveProductInput = {
  id?: string;
  imageUrl?: string;
  imageFile?: File | null;
  displayOrder: number;
  active: boolean;
  nameEn: string;
  nameRw: string;
  nameFr: string;
  descriptionEn: string;
  descriptionRw: string;
  descriptionFr: string;
  categoryEn: string;
  categoryRw: string;
  categoryFr: string;
};

function ensureConfig() {
  if (!databaseId || !collectionId || !bucketId) {
    throw new Error('Missing Appwrite products configuration.');
  }
}

function safeText(v: unknown) {
  return typeof v === 'string' ? v : '';
}

function safeNumber(v: unknown) {
  return typeof v === 'number' ? v : 0;
}

function mapDocument(doc: any): ProductItem {
  return {
    id: doc.$id,
    imageUrl: safeText(doc.imageUrl),
    displayOrder: safeNumber(doc.displayOrder),
    active: Boolean(doc.active),
    translations: {
      en: {
        name: safeText(doc.nameEn),
        description: safeText(doc.descriptionEn),
        category: safeText(doc.categoryEn),
      },
      rw: {
        name: safeText(doc.nameRw),
        description: safeText(doc.descriptionRw),
        category: safeText(doc.categoryRw),
      },
      fr: {
        name: safeText(doc.nameFr),
        description: safeText(doc.descriptionFr),
        category: safeText(doc.categoryFr),
      },
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

export async function createProduct(input: SaveProductInput) {
  ensureConfig();

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a product image.');

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      imageUrl: finalImageUrl,
      displayOrder: input.displayOrder,
      active: input.active,
      nameEn: input.nameEn.trim(),
      nameRw: input.nameRw.trim(),
      nameFr: input.nameFr.trim(),
      descriptionEn: input.descriptionEn.trim(),
      descriptionRw: input.descriptionRw.trim(),
      descriptionFr: input.descriptionFr.trim(),
      categoryEn: input.categoryEn.trim(),
      categoryRw: input.categoryRw.trim(),
      categoryFr: input.categoryFr.trim(),
    },
    [Permission.read(Role.any())]
  );

  return mapDocument(created);
}

export async function updateProduct(input: SaveProductInput) {
  ensureConfig();
  if (!input.id) throw new Error('Missing product id.');

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a product image.');

  const updated = await databases.updateDocument(databaseId, collectionId, input.id, {
    imageUrl: finalImageUrl,
    displayOrder: input.displayOrder,
    active: input.active,
    nameEn: input.nameEn.trim(),
    nameRw: input.nameRw.trim(),
    nameFr: input.nameFr.trim(),
    descriptionEn: input.descriptionEn.trim(),
    descriptionRw: input.descriptionRw.trim(),
    descriptionFr: input.descriptionFr.trim(),
    categoryEn: input.categoryEn.trim(),
    categoryRw: input.categoryRw.trim(),
    categoryFr: input.categoryFr.trim(),
  });

  return mapDocument(updated);
}

export async function deleteProduct(id: string) {
  ensureConfig();
  await databases.deleteDocument(databaseId, collectionId, id);
}

export async function listProducts(includeInactive = true) {
  ensureConfig();
  const queries = [Query.orderAsc('displayOrder'), Query.limit(100)];
  if (!includeInactive) queries.push(Query.equal('active', true));

  const result = await databases.listDocuments(databaseId, collectionId, queries);
  return result.documents.map(mapDocument);
}

export function startProductsPolling(
  onData: (items: ProductItem[]) => void,
  onError?: (error: Error) => void,
  includeInactive = false,
  intervalMs = 15000
) {
  let active = true;

  const load = async () => {
    try {
      const items = await listProducts(includeInactive);
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