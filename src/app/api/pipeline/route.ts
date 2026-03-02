import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as pipeline from '@/lib/db/pipeline';
import { mapPipelineItem } from '@/app/api/_mappers';

const CreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  stage: z.enum(['ideas', 'scripting', 'thumbnail', 'filming', 'editing']).optional().default('ideas'),
  platform: z.enum(['youtube', 'tiktok', 'instagram', 'twitter', 'podcast']).optional().default('youtube'),
  ownerAgentId: z.string().nullable().optional().default(null),
  tags: z.array(z.string()).optional().default([]),
  position: z.number().int().optional().default(0),
});

export async function GET() {
  try {
    const items = pipeline.list();
    return NextResponse.json({ data: items.map(mapPipelineItem) });
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

    const { ownerAgentId, ...rest } = parsed.data;
    const item = pipeline.create({ ...rest, owner_agent_id: ownerAgentId ?? null });
    return NextResponse.json({ data: mapPipelineItem(item) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
