import type { Contact, ContactStats, FilterType } from '../../types';
import { Header } from './Header';
import { FilterBar } from './FilterBar';
import { ContactTable } from './ContactTable';
import { StatsCard, ProgressBar } from '../ui';

interface DashboardPageProps {
  contacts: Contact[];
  filteredContacts: Contact[];
  stats: ContactStats;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleStatus: (internalId: number) => void;
  onOpenWhatsApp: (contact: Contact) => void;
  onUpdateComments: (internalId: number, comments: string) => void;
  onEditMapping: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
}

export function DashboardPage({
  filteredContacts,
  stats,
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onToggleStatus,
  onOpenWhatsApp,
  onUpdateComments,
  onEditMapping,
  onExport,
  onOpenSettings,
  onReset,
}: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex flex-col transition-colors">
      <Header
        onEditMapping={onEditMapping}
        onExport={onExport}
        onOpenSettings={onOpenSettings}
        onReset={onReset}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 md:col-span-1">
            <StatsCard label="Total" value={stats.total} />
          </div>
          <StatsCard label="Finalizados" value={stats.contacted} color="green" />
          <StatsCard label="Pendentes" value={stats.pending} color="blue" />
          <div className="col-span-2 md:col-span-1">
            <ProgressBar value={stats.contacted} max={stats.total} />
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          filter={filter}
          onFilterChange={onFilterChange}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />

        {/* Table */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden transition-colors">
          <ContactTable
            contacts={filteredContacts}
            onToggleStatus={onToggleStatus}
            onOpenWhatsApp={onOpenWhatsApp}
            onUpdateComments={onUpdateComments}
          />
        </div>
      </div>
    </div>
  );
}
