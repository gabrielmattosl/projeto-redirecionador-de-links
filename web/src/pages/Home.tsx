import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CreateLinkForm, CreateLinkFormData } from '@/components/CreateLinkForm';
import { LinkList } from '@/components/LinkList';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { ExportModal } from '@/components/ExportModal';
import { Toast } from '@/components/Toast';
import {
  useLinksInfiniteQuery,
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useExportCsvMutation,
} from '@/hooks/useLinks';
import { Link } from '@/types/link';

export function Home() {
  // Estados para Modais e Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [targetLinkToDelete, setTargetLinkToDelete] = useState<Link | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exportData, setExportData] = useState<{ url: string; filename: string } | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [createServerError, setCreateServerError] = useState<string | null>(null);

  // React Query Hooks
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLinksInfiniteQuery();

  const createMutation = useCreateLinkMutation();
  const deleteMutation = useDeleteLinkMutation();
  const exportMutation = useExportCsvMutation();

  // Achata a lista de links obtida por paginas no useInfiniteQuery
  const links = useMemo(() => {
    return data?.pages.flatMap((page) => page.links) ?? [];
  }, [data]);

  // Exibir Toast temporário
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handler de Criação de Link
  const handleCreateLink = async (formData: CreateLinkFormData) => {
    setCreateServerError(null);
    try {
      await createMutation.mutateAsync({
        original_url: formData.original_url,
        short_url: formData.short_url,
      });
      showToast('Link criado com sucesso!');
    } catch (err: any) {
      if (err?.status === 409) {
        setCreateServerError('Este apelido já está em uso.');
        throw err;
      }
      const msg = err?.message || 'Falha ao criar link.';
      showToast(msg, 'error');
      throw err;
    }
  };

  // Handler de Cópia Rápida de Link para Clipboard
  const handleCopyLink = async (fullUrl: string) => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast('Copiado');
    } catch {
      showToast('Falha ao copiar link.', 'error');
    }
  };

  // Handler de Abertura da Modal de Exclusão
  const handleOpenDeleteModal = (link: Link) => {
    setTargetLinkToDelete(link);
    setIsDeleteModalOpen(true);
  };

  // Handler de Confirmação de Exclusão Física
  const handleConfirmDelete = async () => {
    if (!targetLinkToDelete) return;
    try {
      await deleteMutation.mutateAsync(targetLinkToDelete.short_url);
      setIsDeleteModalOpen(false);
      setTargetLinkToDelete(null);
      showToast('Link excluído com sucesso!');
    } catch (err: any) {
      showToast(err?.message || 'Falha ao excluir link.', 'error');
    }
  };

  // Handler de Exportação de CSV
  const handleExportCsv = async () => {
    try {
      const result = await exportMutation.mutateAsync();
      setExportData(result);
      setIsExportModalOpen(true);
    } catch (err: any) {
      showToast(err?.message || 'Falha ao gerar e exportar relatório CSV.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col items-center pb-12">
      {/* Header com Logo */}
      <Header />

      <main className="w-full max-w-[1200px] px-4 py-8 flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Seção 1: Formulário de Cadastro de Link */}
        <section className="w-full lg:w-[400px] shrink-0">
          <CreateLinkForm
            onSubmit={handleCreateLink}
            isLoading={createMutation.isPending}
            serverError={createServerError}
          />
        </section>

        {/* Seção 2: Listagem de Links */}
        <section className="flex-1 w-full min-w-0">
          <LinkList
            links={links}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onFetchNextPage={fetchNextPage}
            onCopy={handleCopyLink}
            onDelete={handleOpenDeleteModal}
            deletingShortUrl={deleteMutation.isPending ? targetLinkToDelete?.short_url : null}
            onExportCsv={handleExportCsv}
            isExporting={exportMutation.isPending}
          />
        </section>
      </main>

      {/* Modais e Feedback */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        link={targetLinkToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTargetLinkToDelete(null);
        }}
        isDeleting={deleteMutation.isPending}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        exportData={exportData}
        onClose={() => setIsExportModalOpen(false)}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
