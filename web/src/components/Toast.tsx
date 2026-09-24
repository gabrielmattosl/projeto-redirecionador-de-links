import { CheckCircle, WarningCircle } from '@phosphor-icons/react';

export interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-600 text-white text-sm font-semibold rounded shadow-lg animate-fade-in border border-gray-500">
      {isSuccess ? (
        <CheckCircle size={18} className="text-emerald-400" weight="bold" />
      ) : (
        <WarningCircle size={18} className="text-danger" weight="bold" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-white font-bold text-xs"
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  );
}
