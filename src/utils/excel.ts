import * as XLSX from 'xlsx';
import type { Contact, ColumnMapping } from '../types';
import { deduplicatePhones } from './phone';

type RawRow = (string | number | null | undefined)[];

/**
 * Verifica se os headers correspondem ao formato de exportação do sistema
 */
export function isExportedFile(headers: string[]): boolean {
  // Verifica se pelo menos as colunas principais estão presentes
  const requiredHeaders = ['ID', 'Nome', 'Telefones', 'Status'];
  const normalizedHeaders = headers.map(h => h?.trim());
  
  return requiredHeaders.every(required => 
    normalizedHeaders.some(h => h === required)
  );
}

/**
 * Processa arquivo exportado anteriormente pelo sistema
 * Recupera todos os dados incluindo status de contato
 */
export function processExportedFile(
  rawData: RawRow[],
  headers: string[]
): Contact[] {
  const getColIndex = (headerName: string): number => {
    return headers.findIndex(h => h?.trim() === headerName);
  };

  const getVal = (row: RawRow, headerName: string): unknown => {
    const index = getColIndex(headerName);
    return index >= 0 ? row[index] : null;
  };

  const contacts = rawData.map((row, index): Contact => {
    // Recupera telefones (podem estar separados por vírgula)
    const telefonesStr = (getVal(row, 'Telefones') as string) || '';
    const phones = telefonesStr
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    // Recupera status
    const statusStr = (getVal(row, 'Status') as string) || '';
    const contacted = statusStr.toLowerCase() === 'contatado';

    // Recupera data do último contato
    const dataContatoStr = (getVal(row, 'Data_Contato') as string) || '';
    let lastContactedAt: string | null = null;
    
    if (dataContatoStr && contacted) {
      // Tenta converter a data brasileira para ISO
      try {
        const [datePart, timePart] = dataContatoStr.split(', ');
        if (datePart) {
          const [day, month, year] = datePart.split('/');
          if (timePart) {
            const [hour, min, sec] = timePart.split(':');
            lastContactedAt = new Date(
              parseInt(year), parseInt(month) - 1, parseInt(day),
              parseInt(hour) || 0, parseInt(min) || 0, parseInt(sec) || 0
            ).toISOString();
          } else {
            lastContactedAt = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
          }
        }
      } catch {
        lastContactedAt = contacted ? new Date().toISOString() : null;
      }
    }

    return {
      internalId: index,
      id: getVal(row, 'ID') as string | number,
      name: (getVal(row, 'Nome') as string) || 'Sem Nome',
      phones: phones.length > 0 ? phones : [],
      email: (getVal(row, 'Email') as string) || '',
      address: (getVal(row, 'Endereço') as string) || '',
      birthDate: (getVal(row, 'Nascimento') as string) || '',
      bonus1: (getVal(row, 'Bonus1') as string) || undefined,
      bonus2: (getVal(row, 'Bonus2') as string) || undefined,
      bonus3: (getVal(row, 'Bonus3') as string) || undefined,
      bonus4: (getVal(row, 'Bonus4') as string) || undefined,
      bonus5: (getVal(row, 'Bonus5') as string) || undefined,
      contacted,
      lastContactedAt,
      comments: (getVal(row, 'Comentarios') as string) || undefined,
    };
  });

  // Filtra contatos inválidos
  return contacts.filter((c) => c.id && c.phones.length > 0);
}

/**
 * Converte data serial do Excel para string DD/MM/YYYY
 */
function parseExcelDate(value: unknown): string {
  if (!value) return '';
  
  if (typeof value === 'number') {
    const dateInfo = XLSX.SSF.parse_date_code(value);
    if (dateInfo) {
      const day = dateInfo.d < 10 ? `0${dateInfo.d}` : dateInfo.d;
      const month = dateInfo.m < 10 ? `0${dateInfo.m}` : dateInfo.m;
      return `${day}/${month}/${dateInfo.y}`;
    }
  }
  
  return String(value);
}

/**
 * Processa dados brutos em contatos usando o mapeamento
 */
