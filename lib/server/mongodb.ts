// lib/server/mongodb.ts
import { MongoClient, Db } from "mongodb";
// import { attachDatabasePool } from "@vercel/functions"; // ถ้าไม่ได้ใช้ ให้ลบ import นี้

const uri = process.env.MONGODB_URI ?? "";
const dbName = process.env.MONGODB_DB ?? "shodaiev";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

/**
 * Returns a connected MongoClient or null if no URI is provided.
 * Avoid throwing during build/prerender when env is not set.
 */
export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) {
    // Log a warning (ไม่ throw) — prerender/build จะปลอดภัย
    console.warn("MONGODB_URI is not set. Skipping MongoDB connection.");
    return null;
  }

  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}

/**
 * Returns a Db instance or null if MongoClient is not available.
 */
export async function getDb(): Promise<Db | null> {
  const cl = await getMongoClient();
  if (!cl) return null;
  return cl.db(dbName);
}
