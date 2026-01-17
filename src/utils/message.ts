import type { Contact } from '../types';

/**
 * Extrai a primeira parte do nome (primeiro nome)
 */
function getFirstName(fullName: string): string {
  const parts = (fullName || '').trim().split(/\s+/);
  return parts[0] || '';
}

/**
 * Extrai as duas primeiras partes do nome
 */
function getFirstTwoNames(fullName: string): string {
  const parts = (fullName || '').trim().split(/\s+/);
  return parts.slice(0, 2).join(' ');
}

/**
 * Retorna a saudação apropriada baseada no horário atual
 * 06:00 - 11:59: Bom dia
 * 12:00 - 17:59: Boa tarde
 * 18:00 - 05:59: Boa noite
 */
function getGreetingByTime(): string {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
}

/**
 * Interpola variáveis do template com dados do contato
 */
export function interpolateMessage(template: string, contact: Contact): string {
  let msg = template;

  // Variável dinâmica: saudação baseada no horário
  const greeting = getGreetingByTime();
  msg = msg.replace(/{{saudacao}}/gi, greeting);

  // Campos de nome parciais
  const firstName = getFirstName(contact.name);
  const firstTwoNames = getFirstTwoNames(contact.name);
  msg = msg.replace(/{{p1nome}}/gi, firstName);
  msg = msg.replace(/{{p2nome}}/gi, firstTwoNames);

  // Campos padrão
  msg = msg.replace(/{{nome}}/gi, contact.name || '');
  msg = msg.replace(/{{endereco}}/gi, contact.address || '');
  msg = msg.replace(/{{id}}/gi, String(contact.id) || '');
  msg = msg.replace(/{{email}}/gi, contact.email || '');
  msg = msg.replace(/{{nascimento}}/gi, contact.birthDate || '');

  // Campos bônus
  msg = msg.replace(/{{bonus1}}/gi, contact.bonus1 || '');
  msg = msg.replace(/{{bonus2}}/gi, contact.bonus2 || '');
  msg = msg.replace(/{{bonus3}}/gi, contact.bonus3 || '');
  msg = msg.replace(/{{bonus4}}/gi, contact.bonus4 || '');
  msg = msg.replace(/{{bonus5}}/gi, contact.bonus5 || '');

  return msg;
}

/**
 * Gera link do WhatsApp com mensagem
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Trunca texto com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
