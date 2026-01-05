import { TableProperties, Download, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '../ui';
import { useTheme } from '../../contexts';
import logoImg from '../../assets/logo_conectflowpro.png';

interface HeaderProps {
  onEditMapping: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
  onReset: () => void;
}

export function Header({ onEditMapping, onExport, onOpenSettings, onReset }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-card border-b dark:border-dark-border sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img 
            src={logoImg} 
            alt="Contact Flow Pro" 
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">
            Contact Flow Pro
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-white hover:bg-brand-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Alternar Tema"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          <Button variant="ghost" onClick={onEditMapping} title="Editar Colunas">
            <TableProperties size={18} />
            <span className="hidden sm:inline">Colunas</span>
          </Button>

          <Button variant="ghost" onClick={onExport}>
            <Download size={18} />
            <span className="hidden sm:inline">Exportar</span>
          </Button>

          <Button variant="ghost" onClick={onOpenSettings}>
            <Settings size={18} />
            <span className="hidden sm:inline">Template</span>
          </Button>

          <button
            onClick={onReset}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Sair / Reiniciar"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
