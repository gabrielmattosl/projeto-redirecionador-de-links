import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SpinnerGap } from '@phosphor-icons/react';
import { incrementLink } from '@/http/links';
import { NotFound } from '@/pages/NotFound';
import { isSafeHttpUrl } from '@/utils/safeUrl';

export function Redirect() {
  const { 'url-encurtada': shortUrl } = useParams();
  const [isError, setIsError] = useState(false);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (!shortUrl || shortUrl === '404') {
      setIsError(true);
      return;
    }

    // Previne execuções duplicadas causadas por React.StrictMode em modo de desenvolvimento
    if (hasRequestedRef.current) {
      return;
    }
    hasRequestedRef.current = true;

    incrementLink(shortUrl)
      .then((data) => {
        if (isSafeHttpUrl(data?.original_url)) {
          // Executa o redirecionamento imediato para a URL original (apenas http/https)
          window.location.href = data.original_url;
        } else {
          setIsError(true);
        }
      })
      .catch(() => {
        setIsError(true);
      });
  }, [shortUrl]);

  if (isError) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-lg border border-gray-200 shadow-ambient max-w-sm w-full text-center">
        <SpinnerGap size={40} className="animate-spin text-blue-base" />
        <h1 className="text-lg font-bold text-gray-600">Redirecionando...</h1>
        <p className="text-xs text-gray-400">
          Aguarde um momento enquanto preparamos seu destino para{' '}
          <span className="font-semibold text-blue-base">/{shortUrl}</span>.
        </p>
      </div>
    </div>
  );
}
