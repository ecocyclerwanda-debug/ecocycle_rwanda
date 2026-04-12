import { ID, Permission, Query, Role } from 'appwrite';
import { databases, storage } from '../lib/appwrite';
import type { ImpactStoryItem } from '../types';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_IMPACTS_COLLECTION_ID;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

type SaveImpactInput = {
  id?: string;
  name: string;
  roleEn: string;
  roleRw: string;
  roleFr: string;
  quoteEn: string;
  quoteRw: string;
  quoteFr: string;
  imageUrl?: string;
  videoUrl: string;
  displayOrder: number;
  active: boolean;
  imageFile?: File | null;
};

function ensureConfig() {
  if (!databaseId || !collectionId || !bucketId) {
    throw new Error('Missing Appwrite impacts configuration.');
  }
}

function safeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function safeNumber(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function mapDocument(doc: any): ImpactStoryItem {
  return {
    id: doc.$id,
    name: safeText(doc.name),
    imageUrl: safeText(doc.imageUrl),
    videoUrl: safeText(doc.videoUrl),
    displayOrder: safeNumber(doc.displayOrder),
    active: Boolean(doc.active),
    translations: {
      en: {
        role: safeText(doc.roleEn),
        quote: safeText(doc.quoteEn),
      },
      rw: {
        role: safeText(doc.roleRw),
        quote: safeText(doc.quoteRw),
      },
      fr: {
        role: safeText(doc.roleFr),
        quote: safeText(doc.quoteFr),
      },
    },
  };
}

async function uploadImage(file: File): Promise<string> {
  ensureConfig();

  const uploaded = await storage.createFile(
    bucketId,
    ID.unique(),
    file,
    [Permission.read(Role.any())]
  );

  return storage.getFileView(bucketId, uploaded.$id).toString();
}

export async function createImpactStory(input: SaveImpactInput): Promise<ImpactStoryItem> {
  ensureConfig();

  let finalImageUrl = input.imageUrl?.trim() ?? '';

  if (input.imageFile) {
    finalImageUrl = await uploadImage(input.imageFile);
  }

  if (!finalImageUrl) {
    throw new Error('Please provide an impact image.');
  }

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      name: input.name.trim(),
      roleEn: input.roleEn.trim(),
      roleRw: input.roleRw.trim(),
      roleFr: input.roleFr.trim(),
      quoteEn: input.quoteEn.trim(),
      quoteRw: input.quoteRw.trim(),
      quoteFr: input.quoteFr.trim(),
      imageUrl: finalImageUrl,
      videoUrl: input.videoUrl.trim(),
      displayOrder: input.displayOrder,
      active: input.active,
    },
    [Permission.read(Role.any())]
  );

  return mapDocument(created);
}

export async function updateImpactStory(input: SaveImpactInput): Promise<ImpactStoryItem> {
  ensureConfig();

  if (!input.id) {
    throw new Error('Missing impact story id.');
  }

  let finalImageUrl = input.imageUrl?.trim() ?? '';

  if (input.imageFile) {
    finalImageUrl = await uploadImage(input.imageFile);
  }

  if (!finalImageUrl) {
    throw new Error('Please provide an impact image.');
  }

  const updated = await databases.updateDocument(
    databaseId,
    collectionId,
    input.id,
    {
      name: input.name.trim(),
      roleEn: input.roleEn.trim(),
      roleRw: input.roleRw.trim(),
      roleFr: input.roleFr.trim(),
      quoteEn: input.quoteEn.trim(),
      quoteRw: input.quoteRw.trim(),
      quoteFr: input.quoteFr.trim(),
      imageUrl: finalImageUrl,
      videoUrl: input.videoUrl.trim(),
      displayOrder: input.displayOrder,
      active: input.active,
    }
  );

  return mapDocument(updated);
}

export async function deleteImpactStory(id: string): Promise<void> {
  ensureConfig();
  await databases.deleteDocument(databaseId, collectionId, id);
}

export async function listImpactStories(): Promise<ImpactStoryItem[]> {
  ensureConfig();

  const result = await databases.listDocuments(databaseId, collectionId, [
    Query.orderAsc('displayOrder'),
    Query.limit(100),
  ]);

  return result.documents.map(mapDocument);
}

export function startImpactStoriesPolling(
  onData: (items: ImpactStoryItem[]) => void,
  onError?: (error: Error) => void,
  intervalMs = 15000
) {
  let active = true;

  const load = async () => {
    try {
      const items = await listImpactStories();
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