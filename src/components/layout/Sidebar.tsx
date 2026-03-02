'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  emoji: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    label: 'Main',
    items: [
      { href: '/overview', label: 'Overview', emoji: '📊' },
      { href: '/pipeline', label: 'Pipeline', emoji: '🎬' },
      { href: '/schedule', label: 'Schedule', emoji: '📅' },
      { href: '/ongoing', label: 'Ongoing Tasks', emoji: '🔴' },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { href: '/journal', label: 'Journal', emoji: '📓' },
      { href: '/search', label: 'Search', emoji: '🔍' },
      { href: '/files', label: 'Files', emoji: '📁' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { href: '/workflows', label: 'Workflows', emoji: '⚡' },
      { href: '/activity', label: 'Activity', emoji: '📡' },
      { href: '/api-usage', label: 'API Usage', emoji: '💰' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/team', label: 'Team', emoji: '👥' },
      { href: '/integrations', label: 'Integrations', emoji: '🧩' },
      { href: '/settings', label: 'Settings', emoji: '⚙️' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r"
      style={{
        width: 'var(--sidebar-width)',
        background: 'linear-gradient(180deg, var(--glass-tint), var(--glass-bg-strong))',
        backdropFilter: 'blur(var(--glass-blur-strong)) saturate(var(--glass-saturation))',
        WebkitBackdropFilter: 'blur(var(--glass-blur-strong)) saturate(var(--glass-saturation))',
        borderColor: 'var(--glass-border)',
        boxShadow: 'var(--glass-inner-shadow)',
      }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'var(--text-primary)' }}
        >
          <span className="text-[16px] leading-none">⚡</span>
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            OpenClaw
          </div>
          <div className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
            Mission Control
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4" style={{ scrollbarWidth: 'none' }}>
        {sections.map((section, si) => (
          <div key={section.label} className={si > 0 ? 'mt-5' : 'mt-1'}>
            <div
              className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-quaternary)', letterSpacing: '0.08em' }}
            >
              {section.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left transition-colors"
                    style={{
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'var(--accent-light)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 shrink-0 text-[16px] leading-none">
                      {item.emoji}
                    </span>
                    <span
                      className="relative z-10 text-[13px] font-medium"
                      style={{
                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User / Instance */}
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <button className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 hover-surface">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            Z
          </div>
          <div className="flex-1 text-left">
            <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>Zed</div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-quaternary)' }} />
        </button>
      </div>
    </aside>
  );
}
