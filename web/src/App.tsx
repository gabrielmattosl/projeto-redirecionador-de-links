import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="mb-6 flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold text-gray-600">Redirecionador de Links</h1>
      </header>
      <main className="bg-white p-6 rounded-lg border border-gray-200 max-w-md w-full text-center">
        <p className="text-sm text-gray-400">Estrutura base do frontend pronta (Fase 1).</p>
      </main>
    </div>
  );
}
