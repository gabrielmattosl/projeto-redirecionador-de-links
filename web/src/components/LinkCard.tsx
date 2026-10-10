import { Copy, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Link } from '@/types/link';
import { formatClickCount, getFullShortUrl } from '@/utils/formatters';

export interface LinkCardProps {
  link: Link;
  onCopy: (fullUrl: string) => void;
  onDelete: (link: Link) => void;
  isDeleting?: boolean;
}

export function LinkCard({ link, onCopy, onDelete, isDeleting = false }: LinkCardProps) {
  const fullShortUrl = getFullShortUrl(link.short_url);

  const handleCopyClick = () => {
    onCopy(fullShortUrl);
  };

  const handleDeleteClick = () => {
    onDelete(link);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      {/* Lado Esquerdo: Apelido em destaque (#2C46B1) + URL de destino secundária (#74798B) */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="font-semibold text-[13px] text-blue-base truncate">
          brev.ly/{link.short_url}
        </span>
        <a
          href={link.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 font-normal truncate hover:underline"
          title={link.original_url}
        >
          {link.original_url.replace(/^https?:\/\//, '')}
        </a>
      </div>

      {/* Lado Direito: Contador de cliques + Botões na ordem estrita [Copiar, Excluir] */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className="text-[11px] text-gray-400 font-normal whitespace-nowrap mr-2">
          {formatClickCount(link.clicks)}
        </span>

        <div className="flex items-center gap-2">
          {/* 1. Botão de Cópia (Phosphor Copy) */}
          <Button
            variant="icon"
            onClick={handleCopyClick}
            title="Copiar link encurtado"
            aria-label="Copiar link encurtado"
            className="bg-gray-200/50 text-gray-500 rounded hover:bg-gray-200"
          >
            <Copy size={16} />
          </Button>

          {/* 2. Botão de Exclusão (Phosphor Trash) */}
          <Button
            variant="icon"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title="Excluir link"
            aria-label="Excluir link"
            className="bg-gray-200/50 text-gray-500 rounded hover:bg-gray-200"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
