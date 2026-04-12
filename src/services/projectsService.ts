import { ID, Permission, Query, Role } from 'appwrite';
import { databases, storage } from '../lib/appwrite';
import type { ProjectItem } from '../types';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID;
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export type SaveProjectInput = {
  id?: string;
  imageUrl?: string;
  imageFile?: File | null;
  displayOrder: number;
  active: boolean;
  titleEn: string;
  titleRw: string;
  titleFr: string;
  goalEn: string;
  goalRw: string;
  goalFr: string;
  impactEn: string;
  impactRw: string;
  impactFr: string;
  activitiesEn: string;
  activitiesRw: string;
  activitiesFr: string;
};

function ensureConfig() {
  if (!databaseId || !collectionId || !bucketId) {
    throw new Error('Missing Appwrite projects configuration.');
  }
}

function safeText(v: unknown) {
  return typeof v === 'string' ? v : '';
}

function safeNumber(v: unknown) {
  return typeof v === 'number' ? v : 0;
}

function mapDocument(doc: any): ProjectItem {
  return {
    id: doc.$id,
    imageUrl: safeText(doc.imageUrl),
    displayOrder: safeNumber(doc.displayOrder),
    active: Boolean(doc.active),
    translations: {
      en: {
        title: safeText(doc.titleEn),
        goal: safeText(doc.goalEn),
        impact: safeText(doc.impactEn),
        activities: safeText(doc.activitiesEn),
      },
      rw: {
        title: safeText(doc.titleRw),
        goal: safeText(doc.goalRw),
        impact: safeText(doc.impactRw),
        activities: safeText(doc.activitiesRw),
      },
      fr: {
        title: safeText(doc.titleFr),
        goal: safeText(doc.goalFr),
        impact: safeText(doc.impactFr),
        activities: safeText(doc.activitiesFr),
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

export async function createProject(input: SaveProjectInput) {
  ensureConfig();

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a project image.');

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      imageUrl: finalImageUrl,
      displayOrder: input.displayOrder,
      active: input.active,
      titleEn: input.titleEn.trim(),
      titleRw: input.titleRw.trim(),
      titleFr: input.titleFr.trim(),
      goalEn: input.goalEn.trim(),
      goalRw: input.goalRw.trim(),
      goalFr: input.goalFr.trim(),
      impactEn: input.impactEn.trim(),
      impactRw: input.impactRw.trim(),
      impactFr: input.impactFr.trim(),
      activitiesEn: input.activitiesEn.trim(),
      activitiesRw: input.activitiesRw.trim(),
      activitiesFr: input.activitiesFr.trim(),
    },
    [Permission.read(Role.any())]
  );

  return mapDocument(created);
}

export async function updateProject(input: SaveProjectInput) {
  ensureConfig();
  if (!input.id) throw new Error('Missing project id.');

  let finalImageUrl = input.imageUrl?.trim() ?? '';
  if (input.imageFile) finalImageUrl = await uploadImage(input.imageFile);
  if (!finalImageUrl) throw new Error('Please provide a project image.');

  const updated = await databases.updateDocument(databaseId, collectionId, input.id, {
    imageUrl: finalImageUrl,
    displayOrder: input.displayOrder,
    active: input.active,
    titleEn: input.titleEn.trim(),
    titleRw: input.titleRw.trim(),
    titleFr: input.titleFr.trim(),
    goalEn: input.goalEn.trim(),
    goalRw: input.goalRw.trim(),
    goalFr: input.goalFr.trim(),
    impactEn: input.impactEn.trim(),
    impactRw: input.impactRw.trim(),
    impactFr: input.impactFr.trim(),
    activitiesEn: input.activitiesEn.trim(),
    activitiesRw: input.activitiesRw.trim(),
    activitiesFr: input.activitiesFr.trim(),
  });

  return mapDocument(updated);
}

export async function deleteProject(id: string) {
  ensureConfig();
  await databases.deleteDocument(databaseId, collectionId, id);
}

export async function listProjects(includeInactive = true) {
  ensureConfig();
  const queries = [Query.orderAsc('displayOrder'), Query.limit(100)];
  if (!includeInactive) queries.push(Query.equal('active', true));

  const result = await databases.listDocuments(databaseId, collectionId, queries);
  return result.documents.map(mapDocument);
}

export function startProjectsPolling(
  onData: (items: ProjectItem[]) => void,
  onError?: (error: Error) => void,
  includeInactive = false,
  intervalMs = 15000
) {
  let active = true;

  const load = async () => {
    try {
      const items = await listProjects(includeInactive);
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