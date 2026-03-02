import useSWR from 'swr';
import type { ActivityEvent } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export function useActivity() {
  const { data, error, isLoading, mutate } = useSWR('/api/activity', fetcher, {
    refreshInterval: 5000,
  });
  return { events: data as ActivityEvent[] | undefined, error, isLoading, mutate };
}
