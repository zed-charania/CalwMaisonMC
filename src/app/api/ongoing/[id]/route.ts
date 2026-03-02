import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as ongoing from '@/lib/db/ongoing';
import { mapOngoingTask } from '@/app/api/_mappers';

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  state: z.enum([
    'thinking', 'waiting_input', 'browser_running',
    'executing', 'completed', 'failed', 'queued',
  ]).optional(),
  currentStep: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  agentId: z.string().nullable().optional(),
  blockers: z.array(z.string()).optional(),
  startedAt: z.string().optional(),
  estimatedCompletion: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const task = ongoing.getById(id);
  if (!task) {
    return NextResponse.json({ error: 'Ongoing task not found' }, { status: 404 });
  }
  return NextResponse.json({ data: mapOngoingTask(task) });
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

    const { currentStep, agentId, estimatedCompletion, startedAt, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (currentStep !== undefined) updateData.current_step = currentStep;
    if (agentId !== undefined) updateData.agent_id = agentId;
    if (startedAt !== undefined) updateData.started_at = startedAt;
    if (estimatedCompletion !== undefined) updateData.estimated_completion = estimatedCompletion;

    const task = ongoing.update(id, updateData);
    if (!task) {
      return NextResponse.json({ error: 'Ongoing task not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapOngoingTask(task) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = ongoing.remove(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Ongoing task not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { success: true } });
}
