// Route constants
export const ROUTES = {
  overview: '/overview',
  pipeline: '/pipeline',
  schedule: '/schedule',
  ongoing: '/ongoing',
  journal: '/journal',
  search: '/search',
  files: '/files',
  workflows: '/workflows',
  activity: '/activity',
  'api-usage': '/api-usage',
  team: '/team',
  integrations: '/integrations',
  settings: '/settings',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

// Pipeline
export type PipelineStage = 'ideas' | 'scripting' | 'thumbnail' | 'filming' | 'editing';
export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'podcast';

export interface PipelineItem {
  id: string;
  title: string;
  description: string;
  stage: PipelineStage;
  platform: Platform;
  ownerAgentId?: string;
  ownerAgent?: Agent;
  position: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Schedule
export interface ScheduledJob {
  id: string;
  title: string;
  cronExpression?: string;
  isAlwaysRunning: boolean;
  color: string;
  nextRunAt?: string;
  status: string;
  agentId?: string;
  agent?: Agent;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Journal
export type SubEntryType = 'note' | 'decision' | 'issue' | 'action' | 'observation';

export interface JournalSubEntry {
  id: string;
  journalEntryId: string;
  content: string;
  entryType: SubEntryType;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  agentId?: string;
  agent?: Agent;
  subEntries?: JournalSubEntry[];
  subEntryCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Agents
export type AgentStatus = 'online' | 'idle' | 'active' | 'blocked' | 'offline';

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  status: AgentStatus;
  traits: string[];
  inputSignals: string[];
  outputActions: string[];
  parentAgentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Ongoing tasks
export type OngoingTaskState =
  | 'thinking'
  | 'waiting_input'
  | 'browser_running'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'queued';

export interface OngoingTask {
  id: string;
  title: string;
  state: OngoingTaskState;
  currentStep: string;
  progress: number;
  agentId?: string;
  agent?: Agent;
  blockers?: string[];
  startedAt: string;
  estimatedCompletion?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity
export type ActivityType =
  | 'browser'
  | 'message'
  | 'workflow'
  | 'file'
  | 'error'
  | 'task'
  | 'memory'
  | 'integration'
  | 'pipeline'
  | 'schedule'
  | 'journal';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  agentId?: string;
  agent?: Agent;
  timestamp: string;
}

// Workflows
export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: number;
  lastRun?: string;
  nextRun?: string;
  active: boolean;
  totalRuns: number;
  successRate: number;
}

// Retained types for existing pages
export type TaskStatus = 'inbox' | 'planned' | 'running' | 'waiting' | 'done';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskOwner = 'user' | 'claw' | 'shared';

export type IntegrationStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
  permissions: string[];
  category: string;
}

export interface UsageDataPoint {
  date: string;
  tokens: number;
  cost: number;
}

export interface ModelUsage {
  model: string;
  tokens: number;
  cost: number;
  percentage: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'image' | 'code' | 'pdf' | 'note';
  size: string;
  lastModified: string;
  source: 'generated' | 'uploaded' | 'indexed' | 'referenced';
  summary?: string;
}
