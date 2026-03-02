import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as schedule from '@/lib/db/schedule';
import { mapScheduledJob } from '@/app/api/_mappers';

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  cronExpression: z.string().nullable().optional(),
  isAlwaysRunning: z.boolean().optional(),
  color: z.string().optional(),
  nextRunAt: z.string().nullable().optional(),
  status: z.string().optional(),
  agentId: z.string().nullable().optional(),
  description: z.string().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = schedule.getById(id);
  if (!item) {
    return NextResponse.json({ error: 'Scheduled job not found' }, { status: 404 });
  }
  return NextResponse.json({ data: mapScheduledJob(item) });
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

    const { cronExpression, isAlwaysRunning, nextRunAt, agentId, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (cronExpression !== undefined) updateData.cron_expression = cronExpression;
    if (isAlwaysRunning !== undefined) updateData.is_always_running = isAlwaysRunning ? 1 : 0;
    if (nextRunAt !== undefined) updateData.next_run_at = nextRunAt;
    if (agentId !== undefined) updateData.agent_id = agentId;

    const item = schedule.update(id, updateData);
    if (!item) {
      return NextResponse.json({ error: 'Scheduled job not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapScheduledJob(item) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = schedule.remove(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Scheduled job not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { success: true } });
}
