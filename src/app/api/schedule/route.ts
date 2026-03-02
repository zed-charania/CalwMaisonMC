import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as schedule from '@/lib/db/schedule';
import { mapScheduledJob } from '@/app/api/_mappers';

const CreateSchema = z.object({
  title: z.string().min(1),
  cronExpression: z.string().nullable().optional().default(null),
  isAlwaysRunning: z.boolean().optional().default(false),
  color: z.string().optional().default('#007AFF'),
  nextRunAt: z.string().nullable().optional().default(null),
  status: z.string().optional().default('active'),
  agentId: z.string().nullable().optional().default(null),
  description: z.string().optional().default(''),
});

export async function GET() {
  try {
    const items = schedule.list();
    return NextResponse.json({ data: items.map(mapScheduledJob) });
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

    const { cronExpression, isAlwaysRunning, nextRunAt, agentId, ...rest } = parsed.data;
    const item = schedule.create({
      ...rest,
      cron_expression: cronExpression,
      is_always_running: isAlwaysRunning ? 1 : 0,
      next_run_at: nextRunAt,
      agent_id: agentId ?? null,
    });
    return NextResponse.json({ data: mapScheduledJob(item) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
