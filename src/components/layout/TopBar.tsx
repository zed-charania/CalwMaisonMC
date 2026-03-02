'use client';

import { Search, Bell, Command, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

interface TopBarProps {
  pageTitle: string;
  onOpenSearch: () => void;
}

const themeOptions = [
  { value: 'light' as const, icon: Sun, label: 'Light' },
  { value: 'dark' as const, icon: Moon, label: 'Dark' },
  { value: 'system' as const, icon: Monitor, label: 'System' },
];

export default function TopBar({ pageTitle, onOpenSearch }: TopBarProps) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const idx = themeOptions.findIndex((o) => o.value === theme);
    const next = themeOptions[(idx + 1) % themeOptions.length];
    setTheme(next.value);
  };

  const currentThemeOption = themeOptions.find((o) => o.value === theme);
  const ThemeIcon = currentThemeOption?.icon ?? Moon;

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between border-b px-6"
      style={{
        height: 'var(--topbar-height)',
        background: 'linear-gradient(90deg, var(--glass-tint), var(--glass-bg-strong))',
        backdropFilter: 'blur(var(--glass-blur-strong)) saturate(var(--glass-saturation))',
        WebkitBackdropFilter: 'blur(var(--glass-blur-strong)) saturate(var(--glass-saturation))',
        borderColor: 'var(--glass-border)',
        boxShadow: 'var(--glass-inner-shadow)',
      }}
    >
      {/* Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-[17px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {pageTitle}
        </h1>
      </div>

      {/* Search bar */}
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-2.5 rounded-xl border px-3.5 py-[6px] transition-all hover:shadow-sm"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
          width: '320px',
        }}
      >
        <Search size={14} style={{ color: 'var(--text-quaternary)' }} />
        <span className="flex-1 text-left text-[13px]" style={{ color: 'var(--text-quaternary)' }}>
          Search anything...
        </span>
        <div
          className="flex items-center gap-0.5 rounded-md border px-1.5 py-0.5"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}
        >
          <Command size={10} style={{ color: 'var(--text-quaternary)' }} />
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-quaternary)' }}>K</span>
        </div>
      </button>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={cycleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover-surface-strong"
          title={`Theme: ${currentThemeOption?.label ?? 'Dark'}`}
        >
          <ThemeIcon size={17} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)' }} />
        </button>

        {/* Status indicator */}
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1.5"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        >
          <div className="pulse-dot h-2 w-2 rounded-full" style={{ background: 'var(--success)' }} />
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            Online
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg hover-surface-strong"
        >
          <Bell size={17} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)' }} />
          <div
            className="absolute right-1 top-1 h-2 w-2 rounded-full"
            style={{ background: 'var(--error)', border: '2px solid var(--bg-primary)' }}
          />
        </button>
      </div>
    </header>
  );
}
