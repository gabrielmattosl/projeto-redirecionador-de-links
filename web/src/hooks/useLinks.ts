import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLinks, createLink, deleteLink, exportLinks } from '@/http/links';
import { CreateLinkPayload, GetLinksResponse } from '@/types/link';

export function useLinksInfiniteQuery(limit = 20) {
  return useInfiniteQuery<GetLinksResponse>({
    queryKey: ['links', limit],
    queryFn: ({ pageParam }) =>
      getLinks({ cursor: pageParam as string | undefined, limit }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
  });
}

export function useCreateLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLinkPayload) => createLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortUrl: string) => deleteLink(shortUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useExportCsvMutation() {
  return useMutation({
    mutationFn: () => exportLinks(),
  });
}
