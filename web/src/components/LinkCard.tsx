import { Copy, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
    <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:border-gray-300 transition-colors">
      {/* Lado Esquerdo: Apelido em destaque (#2C46B1) + URL de destino secundária (#74798B) */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="font-semibold text-base text-blue-base truncate">
          /{link.short_url}
        </span>
        <a
          href={link.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 font-normal truncate hover:underline"
          title={link.original_url}
        >
          {link.original_url}
        </a>
      </div>

      {/* Lado Direito: Contador de cliques + Botões na ordem estrita [Copiar, Excluir] */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        <span className="text-xs text-gray-400 font-normal whitespace-nowrap">
          {formatClickCount(link.clicks)}
        </span>

        <div className="flex items-center gap-1">
          {/* 1. Botão de Cópia (Phosphor Copy) */}
          <Button
            variant="icon"
            onClick={handleCopyClick}
            title="Copiar link encurtado"
            aria-label="Copiar link encurtado"
          >
            <Copy size={18} />
          </Button>

          {/* 2. Botão de Exclusão (Phosphor Trash) */}
          <Button
            variant="icon"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title="Excluir link"
            aria-label="Excluir link"
          >
            <Trash size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
