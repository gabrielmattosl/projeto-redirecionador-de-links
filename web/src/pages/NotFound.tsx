import { Link } from 'react-router-dom';
import { WarningCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg border border-gray-200 shadow-ambient max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
          <WarningCircle size={32} weight="bold" />
        </div>
        <h1 className="text-2xl font-bold text-gray-600">404</h1>
        <h2 className="text-base font-semibold text-gray-600">Link não encontrado ou expirado</h2>
        <p className="text-xs text-gray-400">
          O link que você está tentando acessar não existe mais ou foi digitado incorretamente.
        </p>
        <Link to="/" className="mt-2">
          <Button variant="primary">Voltar para o início</Button>
        </Link>
      </div>
    </div>
  );
}
