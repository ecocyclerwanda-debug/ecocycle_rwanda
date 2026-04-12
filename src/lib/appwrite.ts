import { Account, Client, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn('Missing Appwrite environment variables.');
}

export const client = new Client().setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function loginAdmin(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  try {
    await account.deleteSession('current');
  } catch {
    // ignore if there is no current session
  }

  await account.createEmailPasswordSession(email, password);
  return account.get();
}

export async function getCurrentAdmin() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function logoutAdmin() {
  try {
    await account.deleteSession('current');
  } catch {
    // ignore
  }
}