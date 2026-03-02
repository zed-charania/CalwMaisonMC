import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as agents from '@/lib/db/agents';
import { mapAgent } from '@/app/api/_mappers';

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  avatarColor: z.string().optional(),
  status: z.enum(['online', 'idle', 'active', 'blocked', 'offline']).optional(),
  traits: z.array(z.string()).optional(),
  inputSignals: z.array(z.string()).optional(),
  outputActions: z.array(z.string()).optional(),
  parentAgentId: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const agent = agents.getById(id);
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }
  return NextResponse.json({ data: mapAgent(agent) });
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

    const { avatarColor, inputSignals, outputActions, parentAgentId, ...rest } = parsed.data;
    const updateData: Record<string, unknown> = { ...rest };
    if (avatarColor !== undefined) updateData.avatar_color = avatarColor;
    if (inputSignals !== undefined) updateData.input_signals = inputSignals;
    if (outputActions !== undefined) updateData.output_actions = outputActions;
    if (parentAgentId !== undefined) updateData.parent_agent_id = parentAgentId;

    const agent = agents.update(id, updateData);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json({ data: mapAgent(agent) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = agents.remove(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }
  return NextResponse.json({ data: { success: true } });
}
