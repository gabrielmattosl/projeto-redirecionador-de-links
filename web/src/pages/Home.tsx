import { DownloadSimple } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full max-w-[1200px] px-4 py-6 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logotipo Redirecionador de Links" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="flex items-center gap-2">
            <DownloadSimple size={16} weight="bold" />
            <span>Exportar CSV</span>
          </Button>
        </div>
      </header>

      <main className="w-full max-w-[1200px] px-4 py-8 flex flex-col gap-6">
        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-bold text-gray-600 mb-4">Encurtar URL</h2>
          <p className="text-sm text-gray-400">
            Formulário de cadastro de link (fase de estrutura visual).
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-600">Meus Links</h2>
          <p className="text-sm text-gray-400">
            Listagem de links encurtados (fase de estrutura visual).
          </p>
        </section>
      </main>
    </div>
  );
}
