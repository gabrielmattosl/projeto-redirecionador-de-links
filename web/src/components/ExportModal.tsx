import { DownloadSimple, CheckCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { isSafeHttpUrl } from '@/utils/safeUrl';

export interface ExportModalProps {
  isOpen: boolean;
  exportData: { url: string; filename: string } | null;
  onClose: () => void;
}

export function ExportModal({ isOpen, exportData, onClose }: ExportModalProps) {
  if (!isOpen || !exportData) return null;

  const handleDownloadNow = () => {
    if (isSafeHttpUrl(exportData.url)) {
      window.open(exportData.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full shadow-ambient flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle size={24} weight="bold" />
          </div>
          <h2 className="text-lg font-bold text-gray-600">Relatório CSV Gerado</h2>
        </div>

        <p className="text-sm text-gray-400">
          O relatório contendo todos os seus links foi compilado e enviado para a nuvem com o arquivo{' '}
          <span className="font-semibold text-gray-600">{exportData.filename}</span>.
        </p>

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>

          <Button variant="primary" onClick={handleDownloadNow} className="flex items-center gap-2">
            <DownloadSimple size={16} weight="bold" />
            <span>Baixar Agora</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
