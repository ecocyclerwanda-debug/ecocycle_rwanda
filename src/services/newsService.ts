import { ID, Permission, Query, Role } from 'appwrite';
import { databases, storage } from '../lib/appwrite';
import type { NewsCategory, NewsItem } from '../types';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_NEWS_COLLECTION_ID;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export type SaveNewsInput = {
  id?: string;
  category: NewsCategory;
  date: string;
  featured: boolean;
  active: boolean;
  imageUrl?: string;
  imageFile?: File | null;
  titleEn: string;
  titleRw: string;
  titleFr: string;
  summaryEn: string;
  summaryRw: string;
  summaryFr: string;
  contentEn: string;
  contentRw: string;
  contentFr: string;
};

function ensureConfig() {
  if (!databaseId || !collectionId || !bucketId) {
    throw new Error('Missing Appwrite news configuration.');
  }
}

function safeText(v: unknown) {
  return typeof v === 'string' ? v : '';
}

function mapDocument(doc: any): NewsItem {
  return {
    id: doc.$id,
    imageUrl: safeText(doc.imageUrl),
    category: doc.category as NewsCategory,
    date: safeText(doc.date),
    featured: Boolean(doc.featured),
    createdAt: safeText(doc.$createdAt),
    translations: {
      en: {
        title: safeText(doc.titleEn),
        summary: safeText(doc.summaryEn),
        content: safeText(doc.contentEn),
      },
      rw: {
        title: safeText(doc.titleRw),
        summary: safeText(doc.summaryRw),
        content: safeText(doc.contentRw),
      },
      fr: {
        title: safeText(doc.titleFr),
        summary: safeText(doc.summaryFr),
        content: safeText(doc.contentFr),
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

export async function createNews(input: SaveNewsInput) {
  ensureConfig();

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) {
    finalImageUrl = await uploadImage(input.imageFile);
  }

  if (!finalImageUrl) {
    throw new Error('Please provide a news image.');
  }

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      category: input.category,
      date: input.date,
      featured: input.featured,
      active: input.active,
      imageUrl: finalImageUrl,
      titleEn: input.titleEn.trim(),
      titleRw: input.titleRw.trim(),
      titleFr: input.titleFr.trim(),
      summaryEn: input.summaryEn.trim(),
      summaryRw: input.summaryRw.trim(),
      summaryFr: input.summaryFr.trim(),
      contentEn: input.contentEn.trim(),
      contentRw: input.contentRw.trim(),
      contentFr: input.contentFr.trim(),
    },
    [Permission.read(Role.any())]
  );

  return mapDocument(created);
}

export async function updateNews(input: SaveNewsInput) {
  ensureConfig();

  if (!input.id) throw new Error('Missing news id.');

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) {
    finalImageUrl = await uploadImage(input.imageFile);
  }

  if (!finalImageUrl) {
    throw new Error('Please provide a news image.');
  }

  const updated = await databases.updateDocument(
    databaseId,
    collectionId,
    input.id,
    {
      category: input.category,
      date: input.date,
      featured: input.featured,
      active: input.active,
      imageUrl: finalImageUrl,
      titleEn: input.titleEn.trim(),
      titleRw: input.titleRw.trim(),
      titleFr: input.titleFr.trim(),
      summaryEn: input.summaryEn.trim(),
      summaryRw: input.summaryRw.trim(),
      summaryFr: input.summaryFr.trim(),
      contentEn: input.contentEn.trim(),
      contentRw: input.contentRw.trim(),
      contentFr: input.contentFr.trim(),
    }
  );

  return mapDocument(updated);
}

export async function deleteNews(id: string) {
  ensureConfig();
  await databases.deleteDocument(databaseId, collectionId, id);
}

export async function listNews(includeInactive = true) {
  ensureConfig();

  const queries = [Query.orderDesc('date'), Query.limit(100)];
  if (!includeInactive) {
    queries.push(Query.equal('active', true));
  }

  const result = await databases.listDocuments(databaseId, collectionId, queries);
  return result.documents.map(mapDocument);
}

export function startNewsPolling(
  onData: (items: NewsItem[]) => void,
  onError?: (error: Error) => void,
  includeInactive = false,
  intervalMs = 15000
) {
  let active = true;

  const load = async () => {
    try {
      const items = await listNews(includeInactive);
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