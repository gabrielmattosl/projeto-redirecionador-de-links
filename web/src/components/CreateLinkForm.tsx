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
    .pipe(z.string().url('Informe uma URL válida.')),
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
      className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col gap-4 w-full shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="URL ORIGINAL"
          placeholder="https://exemplo.com"
          disabled={isLoading}
          error={errors.original_url?.message}
          {...register('original_url')}
        />

        <Input
          label="APELIDO PERSONALIZADO"
          placeholder="meu-link"
          disabled={isLoading}
          error={errors.short_url?.message || serverError || undefined}
          {...register('short_url')}
        />
      </div>

      <div className="flex justify-end mt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full md:w-auto min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <SpinnerGap size={16} className="animate-spin text-white" />
              <span>Salvando...</span>
            </div>
          ) : (
            'Salvar'
          )}
        </Button>
      </div>
    </form>
  );
}
