import { memo, useState, useCallback, useMemo } from 'react';
import { Check, Mail, MessageCircle, Inbox, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Contact } from '../../types';

const ITEMS_PER_PAGE = 50;

type SortField = 'name' | 'id' | 'status' | 'address' | null;
type SortDirection = 'asc' | 'desc';

interface ContactTableProps {
  contacts: Contact[];
  onToggleStatus: (internalId: number) => void;
  onOpenWhatsApp: (contact: Contact) => void;
}

export function ContactTable({ contacts, onToggleStatus, onOpenWhatsApp }: ContactTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Função para alternar ordenação
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      // Se já está ordenando por este campo, inverte a direção
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Novo campo, começa ascendente
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset para primeira página
  }, [sortField]);

  // Ordenar contatos
  const sortedContacts = useMemo(() => {
    if (!sortField) return contacts;

    return [...contacts].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'id':
          comparison = String(a.id || '').localeCompare(String(b.id || ''));
          break;
        case 'status':
          comparison = (a.contacted ? 1 : 0) - (b.contacted ? 1 : 0);
          break;
        case 'address':
          comparison = (a.address || '').localeCompare(b.address || '');
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [contacts, sortField, sortDirection]);
  
  // Calcular paginação
  const totalPages = Math.ceil(sortedContacts.length / ITEMS_PER_PAGE);
  
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedContacts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedContacts, currentPage]);

  // Reset para página 1 quando filtros mudam
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [contacts.length, currentPage, totalPages]);

  // Componente do botão de ordenação
  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="inline-flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
      ) : (
        <ArrowUpDown size={14} className="opacity-40" />
      )}
    </button>
  );

  if (contacts.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 dark:text-gray-500">
        <div className="flex flex-col items-center">
          <Inbox size={48} className="mb-2 opacity-20" />
          <p>Nenhum contato encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <th className="p-4 w-16 text-center">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="p-4">
                <SortButton field="name">Dados do Cliente</SortButton>
              </th>
              <th className="p-4">Contatos</th>
              <th className="p-4">
                <SortButton field="address">Endereço</SortButton>
              </th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {paginatedContacts.map((contact) => (
              <ContactRow
                key={contact.internalId}
                contact={contact}
                onToggleStatus={onToggleStatus}
                onOpenWhatsApp={onOpenWhatsApp}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, contacts.length)} de {contacts.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ContactRowProps {
  contact: Contact;
  onToggleStatus: (internalId: number) => void;
  onOpenWhatsApp: (contact: Contact) => void;
}

// Memoizar a linha para evitar re-renders desnecessários
const ContactRow = memo(function ContactRow({ contact, onToggleStatus, onOpenWhatsApp }: ContactRowProps) {
  const bonusFields = useMemo(() => 
    [1, 2, 3, 4, 5]
      .map((i) => contact[`bonus${i}` as keyof Contact])
      .filter(Boolean),
    [contact]
  );
  
  const handleToggle = useCallback(() => {
    onToggleStatus(contact.internalId);
  }, [onToggleStatus, contact.internalId]);
  
  const handleWhatsApp = useCallback(() => {
    onOpenWhatsApp(contact);
  }, [onOpenWhatsApp, contact]);

  return (
    <tr className={`group hover:bg-gray-50 dark:hover:bg-dark-hover ${contact.contacted ? 'bg-gray-50/50 dark:bg-dark-bg/50' : ''}`}>
      {/* Status Checkbox */}
      <td className="p-4 text-center">
        <button
          onClick={handleToggle}
          className={`
            w-6 h-6 rounded border flex items-center justify-center
            ${contact.contacted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
        >
          <Check size={14} strokeWidth={4} />
        </button>
      </td>

      {/* Client Data */}
      <td className="p-4">
        <div className={`font-semibold text-gray-900 dark:text-white ${contact.contacted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
          {contact.name}
        </div>
        {contact.email && (
          <div className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-0.5">
            <Mail size={12} /> {contact.email}
          </div>
        )}
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex gap-2">
          <span>ID: {contact.id}</span>
          {contact.birthDate && <span>• Nasc: {contact.birthDate}</span>}
        </div>
        {/* Bonus Fields */}
        {bonusFields.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {bonusFields.map((bonus, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800"
              >
                {String(bonus)}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Phones */}
      <td className="p-4">
        <div className="flex flex-wrap gap-1 max-w-xs">
          {contact.phones.map((phone, idx) => (
            <span
              key={idx}
              className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border px-2 py-1 rounded-md font-mono whitespace-nowrap"
            >
              {phone}
            </span>
          ))}
        </div>
      </td>

      {/* Address */}
      <td className="p-4">
        <span className="text-sm text-gray-600 dark:text-gray-400 block max-w-xs truncate" title={contact.address}>
          {contact.address || '-'}
        </span>
      </td>

      {/* WhatsApp Action */}
      <td className="p-4 text-right">
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-whatsapp hover:text-white hover:border-whatsapp px-4 py-2 rounded-lg font-medium text-sm shadow-sm"
        >
          <MessageCircle size={18} />
          WhatsApp
        </button>
      </td>
    </tr>
  );
});