export function processRawDataToContacts(
  rawData: RawRow[],
  headers: string[],
  mapping: ColumnMapping
): Contact[] {
  const getColIndex = (headerName: string): number => headers.indexOf(headerName);
  
  const getVal = (row: RawRow, key: keyof ColumnMapping): unknown => {
    const headerName = mapping[key];
    if (!headerName) return null;
    const index = getColIndex(headerName);
    return index >= 0 ? row[index] : null;
  };

  const processed = rawData.map((row, index): Contact => {
    // Coleta telefones
    const rawPhones = [
      getVal(row, 'phone1'),
      getVal(row, 'phone2'),
      getVal(row, 'phone3'),
      getVal(row, 'phone4'),
    ].filter(Boolean) as (string | number)[];

    // Deduplica telefones
    const uniquePhones = deduplicatePhones(rawPhones);

    // Processa data de nascimento
    const birthDate = parseExcelDate(getVal(row, 'birthDate'));

    return {
      internalId: index,
      id: getVal(row, 'id') as string | number,
      name: (getVal(row, 'name') as string) || 'Sem Nome',
      phones: uniquePhones,
      email: (getVal(row, 'email') as string) || '',
      address: (getVal(row, 'address') as string) || '',
      birthDate,
      bonus1: getVal(row, 'bonus1') as string | undefined,
      bonus2: getVal(row, 'bonus2') as string | undefined,
      bonus3: getVal(row, 'bonus3') as string | undefined,
      bonus4: getVal(row, 'bonus4') as string | undefined,
      bonus5: getVal(row, 'bonus5') as string | undefined,
      contacted: false,
      lastContactedAt: null,
      comments: undefined,
    };
  });

  // Filtra contatos inválidos
  return processed.filter((c) => c.id && c.phones.length > 0);
}

/**
 * Exporta contatos para Excel com template de mensagem
 */
export function exportContactsToExcel(
  contacts: Contact[], 
  template: string = '',
  filename: string = 'Contatos_Processados.xlsx'
): void {
  const exportData = contacts.map((c) => ({
    ID: c.id,
    Nome: c.name,
    Nascimento: c.birthDate,
    Email: c.email,
    Endereço: c.address,
    Telefones: c.phones.join(', '),
    Status: c.contacted ? 'Contatado' : 'Pendente',
    Data_Contato: c.lastContactedAt ? new Date(c.lastContactedAt).toLocaleString('pt-BR') : '',
    Comentarios: c.comments || '',
    Bonus1: c.bonus1 || '',
    Bonus2: c.bonus2 || '',
    Bonus3: c.bonus3 || '',
    Bonus4: c.bonus4 || '',
    Bonus5: c.bonus5 || '',
  }));

  // Cria workbook com aba de contatos
  const wsContatos = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsContatos, 'Contatos');
  
  // Adiciona aba de configurações com o template
  // O template é salvo em uma única célula para preservar quebras de linha
  const configData = [
    ['Configuracao', 'Valor'],
    ['Template', template || ''],
    ['Versao', 'ContactFlowPro_v1'],
    ['Data_Exportacao', new Date().toLocaleString('pt-BR')],
  ];
  const wsConfig = XLSX.utils.aoa_to_sheet(configData);
  
  // Ajusta largura da coluna Valor para caber o template
  wsConfig['!cols'] = [{ wch: 20 }, { wch: 100 }];
  
  XLSX.utils.book_append_sheet(wb, wsConfig, 'Config');
  
  XLSX.writeFile(wb, filename);
}

/**
 * Extrai o template de mensagem de um arquivo exportado
 */
export function extractTemplateFromExportedFile(workbook: XLSX.WorkBook): string | null {
  // Verifica se existe a aba Config
  if (!workbook.SheetNames.includes('Config')) {
    return null;
  }
  
  const wsConfig = workbook.Sheets['Config'];
  
  // Usa sheet_to_json com header:1 para pegar array de arrays
  const configRows = XLSX.utils.sheet_to_json<(string | undefined)[]>(wsConfig, { header: 1 });
  
  // Procura a linha do Template (pula o header)
  for (let i = 1; i < configRows.length; i++) {
    const row = configRows[i];
    if (row && row[0] === 'Template') {
      return row[1] || null;
    }
  }
  
  return null;
}

