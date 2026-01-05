import { useState, useCallback, useMemo } from 'react';
import type { Contact, ContactStats, FilterType } from '../types';
import { useDebounce } from './useDebounce';

interface UseContactsReturn {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  toggleContactStatus: (internalId: number) => void;
  filteredContacts: Contact[];
  stats: ContactStats;
  progress: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

/**
 * Hook para gerenciar estado e operações dos contatos
 */
export function useContacts(initialContacts: Contact[] = []): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce do termo de busca para performance
  const debouncedSearch = useDebounce(searchTerm, 250);

  // Toggle status do contato
  const toggleContactStatus = useCallback((internalId: number) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.internalId === internalId) {
          return {
            ...c,
            contacted: !c.contacted,
            lastContactedAt: !c.contacted ? new Date().toISOString() : null,
          };
        }
        return c;
      })
    );
  }, []);

  // Contatos filtrados (usando busca com debounce)
  const filteredContacts = useMemo(() => {
    const search = debouncedSearch.toLowerCase();
    
    return contacts.filter((c) => {
      // Primeiro filtrar por status (mais rápido)
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'contacted'
          ? c.contacted
          : !c.contacted;
      
      if (!matchesFilter) return false;
      
      // Se não há busca, retorna todos que passaram no filtro
      if (!search) return true;
      
      // Busca em campos
      const name = c.name?.toLowerCase() || '';
      const address = c.address?.toLowerCase() || '';
      const email = c.email?.toLowerCase() || '';
      const bonus1 = c.bonus1?.toLowerCase() || '';

      return (
        name.includes(search) ||
        address.includes(search) ||
        email.includes(search) ||
        bonus1.includes(search) ||
        c.phones?.some((p) => p?.toString().includes(debouncedSearch))
      );
    });
  }, [contacts, filter, debouncedSearch]);

  // Estatísticas
  const stats = useMemo<ContactStats>(() => ({
    total: contacts.length,
    contacted: contacts.filter((c) => c.contacted).length,
    pending: contacts.filter((c) => !c.contacted).length,
  }), [contacts]);

  // Progresso percentual
  const progress = useMemo(() => {
    return stats.total === 0 ? 0 : Math.round((stats.contacted / stats.total) * 100);
  }, [stats]);

  return {
    contacts,
    setContacts,
    toggleContactStatus,
    filteredContacts,
    stats,
    progress,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
  };
}
