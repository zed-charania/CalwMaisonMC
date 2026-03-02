'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FileText, Table2, Image, Code2, FileType, StickyNote,
  Grid3X3, List, ArrowUpDown, Sparkles, Upload, Link2, Database,
  ChevronDown,
} from 'lucide-react';
import Card from '@/components/shared/Card';
import type { FileItem } from '@/lib/types';

// Static for now - will be replaced with API when files table is added
const files: FileItem[] = [];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const fileTypeIcons: Record<FileItem['type'], React.ElementType> = {
  document: FileText,
  spreadsheet: Table2,
  image: Image,
  code: Code2,
  pdf: FileType,
  note: StickyNote,
};

const fileTypeColors: Record<FileItem['type'], { color: string; bg: string }> = {
  document: { color: 'var(--accent)', bg: 'var(--accent-light)' },
  spreadsheet: { color: 'var(--success)', bg: 'var(--success-light)' },
  image: { color: 'var(--orange)', bg: 'var(--orange-light)' },
  code: { color: 'var(--purple)', bg: 'var(--purple-light)' },
  pdf: { color: 'var(--error)', bg: 'var(--error-light)' },
  note: { color: 'var(--teal)', bg: 'var(--teal-light)' },
};

const sourceConfig: Record<FileItem['source'], { color: string; bg: string; icon: React.ElementType }> = {
  generated: { color: 'var(--purple)', bg: 'var(--purple-light)', icon: Sparkles },
  uploaded: { color: 'var(--accent)', bg: 'var(--accent-light)', icon: Upload },
  indexed: { color: 'var(--success)', bg: 'var(--success-light)', icon: Database },
  referenced: { color: 'var(--text-tertiary)', bg: 'var(--neutral-subtle)', icon: Link2 },
};

