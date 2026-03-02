import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as ongoing from '@/lib/db/ongoing';
import { mapOngoingTask } from '@/app/api/_mappers';

const CreateSchema = z.object({
  title: z.string().min(1),
  state: z.enum([
    'thinking', 'waiting_input', 'browser_running',
    'executing', 'completed', 'failed', 'queued',
  ]).optional().default('queued'),
  currentStep: z.string().optional().default(''),
  progress: z.number().min(0).max(100).optional().default(0),
  agentId: z.string().nullable().optional().default(null),
  blockers: z.array(z.string()).optional().default([]),
  startedAt: z.string().optional().default(new Date().toISOString()),
  estimatedCompletion: z.string().nullable().optional().default(null),
});

export async function GET() {
  try {
    const tasks = ongoing.list();
    return NextResponse.json({ data: tasks.map(mapOngoingTask) });
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

    const { currentStep, agentId, estimatedCompletion, startedAt, ...rest } = parsed.data;
    const task = ongoing.create({
      ...rest,
      current_step: currentStep,
      agent_id: agentId ?? null,
      started_at: startedAt,
      estimated_completion: estimatedCompletion,
    });
    return NextResponse.json({ data: mapOngoingTask(task) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
