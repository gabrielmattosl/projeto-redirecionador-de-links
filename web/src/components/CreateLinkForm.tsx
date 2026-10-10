import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SpinnerGap } from '@phosphor-icons/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeUrl } from '@/utils/formatters';

const createLinkSchema = z.object({
  original_url: z
    .string()
    .min(1, 'A URL original é obrigatória.')
    .transform((val) => normalizeUrl(val))
    .pipe(
      z.string()
        .url('Informe uma URL válida.')
        .refine((val) => {
          try {
            const urlObj = new URL(val);
            return urlObj.hostname === 'localhost' || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(urlObj.hostname);
          } catch {
            return false;
          }
        }, { message: 'Informe uma URL válida com um domínio correto.' })
    ),
  short_url: z
    .string()
    .min(3, 'O apelido deve ter no mínimo 3 caracteres.')
    .max(50, 'O apelido deve ter no máximo 50 caracteres.')
    .regex(/^[a-zA-Z0-9-]+$/, 'O apelido deve conter apenas letras, números e hífens.'),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

export interface CreateLinkFormProps {
  onSubmit: (data: CreateLinkFormData) => Promise<void>;
  isLoading?: boolean;
  serverError?: string | null;
}

export function CreateLinkForm({ onSubmit, isLoading = false, serverError }: CreateLinkFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      original_url: '',
      short_url: '',
    },
  });

  const handleFormSubmit = async (data: CreateLinkFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (err: any) {
      if (err?.status === 409 || err?.message?.includes('apelido')) {
        setError('short_url', {
          type: 'manual',
          message: 'Este apelido já está em uso.',
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white p-6 rounded-xl flex flex-col gap-5 w-full shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-600 mb-1">Novo link</h2>

      <div className="flex flex-col gap-4">
        <Input
          label="LINK ORIGINAL"
          placeholder="www.exemplo.com.br"
          disabled={isLoading}
          error={errors.original_url?.message}
          {...register('original_url')}
        />

        <Input
          label="LINK ENCURTADO"
          placeholder="brev.ly/"
          disabled={isLoading}
          error={errors.short_url?.message || serverError || undefined}
          {...register('short_url')}
        />
      </div>

      <div className="mt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full h-10 rounded-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <SpinnerGap size={16} className="animate-spin text-white" />
              <span>Salvando...</span>
            </div>
          ) : (
            'Salvar link'
          )}
        </Button>
      </div>
    </form>
  );
}
