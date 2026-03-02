import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as agents from '@/lib/db/agents';
import { mapAgent } from '@/app/api/_mappers';

const CreateSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional().default(''),
  avatarColor: z.string().optional().default('#007AFF'),
  status: z.enum(['online', 'idle', 'active', 'blocked', 'offline']).optional().default('offline'),
  traits: z.array(z.string()).optional().default([]),
  inputSignals: z.array(z.string()).optional().default([]),
  outputActions: z.array(z.string()).optional().default([]),
  parentAgentId: z.string().nullable().optional().default(null),
});

export async function GET() {
  try {
    const items = agents.list();
    return NextResponse.json({ data: items.map(mapAgent) });
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

    const { avatarColor, inputSignals, outputActions, parentAgentId, ...rest } = parsed.data;
    const agent = agents.create({
      ...rest,
      avatar_color: avatarColor,
      input_signals: inputSignals,
      output_actions: outputActions,
      parent_agent_id: parentAgentId ?? null,
    });
    return NextResponse.json({ data: mapAgent(agent) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
