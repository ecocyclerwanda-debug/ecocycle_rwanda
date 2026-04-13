import { ID, Permission, Query, Role } from 'appwrite';
import { databases, storage } from '../lib/appwrite';
import type { ServiceItem } from '../types';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export type SaveServiceInput = {
  id?: string;
  slug: string;
  imageUrl?: string;
  imageFile?: File | null;
  displayOrder: number;
  active: boolean;

  titleEn: string;
  titleRw: string;
  titleFr: string;

  subtitleEn: string;
  subtitleRw: string;
  subtitleFr: string;

  descriptionEn: string;
  descriptionRw: string;
  descriptionFr: string;

  featuresEn: string;
  featuresRw: string;
  featuresFr: string;

  outcomesEn: string;
  outcomesRw: string;
  outcomesFr: string;
};

function ensureConfig() {
  if (!databaseId || !collectionId || !bucketId) {
    throw new Error('Missing Appwrite services configuration.');
  }
}

function safeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function safeNumber(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function parseLines(value: unknown): string[] {
  return safeText(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapDocument(doc: any): ServiceItem {
  return {
    id: doc.$id,
    slug: safeText(doc.slug),
    imageUrl: safeText(doc.imageUrl),
    displayOrder: safeNumber(doc.displayOrder),
    active: Boolean(doc.active),
    translations: {
      en: {
        title: safeText(doc.titleEn),
        subtitle: safeText(doc.subtitleEn),
        description: safeText(doc.descriptionEn),
        features: parseLines(doc.featuresEn),
        outcomes: parseLines(doc.outcomesEn),
      },
      rw: {
        title: safeText(doc.titleRw),
        subtitle: safeText(doc.subtitleRw),
        description: safeText(doc.descriptionRw),
        features: parseLines(doc.featuresRw),
        outcomes: parseLines(doc.outcomesRw),
      },
      fr: {
        title: safeText(doc.titleFr),
        subtitle: safeText(doc.subtitleFr),
        description: safeText(doc.descriptionFr),
        features: parseLines(doc.featuresFr),
        outcomes: parseLines(doc.outcomesFr),
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

export async function createService(input: SaveServiceInput): Promise<ServiceItem> {
  ensureConfig();

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) {
    finalImageUrl = await uploadImage(input.imageFile);
  }

  if (!finalImageUrl) {
    throw new Error('Please provide a service image.');
  }

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      slug: input.slug.trim(),
      imageUrl: finalImageUrl,
      displayOrder: input.displayOrder,
      active: input.active,

      titleEn: input.titleEn.trim(),
      titleRw: input.titleRw.trim(),
      titleFr: input.titleFr.trim(),

      subtitleEn: input.subtitleEn.trim(),
      subtitleRw: input.subtitleRw.trim(),
      subtitleFr: input.subtitleFr.trim(),

      descriptionEn: input.descriptionEn.trim(),
      descriptionRw: input.descriptionRw.trim(),
      descriptionFr: input.descriptionFr.trim(),

      featuresEn: input.featuresEn.trim(),
      featuresRw: input.featuresRw.trim(),
      featuresFr: input.featuresFr.trim(),

      outcomesEn: input.outcomesEn.trim(),
      outcomesRw: input.outcomesRw.trim(),
      outcomesFr: input.outcomesFr.trim(),
    },
    [Permission.read(Role.any())]
  );

  return mapDocument(created);
}

export async function updateService(input: SaveServiceInput): Promise<ServiceItem> {
  ensureConfig();

  if (!input.id) {
    throw new Error('Missing service id.');
  }

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) {
    finalImageUrl = await uploadImage(input.imageFile);
  }

  if (!finalImageUrl) {
    throw new Error('Please provide a service image.');
  }

  const updated = await databases.updateDocument(
    databaseId,
    collectionId,
    input.id,
    {
      slug: input.slug.trim(),
      imageUrl: finalImageUrl,
      displayOrder: input.displayOrder,
      active: input.active,

      titleEn: input.titleEn.trim(),
      titleRw: input.titleRw.trim(),
      titleFr: input.titleFr.trim(),

      subtitleEn: input.subtitleEn.trim(),
      subtitleRw: input.subtitleRw.trim(),
      subtitleFr: input.subtitleFr.trim(),

      descriptionEn: input.descriptionEn.trim(),
      descriptionRw: input.descriptionRw.trim(),
      descriptionFr: input.descriptionFr.trim(),

      featuresEn: input.featuresEn.trim(),
      featuresRw: input.featuresRw.trim(),
      featuresFr: input.featuresFr.trim(),

      outcomesEn: input.outcomesEn.trim(),
      outcomesRw: input.outcomesRw.trim(),
      outcomesFr: input.outcomesFr.trim(),
    }
  );

  return mapDocument(updated);
}

export async function deleteService(id: string): Promise<void> {
  ensureConfig();
  await databases.deleteDocument(databaseId, collectionId, id);
}

export async function listServices(includeInactive = true): Promise<ServiceItem[]> {
  ensureConfig();

  const queries = [Query.orderAsc('displayOrder'), Query.limit(100)];
  if (!includeInactive) {
    queries.push(Query.equal('active', true));
  }

  const result = await databases.listDocuments(databaseId, collectionId, queries);
  return result.documents.map(mapDocument);
}

export function startServicesPolling(
  onData: (items: ServiceItem[]) => void,
  onError?: (error: Error) => void,
  includeInactive = false,
  intervalMs = 15000
) {
  let active = true;

  const load = async () => {
    try {
      const items = await listServices(includeInactive);
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