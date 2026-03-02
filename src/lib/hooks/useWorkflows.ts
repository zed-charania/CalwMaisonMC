import useSWR from 'swr';
import type { Workflow } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export function useWorkflows() {
  const { data, error, isLoading, mutate } = useSWR('/api/workflows', fetcher, {
    refreshInterval: 10000,
  });
  return { workflows: data as Workflow[] | undefined, error, isLoading, mutate };
}
