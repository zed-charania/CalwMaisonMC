import useSWR from 'swr';
import type { JournalEntry } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export function useJournal() {
  const { data, error, isLoading, mutate } = useSWR('/api/journal', fetcher, {
    refreshInterval: 10000,
  });
  return { entries: data as JournalEntry[] | undefined, error, isLoading, mutate };
}

export function useJournalEntry(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/journal/${id}` : null,
    fetcher,
    { refreshInterval: 10000 },
  );
  return { entry: data as JournalEntry | undefined, error, isLoading, mutate };
}
