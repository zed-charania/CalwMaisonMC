import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as journal from '@/lib/db/journal';
import { mapJournalSubEntry } from '@/app/api/_mappers';

const CreateSubEntrySchema = z.object({
  content: z.string().min(1),
  entryType: z.enum(['note', 'decision', 'issue', 'action', 'observation']),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = CreateSubEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { entryType, ...rest } = parsed.data;
    const subEntry = journal.addSubEntry(id, { ...rest, entry_type: entryType });
    if (!subEntry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapJournalSubEntry(subEntry) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
