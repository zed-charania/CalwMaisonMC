import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as settings from '@/lib/db/settings';

const BulkUpdateSchema = z.record(z.string(), z.string());

export async function GET() {
  try {
    const data = settings.getAll();
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = BulkUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Expected an object with string keys and string values' }, { status: 400 });
    }

    settings.bulkSet(parsed.data);
    const data = settings.getAll();
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
