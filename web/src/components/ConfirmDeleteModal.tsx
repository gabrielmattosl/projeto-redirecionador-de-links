import { WarningCircle, SpinnerGap } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Link } from '@/types/link';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  link: Link | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  link,
  onConfirm,
  onCancel,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full shadow-ambient flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
            <WarningCircle size={24} weight="bold" />
          </div>
          <h2 className="text-lg font-bold text-gray-600">Confirmar Exclusão</h2>
        </div>

        <p className="text-sm text-gray-400">
          Tem certeza de que deseja excluir definitivamente o link{' '}
          <span className="font-semibold text-blue-base">/{link.short_url}</span>? Esta ação não pode ser desfeita.
        </p>

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
            className="bg-danger hover:bg-red-700 border-none"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <SpinnerGap size={16} className="animate-spin text-white" />
                <span>Excluindo...</span>
              </div>
            ) : (
              'Confirmar Exclusão'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
