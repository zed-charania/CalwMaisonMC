'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Sun, Moon, Monitor,
} from 'lucide-react';
import { useTheme } from '@/lib/useTheme';
import type { Theme } from '@/lib/useTheme';

const categories = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'models', label: 'Models', icon: '🤖' },
  { id: 'permissions', label: 'Permissions', icon: '🔒' },
  { id: 'browser', label: 'Browser', icon: '🌐' },
  { id: 'memory', label: 'Memory', icon: '🧠' },
  { id: 'automations', label: 'Automations', icon: '⚡' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'instances', label: 'Instances', icon: '🖥️' },
] as const;

type CategoryId = (typeof categories)[number]['id'];

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex h-[26px] w-[46px] shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors"
      style={{
        background: enabled ? 'var(--success)' : 'var(--text-quaternary)',
      }}
    >
      <motion.div
        className="h-[22px] w-[22px] rounded-full"
        style={{
          background: 'var(--text-on-accent)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.06)',
        }}
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    </button>
  );
}

interface SettingRowProps {
  label: string;
  description: string;
  control: React.ReactNode;
  isLast?: boolean;
}

function SettingRow({ label, description, control, isLast = false }: SettingRowProps) {
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--divider)' }}
    >
      <div className="flex-1 pr-4">
        <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </div>
        <div className="mt-0.5 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
          {description}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function SettingInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="rounded-lg px-3 py-2 text-[13px] outline-none transition-all"
      style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        width: 200,
      }}
    />
  );
}

function SettingSelect({ options, defaultValue }: { options: string[]; defaultValue: string }) {
  return (
    <div
      className="relative rounded-lg"
      style={{ width: 200 }}
    >
      <select
        defaultValue={defaultValue}
        className="w-full appearance-none rounded-lg px-3 py-2 pr-8 text-[13px] outline-none transition-all"
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronRight
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90"
        style={{ color: 'var(--text-tertiary)' }}
      />
    </div>
  );
}

// -- Category Content Components --

