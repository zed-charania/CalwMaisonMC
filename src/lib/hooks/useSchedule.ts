import useSWR from 'swr';
import type { ScheduledJob } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export function useSchedule() {
  const { data, error, isLoading, mutate } = useSWR('/api/schedule', fetcher, {
    refreshInterval: 5000,
  });
  return { jobs: data as ScheduledJob[] | undefined, error, isLoading, mutate };
}
