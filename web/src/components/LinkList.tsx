import { SpinnerGap, DownloadSimple } from '@phosphor-icons/react';
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
  onExportCsv?: () => void;
  isExporting?: boolean;
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
  onExportCsv,
  isExporting = false,
}: LinkListProps) {
  return (
    <div className="bg-white p-6 rounded-xl flex flex-col w-full shadow-sm">
      {/* Cabeçalho do Card */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-600">Meus links</h2>
        {onExportCsv && (
          <Button
            variant="secondary"
            onClick={onExportCsv}
            disabled={isExporting || links.length === 0}
            isLoading={isExporting}
            className="flex items-center gap-2 h-8 px-3 text-xs"
          >
            {isExporting ? (
              <SpinnerGap size={14} className="animate-spin text-gray-600" />
            ) : (
              <DownloadSimple size={14} weight="bold" />
            )}
            <span>Baixar CSV</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <SpinnerGap size={32} className="animate-spin text-blue-base" />
          <span className="text-xs text-gray-400">Carregando seus links...</span>
        </div>
      ) : !links || links.length === 0 ? (
        <EmptyState />
      ) : (
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

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <span className="text-xs text-gray-400 font-normal">
              {links.length} {links.length === 1 ? 'link encurtado' : 'links encurtados'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
