import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SpinnerGap } from '@phosphor-icons/react';
import { incrementLink } from '@/http/links';

export function Redirect() {
  const { 'url-encurtada': shortUrl } = useParams();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!shortUrl) {
      setIsError(true);
      return;
    }

    let isMounted = true;

    incrementLink(shortUrl)
      .then((data) => {
        if (isMounted && data?.original_url) {
          // Executa o redirecionamento imediato para a URL original
          window.location.href = data.original_url;
        } else if (isMounted) {
          setIsError(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [shortUrl]);

  if (isError) {
    navigate('/404', { replace: true });
    return null;
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
