import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as workflows from '@/lib/db/workflows';
import { mapWorkflow } from '@/app/api/_mappers';

const CreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  triggerType: z.string().optional().default('manual'),
  steps: z.number().int().min(1).optional().default(1),
  active: z.boolean().optional().default(true),
  totalRuns: z.number().int().optional().default(0),
  successRate: z.number().min(0).max(100).optional().default(0),
  lastRun: z.string().nullable().optional().default(null),
  nextRun: z.string().nullable().optional().default(null),
});

export async function GET() {
  try {
    const items = workflows.list();
    return NextResponse.json({ data: items.map(mapWorkflow) });
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

    const { triggerType, totalRuns, successRate, lastRun, nextRun, active, ...rest } = parsed.data;
    const workflow = workflows.create({
      ...rest,
      trigger_type: triggerType,
      active: active ? 1 : 0,
      total_runs: totalRuns,
      success_rate: successRate,
      last_run: lastRun,
      next_run: nextRun,
    });
    return NextResponse.json({ data: mapWorkflow(workflow) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
