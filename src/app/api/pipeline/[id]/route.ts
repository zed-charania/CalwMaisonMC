import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as pipeline from '@/lib/db/pipeline';
import { mapPipelineItem } from '@/app/api/_mappers';

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  stage: z.enum(['ideas', 'scripting', 'thumbnail', 'filming', 'editing']).optional(),
  platform: z.enum(['youtube', 'tiktok', 'instagram', 'twitter', 'podcast']).optional(),
  ownerAgentId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  position: z.number().int().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = pipeline.getById(id);
  if (!item) {
    return NextResponse.json({ error: 'Pipeline item not found' }, { status: 404 });
  }
  return NextResponse.json({ data: mapPipelineItem(item) });
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

    const { ownerAgentId, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (ownerAgentId !== undefined) {
      updateData.owner_agent_id = ownerAgentId;
    }

    const item = pipeline.update(id, updateData);
    if (!item) {
      return NextResponse.json({ error: 'Pipeline item not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapPipelineItem(item) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = pipeline.remove(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Pipeline item not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { success: true } });
}