function GeneralSettings() {
  const [agentActive, setAgentActive] = useState(true);

  return (
    <div>
      <SectionHeader title="General" subtitle="Core agent configuration and preferences." />
      <SettingsCard>
        <SettingRow
          label="Agent Name"
          description="Display name used across the dashboard and notifications."
          control={<SettingInput defaultValue="OpenClaw" />}
        />
        <SettingRow
          label="Status"
          description="When disabled, the agent pauses all background tasks and automations."
          control={<ToggleSwitch enabled={agentActive} onToggle={() => setAgentActive(!agentActive)} />}
        />
        <SettingRow
          label="Default Model"
          description="The primary model used for reasoning and task execution."
          control={
            <SettingSelect
              options={['Claude Opus 4', 'Claude Sonnet 4', 'Claude Haiku 3.5', 'GPT-4o']}
              defaultValue="Claude Opus 4"
            />
          }
        />
        <SettingRow
          label="Timezone"
          description="Used for scheduling, calendar sync, and timestamp display."
          control={
            <SettingSelect
              options={['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'UTC']}
              defaultValue="America/Los_Angeles"
            />
          }
          isLast
        />
      </SettingsCard>
    </div>
  );
}

function ModelsSettings() {
  const [models, setModels] = useState([
    { name: 'Claude Opus 4', provider: 'Anthropic', description: 'Most capable model for complex reasoning and multi-step tasks.', enabled: true },
    { name: 'Claude Sonnet 4', provider: 'Anthropic', description: 'Balanced performance and speed for general-purpose tasks.', enabled: true },
    { name: 'Claude Haiku 3.5', provider: 'Anthropic', description: 'Fast and lightweight for quick classifications and summaries.', enabled: true },
    { name: 'GPT-4o', provider: 'OpenAI', description: 'Multimodal model with vision capabilities.', enabled: false },
    { name: 'Gemini 2.5 Pro', provider: 'Google', description: 'Long context window for processing large documents.', enabled: false },
  ]);

  const toggleModel = (index: number) => {
    setModels((prev) =>
      prev.map((m, i) => (i === index ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <div>
      <SectionHeader title="Models" subtitle="Enable or disable models available for task execution." />
      <SettingsCard>
        {models.map((model, i) => (
          <div
            key={model.name}
            className="flex items-center justify-between py-4"
            style={{ borderBottom: i === models.length - 1 ? 'none' : '1px solid var(--divider)' }}
          >
            <div className="flex items-center gap-3 flex-1 pr-4">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-bold"
                style={{
                  background: model.enabled ? 'var(--accent-light)' : 'var(--neutral-subtle)',
                  color: model.enabled ? 'var(--accent)' : 'var(--text-quaternary)',
                }}
              >
                {model.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                    {model.name}
                  </span>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}
                  >
                    {model.provider}
                  </span>
                </div>
                <div className="mt-0.5 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                  {model.description}
                </div>
              </div>
            </div>
            <ToggleSwitch enabled={model.enabled} onToggle={() => toggleModel(i)} />
          </div>
        ))}
      </SettingsCard>
    </div>
  );
}

function PermissionsSettings() {
  const [permissions, setPermissions] = useState({
    sendEmails: true,
    browseWeb: true,
    modifyFiles: true,
    accessCalendar: true,
    executeTasks: true,
    requireApproval: false,
  });

  const toggle = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <SectionHeader title="Permissions" subtitle="Control what the agent can do autonomously." />
      <SettingsCard>
        <SettingRow
          label="Send Emails"
          description="Allow the agent to send emails on your behalf."
          control={<ToggleSwitch enabled={permissions.sendEmails} onToggle={() => toggle('sendEmails')} />}
        />
        <SettingRow
          label="Browse Web"
          description="Allow the agent to navigate and interact with websites."
          control={<ToggleSwitch enabled={permissions.browseWeb} onToggle={() => toggle('browseWeb')} />}
        />
        <SettingRow
          label="Modify Files"
          description="Allow creating, editing, and deleting files in connected storage."
          control={<ToggleSwitch enabled={permissions.modifyFiles} onToggle={() => toggle('modifyFiles')} />}
        />
        <SettingRow
          label="Access Calendar"
          description="Allow reading and modifying calendar events."
          control={<ToggleSwitch enabled={permissions.accessCalendar} onToggle={() => toggle('accessCalendar')} />}
        />
        <SettingRow
          label="Execute Autonomous Tasks"
          description="Allow running multi-step tasks without manual confirmation."
          control={<ToggleSwitch enabled={permissions.executeTasks} onToggle={() => toggle('executeTasks')} />}
        />
        <SettingRow
          label="Require Approval for All Actions"
          description="Pause before every external action and wait for your confirmation."
          control={<ToggleSwitch enabled={permissions.requireApproval} onToggle={() => toggle('requireApproval')} />}
          isLast
        />
      </SettingsCard>
    </div>
  );
}

function BrowserSettings() {
  const [headless, setHeadless] = useState(true);
  const [screenshots, setScreenshots] = useState(true);

  return (
    <div>
      <SectionHeader title="Browser" subtitle="Configure the built-in browser automation engine." />
      <SettingsCard>
        <SettingRow
          label="Headless Mode"
          description="Run the browser without a visible window for faster execution."
          control={<ToggleSwitch enabled={headless} onToggle={() => setHeadless(!headless)} />}
        />
        <SettingRow
          label="Capture Screenshots"
          description="Save screenshots at each browser step for debugging and review."
          control={<ToggleSwitch enabled={screenshots} onToggle={() => setScreenshots(!screenshots)} />}
        />
        <SettingRow
          label="Default Timeout"
          description="Maximum time to wait for page loads and element interactions."
          control={
            <SettingSelect
              options={['15 seconds', '30 seconds', '60 seconds', '120 seconds']}
              defaultValue="30 seconds"
            />
          }
        />
        <SettingRow
          label="User Agent"
          description="The browser identity string sent with each request."
          control={<SettingInput defaultValue="OpenClaw/1.0" />}
          isLast
        />
      </SettingsCard>
    </div>
  );
}

function MemorySettings() {
  const [autoCapture, setAutoCapture] = useState(true);
  const [entityExtraction, setEntityExtraction] = useState(true);

  return (
    <div>
      <SectionHeader title="Memory" subtitle="How the agent stores and recalls information." />
      <SettingsCard>
        <SettingRow
          label="Auto-Capture"
          description="Automatically extract and store important facts from conversations and tasks."
          control={<ToggleSwitch enabled={autoCapture} onToggle={() => setAutoCapture(!autoCapture)} />}
        />
        <SettingRow
          label="Entity Extraction"
          description="Identify people, companies, and concepts and build a knowledge graph."
          control={<ToggleSwitch enabled={entityExtraction} onToggle={() => setEntityExtraction(!entityExtraction)} />}
        />
        <SettingRow
          label="Retention Period"
          description="How long to keep memories before archiving or expiring them."
          control={
            <SettingSelect
              options={['30 days', '90 days', '1 year', 'Forever']}
              defaultValue="Forever"
            />
          }
        />
        <SettingRow
          label="Confidence Threshold"
          description="Minimum confidence score required to store a new memory."
          control={
            <SettingSelect
              options={['0.70 (Low)', '0.80 (Medium)', '0.90 (High)', '0.95 (Very High)']}
              defaultValue="0.80 (Medium)"
            />
          }
          isLast
        />
      </SettingsCard>
    </div>
  );
}

function AutomationsSettings() {
  const [scheduledRuns, setScheduledRuns] = useState(true);
  const [triggerRuns, setTriggerRuns] = useState(true);
  const [retryOnFail, setRetryOnFail] = useState(true);

  return (
    <div>
      <SectionHeader title="Automations" subtitle="Workflow execution and scheduling preferences." />
      <SettingsCard>
        <SettingRow
          label="Scheduled Runs"
          description="Allow workflows to run on their configured schedules (daily, weekly, etc.)."
          control={<ToggleSwitch enabled={scheduledRuns} onToggle={() => setScheduledRuns(!scheduledRuns)} />}
        />
        <SettingRow
          label="Trigger-Based Runs"
          description="Allow workflows to execute automatically when their trigger conditions are met."
          control={<ToggleSwitch enabled={triggerRuns} onToggle={() => setTriggerRuns(!triggerRuns)} />}
        />
        <SettingRow
          label="Retry on Failure"
          description="Automatically retry failed workflow steps up to the configured limit."
          control={<ToggleSwitch enabled={retryOnFail} onToggle={() => setRetryOnFail(!retryOnFail)} />}
        />
        <SettingRow
          label="Max Retries"
          description="Number of times to retry a failed step before marking the workflow as failed."
          control={
            <SettingSelect
              options={['1', '2', '3', '5']}
              defaultValue="3"
            />
          }
          isLast
        />
      </SettingsCard>
    </div>
  );
}

function NotificationsSettings() {
  const [taskComplete, setTaskComplete] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div>
      <SectionHeader title="Notifications" subtitle="Control when and how you are notified." />
      <SettingsCard>
        <SettingRow
          label="Task Completion"
          description="Notify when the agent finishes a task or needs your input."
          control={<ToggleSwitch enabled={taskComplete} onToggle={() => setTaskComplete(!taskComplete)} />}
        />
        <SettingRow
          label="Error Alerts"
          description="Notify immediately when an error or blocker is encountered."
          control={<ToggleSwitch enabled={errorAlerts} onToggle={() => setErrorAlerts(!errorAlerts)} />}
        />
        <SettingRow
          label="Daily Digest"
          description="Receive a summary notification at the end of each day."
          control={<ToggleSwitch enabled={dailyDigest} onToggle={() => setDailyDigest(!dailyDigest)} />}
        />
        <SettingRow
          label="Notification Sound"
          description="Play an audible alert when a notification arrives."
          control={<ToggleSwitch enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />}
        />
        <SettingRow
          label="Quiet Hours"
          description="Suppress all notifications during these hours."
          control={
            <SettingSelect
              options={['Disabled', '9pm - 8am', '10pm - 7am', '11pm - 7am']}
              defaultValue="9pm - 8am"
            />
          }
          isLast
        />
      </SettingsCard>
    </div>
  );
}

function InstancesSettings() {
  const [concurrentTasks, setConcurrentTasks] = useState(true);

  return (
    <div>
      <SectionHeader title="Instances" subtitle="Manage agent instances and resource allocation." />
      <SettingsCard>
        <SettingRow
          label="Concurrent Tasks"
          description="Allow multiple tasks to run in parallel on separate agent instances."
          control={<ToggleSwitch enabled={concurrentTasks} onToggle={() => setConcurrentTasks(!concurrentTasks)} />}
        />
        <SettingRow
          label="Max Concurrent Instances"
          description="Maximum number of agent instances that can run simultaneously."
          control={
            <SettingSelect
              options={['1', '2', '3', '5', '10']}
              defaultValue="3"
            />
          }
        />
        <SettingRow
          label="Instance Timeout"
          description="How long an idle instance stays alive before being shut down."
          control={
            <SettingSelect
              options={['5 minutes', '15 minutes', '30 minutes', '1 hour']}
              defaultValue="15 minutes"
            />
          }
        />
        <SettingRow
          label="Region"
          description="Primary compute region for agent instances."
          control={
            <SettingSelect
              options={['US West (Oregon)', 'US East (Virginia)', 'EU West (Ireland)', 'Asia Pacific (Tokyo)']}
              defaultValue="US West (Oregon)"
            />
          }
          isLast
        />
      </SettingsCard>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ];

  return (
    <div>
      <SectionHeader title="Appearance" subtitle="Customize the look and feel of Mission Control." />
      <SettingsCard>
        <SettingRow
          label="Theme"
          description="Choose between light and dark mode, or follow your system preference."
          control={
            <div
              className="flex items-center gap-1 rounded-xl p-1"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              {options.map((opt) => {
                const isActive = theme === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
                    style={{
                      background: isActive ? 'var(--bg-secondary)' : 'transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <Icon size={13} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          }
          isLast
        />
      </SettingsCard>
    </div>
  );
}

// -- Shared Layout Helpers --

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-heading">{title}</h2>
      <p className="text-caption mt-1">{subtitle}</p>
    </div>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl px-5"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  );
}

// -- Category Content Map --

const categoryContent: Record<CategoryId, React.ComponentType> = {
  general: GeneralSettings,
  appearance: AppearanceSettings,
  models: ModelsSettings,
  permissions: PermissionsSettings,
  browser: BrowserSettings,
  memory: MemorySettings,
  automations: AutomationsSettings,
  notifications: NotificationsSettings,
  instances: InstancesSettings,
};

// -- Main Settings Page --

export default function SettingsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('general');
  const ContentComponent = categoryContent[selectedCategory];

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <h1 className="text-title">Settings</h1>
        <p className="text-caption mt-1">Configure your agent, models, and preferences.</p>
      </motion.div>

      {/* Settings Layout: Sidebar + Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="mt-6 flex gap-6"
        style={{ minHeight: 520 }}
      >
        {/* Sidebar */}
        <div
          className="shrink-0 rounded-2xl py-2"
          style={{
            width: 220,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            alignSelf: 'flex-start',
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all"
                style={{
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  borderRadius: 0,
                }}
              >
                <span className="text-[16px] leading-none">{cat.icon}</span>
                <span className="text-[13px] font-medium">
                  {cat.label}
                </span>
                {isActive && (
                  <ChevronRight
                    size={13}
                    className="ml-auto"
                    style={{ color: 'var(--accent)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
              <ContentComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
