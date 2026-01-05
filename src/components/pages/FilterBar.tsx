import { Search } from 'lucide-react';
import { Input } from '../ui';
import type { FilterType } from '../../types';

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const filterOptions: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'contacted', label: 'Finalizados' },
];

export function FilterBar({ filter, onFilterChange, searchTerm, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-border transition-colors">
      {/* Filter Tabs */}
      <div className="flex bg-gray-100 dark:bg-dark-bg p-1 rounded-lg w-full md:w-auto">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onFilterChange(opt.id)}
            className={`
              flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all
              ${filter === opt.id
                ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="w-full md:w-72">
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search size={18} />}
        />
      </div>
    </div>
  );
}
