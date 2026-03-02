import useSWR from 'swr';
import type { Agent } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export function useAgents() {
  const { data, error, isLoading, mutate } = useSWR('/api/agents', fetcher, {
    refreshInterval: 10000,
  });
  return { agents: data as Agent[] | undefined, error, isLoading, mutate };
}
