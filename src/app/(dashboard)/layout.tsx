'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import CommandPalette from '@/components/layout/CommandPalette';
import PageTransition from '@/components/layout/PageTransition';

const routeTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/pipeline': 'Content Pipeline',
  '/schedule': 'Scheduled Tasks',
  '/ongoing': 'Ongoing Tasks',
  '/journal': 'Journal',
  '/search': 'Search',
  '/files': 'Files & Knowledge',
  '/workflows': 'Workflows',
  '/activity': 'Activity',
  '/api-usage': 'API Usage',
  '/team': 'Team',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const pageTitle = routeTitles[pathname] || 'OpenClaw';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleCloseCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="flex flex-1 flex-col" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <TopBar
          pageTitle={pageTitle}
          onOpenSearch={() => setCommandPaletteOpen(true)}
        />

        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: '24px 32px 48px' }}
        >
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={handleCloseCommandPalette}
      />
    </div>
  );
}
