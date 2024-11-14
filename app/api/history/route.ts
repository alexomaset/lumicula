// app/api/history/route.ts
import { db } from '@/app/db';
import { chat } from '@/app/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const history = await db.select().from(chat).orderBy(desc(chat.createdAt));
  return Response.json(history);
}

