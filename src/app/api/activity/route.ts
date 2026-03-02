import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as activity from '@/lib/db/activity';
import { mapActivityEvent } from '@/app/api/_mappers';

const CreateSchema = z.object({
  type: z.enum([
    'browser', 'message', 'workflow', 'file', 'error',
    'task', 'memory', 'integration', 'pipeline', 'schedule', 'journal',
  ]),
  title: z.string().min(1),
  description: z.string().optional().default(''),
  agentId: z.string().nullable().optional().default(null),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') || 50), 200);
    const offset = Math.max(Number(searchParams.get('offset') || 0), 0);

    const events = activity.list(limit, offset);
    return NextResponse.json({ data: events.map(mapActivityEvent) });
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
    const event = activity.create({ ...rest, agent_id: agentId ?? null });
    return NextResponse.json({ data: mapActivityEvent(event) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
