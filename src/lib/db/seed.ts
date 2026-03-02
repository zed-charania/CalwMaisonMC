import crypto from 'crypto';
import { getDb } from './index';

export function seed() {
  const db = getDb();

  // Check if already seeded
  const agentCount = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
  if (agentCount.count > 0) return;

  // ─── Agent IDs ───────────────────────────────────────────────────────
  const maestroId = crypto.randomUUID();
  const scoutId = crypto.randomUUID();
  const pixelId = crypto.randomUUID();
  const quillId = crypto.randomUUID();
  const echoId = crypto.randomUUID();
  const archivistId = crypto.randomUUID();

  // ─── Agents ──────────────────────────────────────────────────────────
  const insertAgent = db.prepare(`
    INSERT INTO agents (id, name, role, avatar_color, status, traits, input_signals, output_actions, parent_agent_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

  insertAgent.run(
    maestroId, 'Maestro', 'Orchestrator agent', '#FF9500', 'active',
    JSON.stringify(['strategic-planning', 'task-delegation', 'priority-management']),
    JSON.stringify(['user-commands', 'agent-status-updates', 'system-alerts']),
    JSON.stringify(['task-assignments', 'priority-changes', 'workflow-triggers']),
    null, daysAgo(30), now
  );

  insertAgent.run(
    scoutId, 'Scout', 'Research & intelligence agent', '#5AC8FA', 'active',
    JSON.stringify(['web-research', 'data-analysis', 'trend-detection']),
    JSON.stringify(['research-requests', 'topic-briefs', 'competitor-urls']),
    JSON.stringify(['research-reports', 'trend-summaries', 'competitive-analysis']),
    maestroId, daysAgo(28), now
  );

  insertAgent.run(
    pixelId, 'Pixel', 'Creative & design agent', '#AF52DE', 'idle',
    JSON.stringify(['thumbnail-design', 'visual-storytelling', 'brand-consistency']),
    JSON.stringify(['design-briefs', 'brand-guidelines', 'content-themes']),
    JSON.stringify(['thumbnails', 'social-graphics', 'visual-assets']),
    maestroId, daysAgo(28), now
  );

  insertAgent.run(
    quillId, 'Quill', 'Writing & content agent', '#34C759', 'active',
    JSON.stringify(['scriptwriting', 'copywriting', 'SEO-optimization']),
    JSON.stringify(['topic-outlines', 'research-data', 'audience-insights']),
    JSON.stringify(['video-scripts', 'descriptions', 'social-captions']),
    maestroId, daysAgo(27), now
  );

  insertAgent.run(
    echoId, 'Echo', 'Distribution & analytics agent', '#FF3B30', 'idle',
    JSON.stringify(['platform-optimization', 'analytics-tracking', 'A/B-testing']),
    JSON.stringify(['content-assets', 'performance-data', 'platform-apis']),
    JSON.stringify(['upload-schedules', 'performance-reports', 'optimization-suggestions']),
    maestroId, daysAgo(26), now
  );

  insertAgent.run(
    archivistId, 'Archivist', 'Knowledge & memory agent', '#5856D6', 'online',
    JSON.stringify(['knowledge-management', 'pattern-recognition', 'context-retrieval']),
    JSON.stringify(['agent-outputs', 'conversation-logs', 'external-data']),
    JSON.stringify(['knowledge-updates', 'context-summaries', 'historical-insights']),
    maestroId, daysAgo(25), now
  );

  // ─── Pipeline Items ──────────────────────────────────────────────────
  const insertPipeline = db.prepare(`
    INSERT INTO pipeline_items (id, title, stage, platform, owner_agent_id, position, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPipeline.run(crypto.randomUUID(), 'AI Tools Tier List 2026', 'ideas', 'youtube', quillId, 0, daysAgo(5), now);
  insertPipeline.run(crypto.randomUUID(), 'Day in the Life of an AI Agent', 'ideas', 'tiktok', scoutId, 1, daysAgo(4), now);
  insertPipeline.run(crypto.randomUUID(), 'How I Automated My Entire Business', 'scripting', 'youtube', quillId, 0, daysAgo(7), now);
  insertPipeline.run(crypto.randomUUID(), 'MCP Servers Explained in 5 Minutes', 'scripting', 'youtube', quillId, 1, daysAgo(6), now);
  insertPipeline.run(crypto.randomUUID(), 'Building a Second Brain with AI', 'thumbnail', 'youtube', pixelId, 0, daysAgo(10), now);
  insertPipeline.run(crypto.randomUUID(), 'Top 10 AI Mistakes Beginners Make', 'filming', 'youtube', maestroId, 0, daysAgo(12), now);
  insertPipeline.run(crypto.randomUUID(), 'AI Agent vs. Human: The Real Test', 'editing', 'youtube', pixelId, 0, daysAgo(14), now);
  insertPipeline.run(crypto.randomUUID(), 'Weekly AI News Roundup', 'editing', 'tiktok', echoId, 1, daysAgo(3), now);

  // ─── Scheduled Jobs ──────────────────────────────────────────────────
  const insertJob = db.prepare(`
    INSERT INTO scheduled_jobs (id, title, cron_expression, is_always_running, color, agent_id, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertJob.run(crypto.randomUUID(), 'Content Calendar Sync', '0 9 * * 1', 0, '#007AFF', maestroId, 'active', daysAgo(20), now);
  insertJob.run(crypto.randomUUID(), 'Competitor Analysis', '0 6 * * *', 0, '#5AC8FA', scoutId, 'active', daysAgo(20), now);
  insertJob.run(crypto.randomUUID(), 'Thumbnail Generation', '0 10 * * 2,4', 0, '#AF52DE', pixelId, 'active', daysAgo(18), now);
  insertJob.run(crypto.randomUUID(), 'SEO Optimization Pass', '30 14 * * 3', 0, '#34C759', quillId, 'active', daysAgo(15), now);
  insertJob.run(crypto.randomUUID(), 'Analytics Dashboard Update', null, 1, '#FF3B30', echoId, 'active', daysAgo(20), now);
  insertJob.run(crypto.randomUUID(), 'Knowledge Base Indexing', null, 1, '#5856D6', archivistId, 'active', daysAgo(20), now);

  // ─── Journal Entries & Sub-Entries ───────────────────────────────────
  const insertJournal = db.prepare(`
    INSERT INTO journal_entries (id, title, summary, content, tags, agent_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSubEntry = db.prepare(`
    INSERT INTO journal_sub_entries (id, journal_entry_id, content, entry_type, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Entry 1: Content Strategy Review
  const journal1Id = crypto.randomUUID();
  insertJournal.run(
    journal1Id, 'Content Strategy Review - Q1 2026',
    'Comprehensive review of Q1 content performance and strategy adjustments for Q2.',
    'Analyzed all content published in Q1 2026. Key findings include a 34% increase in engagement on AI tutorial content and a shift in audience preferences toward shorter-form explainers.',
    JSON.stringify(['strategy', 'quarterly-review']),
    maestroId, daysAgo(2), now
  );
  insertSubEntry.run(crypto.randomUUID(), journal1Id, 'Decided to pivot toward more tutorial-style content based on Q1 engagement data. Short-form content under 8 minutes consistently outperformed longer formats.', 'decision', daysAgo(2));
  insertSubEntry.run(crypto.randomUUID(), journal1Id, 'Action item: Restructure content calendar to include 2 short tutorials per week and 1 deep-dive per month.', 'action', daysAgo(2));

  // Entry 2: Competitor Channel Analysis
  const journal2Id = crypto.randomUUID();
  insertJournal.run(
    journal2Id, 'Competitor Channel Analysis',
    'Deep dive into top 5 competitor channels and their growth strategies.',
    'Conducted thorough analysis of competitor channels in the AI education space. Identified gaps in MCP and agent-related content that we can capitalize on.',
    JSON.stringify(['research', 'competitive-intel']),
    scoutId, daysAgo(5), now
  );
  insertSubEntry.run(crypto.randomUUID(), journal2Id, 'Observation: Competitor channels are heavily focused on ChatGPT tutorials while neglecting Claude and open-source agent frameworks. This represents an underserved niche.', 'observation', daysAgo(5));
  insertSubEntry.run(crypto.randomUUID(), journal2Id, 'Issue: Several competitor channels have started covering MCP servers in the last 2 weeks. We need to accelerate our MCP content pipeline to maintain first-mover advantage.', 'issue', daysAgo(4));
  insertSubEntry.run(crypto.randomUUID(), journal2Id, 'Note: Top performer in the space publishes 3x/week with a consistent thumbnail style. Their retention rates suggest strong hook-writing - worth studying their intro patterns.', 'note', daysAgo(4));

  // Entry 3: Thumbnail A/B Test Results
  const journal3Id = crypto.randomUUID();
  insertJournal.run(
    journal3Id, 'Thumbnail A/B Test Results',
    'Results from testing 3 thumbnail styles across 12 videos over 4 weeks.',
    'Completed a structured A/B test comparing minimalist, text-heavy, and face-forward thumbnail styles. Face-forward with minimal text overlays won by a significant margin.',
    JSON.stringify(['design', 'testing', 'thumbnails']),
    pixelId, daysAgo(3), now
  );
  insertSubEntry.run(crypto.randomUUID(), journal3Id, 'Decision: Adopt face-forward style with max 3 words of overlay text as the default thumbnail template going forward. CTR improved by 22% compared to text-heavy variants.', 'decision', daysAgo(3));
  insertSubEntry.run(crypto.randomUUID(), journal3Id, 'Observation: Warm color palettes (oranges, yellows) in thumbnails correlated with 15% higher CTR than cool tones. Consider this for future brand guidelines.', 'observation', daysAgo(3));

  // Entry 4: Script Optimization Learnings
  const journal4Id = crypto.randomUUID();
  insertJournal.run(
    journal4Id, 'Script Optimization Learnings',
    'Key insights from analyzing retention curves across 20 recent videos.',
    'Reviewed retention data and identified consistent patterns in drop-off points. Scripts with a strong pattern interrupt at the 30-second and 2-minute marks showed 40% better retention.',
    JSON.stringify(['writing', 'optimization']),
    quillId, daysAgo(1), now
  );
  insertSubEntry.run(crypto.randomUUID(), journal4Id, 'Note: The "promise-preview-proof" hook structure is outperforming the traditional "question" hook by 18% in average view duration. Implementing across all scripts going forward.', 'note', daysAgo(1));
  insertSubEntry.run(crypto.randomUUID(), journal4Id, 'Action item: Create a script template with built-in pattern interrupt markers at 30s, 2min, and 5min. Share with Maestro for integration into the content pipeline workflow.', 'action', daysAgo(1));

  // ─── Activity Events ─────────────────────────────────────────────────
  const insertActivity = db.prepare(`
    INSERT INTO activity_events (id, type, title, description, agent_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const hoursAgo = (n: number) => new Date(Date.now() - n * 3600000).toISOString();

  insertActivity.run(crypto.randomUUID(), 'browser', 'Researched MCP server documentation', 'Crawled 14 pages from modelcontextprotocol.io and extracted key integration patterns.', scoutId, hoursAgo(1));
  insertActivity.run(crypto.randomUUID(), 'message', 'Received script feedback from Maestro', 'Maestro requested revisions to the automation video intro - needs stronger hook.', quillId, hoursAgo(2));
  insertActivity.run(crypto.randomUUID(), 'workflow', 'Content Pipeline triggered', 'Daily content pipeline automation started on schedule at 9:00 AM PST.', maestroId, hoursAgo(3));
  insertActivity.run(crypto.randomUUID(), 'file', 'Generated 4 thumbnail variants', 'Created A/B test variants for "AI Tools Tier List" video using warm color palette.', pixelId, hoursAgo(4));
  insertActivity.run(crypto.randomUUID(), 'task', 'Completed SEO keyword analysis', 'Identified 23 high-volume, low-competition keywords for upcoming AI tutorial series.', quillId, hoursAgo(6));
  insertActivity.run(crypto.randomUUID(), 'integration', 'Synced with YouTube Analytics API', 'Pulled latest performance data for 12 published videos. 3 trending in AI category.', echoId, hoursAgo(8));
  insertActivity.run(crypto.randomUUID(), 'browser', 'Indexed 8 new research documents', 'Added latest AI agent papers and MCP documentation to the knowledge base.', archivistId, hoursAgo(10));
  insertActivity.run(crypto.randomUUID(), 'workflow', 'Research pipeline completed', '6-hour research cycle finished. 3 new trend reports generated and distributed to agents.', scoutId, hoursAgo(12));

  // ─── Ongoing Tasks ───────────────────────────────────────────────────
  const insertTask = db.prepare(`
    INSERT INTO ongoing_tasks (id, title, state, current_step, progress, agent_id, blockers, started_at, estimated_completion, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTask.run(
    crypto.randomUUID(), 'Generating thumbnail variants for AI Tools video',
    'executing', 'Rendering variant 3 of 4', 67, pixelId,
    JSON.stringify([]),
    hoursAgo(2), hoursAgo(-1), hoursAgo(2), now
  );

  insertTask.run(
    crypto.randomUUID(), 'Researching MCP server ecosystem',
    'thinking', 'Analyzing documentation structure', 23, scoutId,
    JSON.stringify([]),
    hoursAgo(1), hoursAgo(-3), hoursAgo(1), now
  );

  insertTask.run(
    crypto.randomUUID(), 'Writing intro hook for automation video',
    'waiting_input', 'Drafting hook variations', 45, quillId,
    JSON.stringify(['Needs brand voice clarification']),
    hoursAgo(4), null, hoursAgo(4), now
  );

  insertTask.run(
    crypto.randomUUID(), 'Indexing new research documents',
    'queued', 'Waiting in queue', 0, archivistId,
    JSON.stringify([]),
    now, hoursAgo(-2), now, now
  );

  // ─── Workflows ───────────────────────────────────────────────────────
  const insertWorkflow = db.prepare(`
    INSERT INTO workflows (id, name, description, trigger_type, steps, active, total_runs, success_rate, last_run, next_run, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertWorkflow.run(
    crypto.randomUUID(), 'Content Pipeline Automation',
    'End-to-end content creation pipeline from ideation to publishing.',
    'Daily at 9 AM', 5, 1, 47, 94.2,
    hoursAgo(3), hoursAgo(-21),
    daysAgo(30), now
  );

  insertWorkflow.run(
    crypto.randomUUID(), 'Research & Trend Detection',
    'Automated research cycle that monitors trends and generates reports.',
    'Every 6 hours', 3, 1, 128, 98.1,
    hoursAgo(6), hoursAgo(-6),
    daysAgo(28), now
  );

  insertWorkflow.run(
    crypto.randomUUID(), 'Distribution & Scheduling',
    'Handles content distribution across platforms and optimal scheduling.',
    'On content ready', 4, 1, 31, 87.5,
    hoursAgo(12), null,
    daysAgo(20), now
  );

  // ─── Settings ────────────────────────────────────────────────────────
  const insertSetting = db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
  `);

  insertSetting.run('agent_name', 'OpenClaw');
  insertSetting.run('default_model', 'Claude Opus 4');
  insertSetting.run('timezone', 'America/Los_Angeles');
}

export function ensureSeeded() {
  seed();
}