const filterOptions = ['All', 'Generated', 'Uploaded', 'Indexed', 'Referenced'] as const;
const sortOptions = ['Name', 'Date', 'Size', 'Type'] as const;

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('Date');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredFiles = useMemo(() => {
    let result = [...files];

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) => f.name.toLowerCase().includes(q) || f.summary?.toLowerCase().includes(q)
      );
    }

    // Filter by source
    if (activeFilter !== 'All') {
      result = result.filter((f) => f.source === activeFilter.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'Name':
          return a.name.localeCompare(b.name);
        case 'Type':
          return a.type.localeCompare(b.type);
        case 'Size':
          return parseSize(b.size) - parseSize(a.size);
        case 'Date':
        default:
          return 0; // Keep original order (most recent first in mock data)
      }
    });

    return result;
  }, [searchQuery, activeFilter, sortBy]);

  const generatedCount = files.filter((f) => f.source === 'generated').length;
  const totalSize = files.reduce((acc, f) => acc + parseSize(f.size), 0);

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <h1 className="text-title">Files</h1>
        <p className="text-caption mt-1">Documents, exports, and indexed content.</p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="mt-5 flex items-center gap-6"
      >
        <div>
          <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {files.length}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Total files</div>
        </div>
        <div className="h-8 w-px" style={{ background: 'var(--divider)' }} />
        <div>
          <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {formatSize(totalSize)}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Total size</div>
        </div>
        <div className="h-8 w-px" style={{ background: 'var(--divider)' }} />
        <div>
          <div className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--purple)' }}>
            {generatedCount}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Generated</div>
        </div>
      </motion.div>

      {/* Search + Controls */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="mt-5 flex items-center gap-3"
      >
        {/* Search Bar */}
        <div
          className="flex flex-1 items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
          }}
        >
          <Search size={15} style={{ color: 'var(--text-quaternary)' }} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--text-quaternary)]"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[12px] font-medium transition-all"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowUpDown size={13} />
            {sortBy}
            <ChevronDown size={12} />
          </button>
          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-10 mt-1.5 overflow-hidden rounded-xl"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 140,
                }}
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                    className="flex w-full items-center px-3.5 py-2.5 text-[12px] font-medium transition-colors"
                    style={{
                      color: sortBy === opt ? 'var(--accent)' : 'var(--text-secondary)',
                      background: sortBy === opt ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Toggle */}
        <div
          className="flex items-center overflow-hidden rounded-xl"
          style={{ border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setViewMode('grid')}
            className="flex items-center justify-center px-3 py-2.5 transition-all"
            style={{
              background: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: viewMode === 'grid' ? 'var(--bg-secondary)' : 'var(--text-tertiary)',
            }}
          >
            <Grid3X3 size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center justify-center px-3 py-2.5 transition-all"
            style={{
              background: viewMode === 'list' ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: viewMode === 'list' ? 'var(--bg-secondary)' : 'var(--text-tertiary)',
            }}
          >
            <List size={14} />
          </button>
        </div>
      </motion.div>

      {/* Filter Chips */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="mt-4 flex items-center gap-2"
      >
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all"
            style={{
              background: activeFilter === filter ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: activeFilter === filter ? 'var(--bg-secondary)' : 'var(--text-secondary)',
              border: `1px solid ${activeFilter === filter ? 'var(--text-primary)' : 'var(--border)'}`,
            }}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {/* File List / Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeFilter}-${viewMode}-${sortBy}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-5"
        >
          {viewMode === 'grid' ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
            >
              {filteredFiles.map((file) => (
                <FileGridCard key={file.id} file={file} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <Card padding="sm">
                {/* List Header */}
                <div
                  className="flex items-center gap-4 px-4 py-2.5"
                  style={{ borderBottom: '1px solid var(--divider)' }}
                >
                  <span className="flex-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Name
                  </span>
                  <span className="w-20 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Type
                  </span>
                  <span className="w-20 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Size
                  </span>
                  <span className="w-24 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Source
                  </span>
                  <span className="w-24 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Modified
                  </span>
                </div>
                {filteredFiles.map((file, i) => (
                  <FileListRow key={file.id} file={file} isLast={i === filteredFiles.length - 1} />
                ))}
              </Card>
            </motion.div>
          )}

          {filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-[32px] leading-none">📁</span>
              <div className="mt-3 text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {files.length === 0 ? 'No files yet' : 'No files found'}
              </div>
              <div className="mt-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                {files.length === 0 ? 'Documents, exports, and indexed content will appear here.' : 'Try adjusting your search or filter.'}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FileGridCard({ file }: { file: FileItem }) {
  const Icon = fileTypeIcons[file.type];
  const colors = fileTypeColors[file.type];
  const source = sourceConfig[file.source];
  const SourceIcon = source.icon;

  return (
    <motion.div variants={item}>
      <Card padding="lg" hoverable>
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: colors.bg }}
          >
            <Icon size={18} style={{ color: colors.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {file.name}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className="rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize"
                style={{ background: colors.bg, color: colors.color }}
              >
                {file.type}
              </span>
              <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-quaternary)' }}>
                {file.size}
              </span>
            </div>
          </div>
        </div>

        {/* Source Badge + Modified */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium capitalize"
            style={{ background: source.bg, color: source.color }}
          >
            <SourceIcon size={10} />
            {file.source}
          </span>
          <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-quaternary)' }}>
            {file.lastModified}
          </span>
        </div>

        {/* Summary */}
        {file.summary && (
          <div
            className="mt-3 rounded-lg px-3 py-2.5"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div className="line-clamp-2 text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {file.summary}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function FileListRow({ file, isLast }: { file: FileItem; isLast: boolean }) {
  const Icon = fileTypeIcons[file.type];
  const colors = fileTypeColors[file.type];
  const source = sourceConfig[file.source];
  const SourceIcon = source.icon;

  return (
    <motion.div variants={item}>
      <div
        className="flex items-center gap-4 px-4 py-3 transition-colors hover-surface"
        style={{ borderBottom: isLast ? 'none' : '1px solid var(--divider)' }}
      >
        {/* Name */}
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: colors.bg }}
          >
            <Icon size={15} style={{ color: colors.color }} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
              {file.name}
            </div>
            {file.summary && (
              <div className="truncate text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {file.summary}
              </div>
            )}
          </div>
        </div>

        {/* Type */}
        <div className="w-20">
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize"
            style={{ background: colors.bg, color: colors.color }}
          >
            {file.type}
          </span>
        </div>

        {/* Size */}
        <div className="w-20 text-right text-[12px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
          {file.size}
        </div>

        {/* Source */}
        <div className="w-24">
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium capitalize"
            style={{ background: source.bg, color: source.color }}
          >
            <SourceIcon size={10} />
            {file.source}
          </span>
        </div>

        {/* Modified */}
        <div className="w-24 text-right text-[11px] tabular-nums" style={{ color: 'var(--text-quaternary)' }}>
          {file.lastModified}
        </div>
      </div>
    </motion.div>
  );
}

function parseSize(size: string): number {
  const num = parseFloat(size);
  if (size.includes('MB')) return num * 1024;
  if (size.includes('KB')) return num;
  return num;
}

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb.toFixed(0)} KB`;
}
