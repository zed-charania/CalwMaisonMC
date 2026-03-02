import useSWR from 'swr';
import type { OngoingTask } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export function useOngoing() {
  const { data, error, isLoading, mutate } = useSWR('/api/ongoing', fetcher, {
    refreshInterval: 3000,
  });
  return { tasks: data as OngoingTask[] | undefined, error, isLoading, mutate };
}
