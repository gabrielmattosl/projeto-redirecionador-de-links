import { LinkSimple } from '@phosphor-icons/react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 w-full py-20">
      <LinkSimple size={32} weight="bold" className="text-[#74798B]" />
      <h3 className="text-xs font-semibold text-[#74798B]">
        AINDA NÃO EXISTEM LINKS CADASTRADOS
      </h3>
    </div>
  );
}
