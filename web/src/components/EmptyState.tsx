import { LinkSimple } from '@phosphor-icons/react';

export function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center gap-3 w-full my-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        <LinkSimple size={24} weight="bold" />
      </div>
      <h3 className="text-base font-semibold text-gray-600">Nenhum link cadastrado</h3>
      <p className="text-xs text-gray-400 max-w-sm">
        Você ainda não criou nenhum link encurtado. Utilize o formulário acima para cadastrar seu primeiro link.
      </p>
    </div>
  );
}
