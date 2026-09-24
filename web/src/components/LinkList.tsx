import { SpinnerGap } from '@phosphor-icons/react';
import { LinkCard } from '@/components/LinkCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { Link } from '@/types/link';

export interface LinkListProps {
  links: Link[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
  onCopy: (fullUrl: string) => void;
  onDelete: (link: Link) => void;
  deletingShortUrl?: string | null;
}

export function LinkList({
  links,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onFetchNextPage,
  onCopy,
  onDelete,
  deletingShortUrl,
}: LinkListProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center gap-3">
        <SpinnerGap size={32} className="animate-spin text-blue-base" />
        <span className="text-xs text-gray-400">Carregando seus links...</span>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onCopy={onCopy}
          onDelete={onDelete}
          isDeleting={deletingShortUrl === link.short_url}
        />
      ))}

      {hasNextPage && onFetchNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            variant="secondary"
            onClick={onFetchNextPage}
            disabled={isFetchingNextPage}
            isLoading={isFetchingNextPage}
            className="flex items-center gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <SpinnerGap size={16} className="animate-spin text-gray-600" />
                <span>Carregando mais...</span>
              </>
            ) : (
              <span>Carregar mais links</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
