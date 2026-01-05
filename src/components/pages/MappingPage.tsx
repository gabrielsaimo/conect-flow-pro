import { Table, ArrowRight } from 'lucide-react';
import { Button, Select } from '../ui';
import { MAPPING_FIELDS, type ColumnMapping } from '../../types';

interface MappingPageProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (mapping: ColumnMapping) => void;
  onConfirm: () => void;
  onBack: () => void;
  isEditing?: boolean;
}

export function MappingPage({
  headers,
  mapping,
  onMappingChange,
  onConfirm,
  onBack,
  isEditing = false,
}: MappingPageProps) {
  const isValid = Boolean(mapping.phone1 && mapping.id);

  const headerOptions = headers.map((h) => ({ value: h, label: h }));

  const handleFieldChange = (key: keyof ColumnMapping, value: string) => {
    onMappingChange({ ...mapping, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-6 flex justify-center items-start">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg w-full max-w-4xl overflow-hidden animate-fade-in-up border dark:border-dark-border">
        {/* Header */}
        <div className="bg-brand-600 dark:bg-brand-800 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Mapeamento de Colunas</h2>
            <p className="text-brand-100 text-sm">
              {isEditing
                ? 'Editando mapeamento atual...'
                : 'Associe as colunas do seu arquivo aos campos do sistema.'}
            </p>
          </div>
          <Table size={24} />
        </div>

        {/* Fields Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAPPING_FIELDS.map((field) => (
              <Select
                key={field.key}
                label={field.label}
                required={field.required}
                value={mapping[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                options={headerOptions}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="pt-8 mt-6 border-t dark:border-dark-border flex justify-end gap-3">
            <Button variant="ghost" onClick={onBack}>
              {isEditing ? 'Cancelar' : 'Voltar'}
            </Button>
            <Button onClick={onConfirm} disabled={!isValid} size="lg">
              {isEditing ? 'Atualizar Lista' : 'Gerar Lista'}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
