import { useParams } from 'react-router-dom';
import { SpinnerGap } from '@phosphor-icons/react';

export function Redirect() {
  const { 'url-encurtada': shortUrl } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg border border-gray-200 shadow-ambient max-w-sm w-full text-center">
        <SpinnerGap size={40} className="animate-spin text-blue-base" />
        <h1 className="text-lg font-bold text-gray-600">Redirecionando...</h1>
        <p className="text-xs text-gray-400">
          Aguarde um momento enquanto preparamos seu destino para <span className="font-semibold text-blue-base">/{shortUrl}</span>.
        </p>
      </div>
    </div>
  );
}