/**
 * Gera mapeamento automático para arquivos exportados pelo sistema
 */
export function generateAutoMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
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
  
  // Mapeamento de headers exportados para campos
  const headerToField: Record<string, keyof ColumnMapping> = {
    'ID': 'id',
    'Nome': 'name',
    'Email': 'email',
    'Endereço': 'address',
    'Nascimento': 'birthDate',
    'Telefones': 'phone1',
    'Bonus1': 'bonus1',
    'Bonus2': 'bonus2',
    'Bonus3': 'bonus3',
    'Bonus4': 'bonus4',
    'Bonus5': 'bonus5',
  };
  
  headers.forEach(header => {
    const trimmedHeader = header?.trim();
    const fieldKey = headerToField[trimmedHeader];
    if (fieldKey) {
      mapping[fieldKey] = trimmedHeader;
    }
  });
  
  return mapping;
}

/**
 * Tenta auto-mapear headers de arquivos novos baseado em padrões comuns
 */
export function tryAutoMapHeaders(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
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
  
  // Padrões comuns para cada campo (case insensitive)
  const patterns: Record<keyof ColumnMapping, RegExp[]> = {
    id: [/^id$/i, /^codigo$/i, /^cod$/i, /^código$/i, /^num$/i, /^numero$/i, /^número$/i],
    name: [/nome/i, /name/i, /cliente/i, /razao/i, /razão/i],
    phone1: [/telefone/i, /phone/i, /celular/i, /fone/i, /tel\d?$/i, /whatsapp/i, /whats/i],
    phone2: [/telefone.*2/i, /phone.*2/i, /celular.*2/i, /fone.*2/i, /tel.*2/i],
    phone3: [/telefone.*3/i, /phone.*3/i, /celular.*3/i, /fone.*3/i, /tel.*3/i],
    phone4: [/telefone.*4/i, /phone.*4/i, /celular.*4/i, /fone.*4/i, /tel.*4/i],
    email: [/email/i, /e-mail/i, /mail/i],
    address: [/endereço/i, /endereco/i, /address/i, /rua/i, /logradouro/i],
    birthDate: [/nascimento/i, /data.*nasc/i, /birth/i, /aniversario/i, /aniversário/i],
    bonus1: [/bonus.*1/i, /bônus.*1/i, /extra.*1/i, /obs.*1/i],
    bonus2: [/bonus.*2/i, /bônus.*2/i, /extra.*2/i, /obs.*2/i],
    bonus3: [/bonus.*3/i, /bônus.*3/i, /extra.*3/i, /obs.*3/i],
    bonus4: [/bonus.*4/i, /bônus.*4/i, /extra.*4/i, /obs.*4/i],
    bonus5: [/bonus.*5/i, /bônus.*5/i, /extra.*5/i, /obs.*5/i],
  };
  
  const usedHeaders = new Set<string>();
  
  // Para cada campo, procura um header que corresponda
  for (const [field, regexList] of Object.entries(patterns)) {
    for (const regex of regexList) {
      const matchingHeader = headers.find(h => 
        h && regex.test(h.trim()) && !usedHeaders.has(h)
      );
      if (matchingHeader) {
        mapping[field as keyof ColumnMapping] = matchingHeader;
        usedHeaders.add(matchingHeader);
        break;
      }
    }
  }
  
  return mapping;
}

/**
 * Lê arquivo Excel/CSV e retorna headers, dados e template (se existir)
 */
export function parseExcelFile(file: File): Promise<{ 
  headers: string[]; 
  data: RawRow[];
  template: string | null;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        // Tenta extrair template da aba Config
        const template = extractTemplateFromExportedFile(wb);
        
        // Lê dados da primeira aba (Contatos)
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<RawRow>(ws, { header: 1 });

        if (data.length > 0) {
          const headers = (data[0] as string[]).map(h => String(h ?? ''));
          resolve({
            headers,
            data: data.slice(1),
            template,
          });
        } else {
          reject(new Error('Arquivo vazio'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsBinaryString(file);
  });
}
