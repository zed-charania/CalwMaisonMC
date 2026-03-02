import useSWR from 'swr';
import type { PipelineItem } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export function usePipeline() {
  const { data, error, isLoading, mutate } = useSWR('/api/pipeline', fetcher, {
    refreshInterval: 5000,
  });
  return { items: data as PipelineItem[] | undefined, error, isLoading, mutate };
}
