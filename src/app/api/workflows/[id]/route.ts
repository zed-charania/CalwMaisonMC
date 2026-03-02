import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as workflows from '@/lib/db/workflows';
import { mapWorkflow } from '@/app/api/_mappers';

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  triggerType: z.string().optional(),
  steps: z.number().int().min(1).optional(),
  active: z.boolean().optional(),
  totalRuns: z.number().int().optional(),
  successRate: z.number().min(0).max(100).optional(),
  lastRun: z.string().nullable().optional(),
  nextRun: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const workflow = workflows.getById(id);
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }
  return NextResponse.json({ data: mapWorkflow(workflow) });
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

    const { triggerType, totalRuns, successRate, lastRun, nextRun, active, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (triggerType !== undefined) updateData.trigger_type = triggerType;
    if (active !== undefined) updateData.active = active ? 1 : 0;
    if (totalRuns !== undefined) updateData.total_runs = totalRuns;
    if (successRate !== undefined) updateData.success_rate = successRate;
    if (lastRun !== undefined) updateData.last_run = lastRun;
    if (nextRun !== undefined) updateData.next_run = nextRun;

    const workflow = workflows.update(id, updateData);
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapWorkflow(workflow) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = workflows.remove(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { success: true } });
}
