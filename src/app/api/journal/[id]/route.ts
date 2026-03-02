import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as journal from '@/lib/db/journal';
import { mapJournalEntryWithSubEntries, mapJournalEntry } from '@/app/api/_mappers';

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  agentId: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = journal.getById(id);
  if (!entry) {
    return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
  }
  return NextResponse.json({ data: mapJournalEntryWithSubEntries(entry) });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { agentId, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (agentId !== undefined) updateData.agent_id = agentId;

    const entry = journal.update(id, updateData);
    if (!entry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapJournalEntry(entry) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = journal.remove(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { success: true } });
}
