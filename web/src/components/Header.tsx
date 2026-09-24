import { DownloadSimple, SpinnerGap } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';

export interface HeaderProps {
  onExportCsv: () => void;
  isExporting?: boolean;
}

export function Header({ onExportCsv, isExporting = false }: HeaderProps) {
  return (
    <header className="w-full max-w-[1200px] px-4 py-6 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Logotipo Redirecionador de Links"
          className="h-8 w-auto object-contain"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onExportCsv}
          disabled={isExporting}
          isLoading={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <SpinnerGap size={16} className="animate-spin text-gray-600" />
          ) : (
            <DownloadSimple size={16} weight="bold" />
          )}
          <span>Exportar CSV</span>
        </Button>
      </div>
    </header>
  );
}
