/**
 * Utilitários para manipulação de números de telefone
 */

/**
 * Remove todos os caracteres não numéricos de um telefone
 */
export function cleanPhone(phone: string | number | null | undefined): string {
  if (!phone) return '';
  return phone.toString().replace(/\D/g, '');
}

/**
 * Deduplica uma lista de telefones, considerando variantes brasileiras
 * (com e sem o 9º dígito)
 */
export function deduplicatePhones(rawPhones: (string | number | null | undefined)[]): string[] {
  const uniquePhones: string[] = [];
  const seenNumbers = new Set<string>();

  rawPhones.filter(Boolean).forEach((p) => {
    const clean = cleanPhone(p);
    if (clean.length === 0) return;

    // Se já vimos esse número (ou sua variante), pulamos
    if (seenNumbers.has(clean)) return;

    // Adiciona o número limpo à lista de vistos
    seenNumbers.add(clean);
    uniquePhones.push(String(p)); // Salva o formato original

    // Lógica para Número Brasileiro (Nono Dígito)
    if (clean.length === 11 && parseInt(clean[2]) === 9) {
      // Remove o 9º dígito para criar variante
      const variant = clean.substring(0, 2) + clean.substring(3);
      seenNumbers.add(variant);
    } else if (clean.length === 10) {
      // Adiciona o 9º dígito para criar variante
      const variant = clean.substring(0, 2) + '9' + clean.substring(2);
      seenNumbers.add(variant);
    }
  });

  return uniquePhones;
}

/**
 * Formata um telefone para exibição
 */
export function formatPhone(phone: string): string {
  const clean = cleanPhone(phone);
  
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  
  return phone;
}
