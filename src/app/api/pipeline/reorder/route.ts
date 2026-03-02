import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as pipeline from '@/lib/db/pipeline';
import { mapPipelineItem } from '@/app/api/_mappers';

const ReorderSchema = z.object({
  itemId: z.string().min(1),
  newStage: z.string().min(1),
  newPosition: z.number().int().min(0),
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = ReorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { itemId, newStage, newPosition } = parsed.data;
    const item = pipeline.reorder(itemId, newStage, newPosition);
    if (!item) {
      return NextResponse.json({ error: 'Pipeline item not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapPipelineItem(item) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
