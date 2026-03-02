import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as journal from '@/lib/db/journal';
import { mapJournalEntryWithCount, mapJournalEntry } from '@/app/api/_mappers';

const CreateSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional().default(''),
  content: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  agentId: z.string().nullable().optional().default(null),
});

export async function GET() {
  try {
    const entries = journal.list();
    return NextResponse.json({ data: entries.map(mapJournalEntryWithCount) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { agentId, ...rest } = parsed.data;
    const entry = journal.create({ ...rest, agent_id: agentId ?? null });
    return NextResponse.json({ data: mapJournalEntry(entry) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
