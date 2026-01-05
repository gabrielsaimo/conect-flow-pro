// Contact Flow Pro - Type Definitions

export interface Contact {
  internalId: number;
  id: string | number;
  name: string;
  phones: string[];
  email: string;
  address: string;
  birthDate: string;
  bonus1?: string;
  bonus2?: string;
  bonus3?: string;
  bonus4?: string;
  bonus5?: string;
  contacted: boolean;
  lastContactedAt: string | null;
}

export interface ColumnMapping {
  id: string;
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  phone4: string;
  email: string;
  address: string;
  birthDate: string;
  bonus1: string;
  bonus2: string;
  bonus3: string;
  bonus4: string;
  bonus5: string;
}

export interface MappingField {
  key: keyof ColumnMapping;
  label: string;
  required?: boolean;
}

export type AppStep = 'upload' | 'mapping' | 'dashboard';

export type FilterType = 'all' | 'pending' | 'contacted';

export interface ContactStats {
  total: number;
  contacted: number;
  pending: number;
}

export interface StoredData {
  contacts: Contact[];
  template: string;
}

export const MAPPING_FIELDS: MappingField[] = [
  { key: 'id', label: 'ID (Obrigatório)', required: true },
  { key: 'name', label: 'Nome' },
  { key: 'address', label: 'Endereço' },
  { key: 'email', label: 'E-mail' },
  { key: 'phone1', label: 'Telefone 1 (Obrigatório)', required: true },
  { key: 'phone2', label: 'Telefone 2' },
  { key: 'phone3', label: 'Telefone 3' },
  { key: 'phone4', label: 'Telefone 4' },
  { key: 'birthDate', label: 'Data de Nascimento' },
  { key: 'bonus1', label: 'Bônus 1' },
  { key: 'bonus2', label: 'Bônus 2' },
  { key: 'bonus3', label: 'Bônus 3' },
  { key: 'bonus4', label: 'Bônus 4' },
  { key: 'bonus5', label: 'Bônus 5' },
];

export const TEMPLATE_VARIABLES = [
  '{{nome}}',
  '{{email}}',
  '{{endereco}}',
  '{{id}}',
  '{{nascimento}}',
  '{{bonus1}}',
  '{{bonus2}}',
  '{{bonus3}}',
  '{{bonus4}}',
  '{{bonus5}}',
  '{{p1nome}}',
  '{{p2nome}}',
] as const;

export const DEFAULT_TEMPLATE = "Olá {{nome}}, tudo bem? Vi seu interesse em {{bonus1}}.";

export const STORAGE_KEY = 'contactFlowData_v3';

export const INITIAL_MAPPING: ColumnMapping = {
  id: '',
  name: '',
  phone1: '',
  phone2: '',
  phone3: '',
  phone4: '',
  email: '',
  address: '',
  birthDate: '',
  bonus1: '',
  bonus2: '',
  bonus3: '',
  bonus4: '',
  bonus5: '',
};
