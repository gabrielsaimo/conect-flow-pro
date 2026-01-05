import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { FileSpreadsheet, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts';
import logoImg from '../../assets/logo_conectflowpro.png';

interface UploadPageProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export function UploadPage({ onFileUpload, isLoading }: UploadPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark, toggleTheme } = useTheme();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 dark:from-slate-900 dark:to-slate-950 p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border dark:border-dark-border">
        <div className="mx-auto mb-6">
          <img 
            src={logoImg} 
            alt="Contact Flow Pro" 
            className="h-20 w-auto mx-auto"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Importar Dados</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Carregue seu arquivo .xlsx ou .csv.</p>

        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            flex flex-col items-center px-4 py-8 bg-white dark:bg-slate-800 rounded-lg 
            tracking-wide border-dashed border-2 border-gray-300 dark:border-gray-600
            cursor-pointer transition-all
            hover:bg-brand-50 dark:hover:bg-slate-700 hover:border-brand-500
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <FileSpreadsheet size={32} className="text-gray-400 dark:text-gray-500 mb-2" />
          <span className="mt-2 text-base leading-normal text-gray-600 dark:text-gray-300">
            {isLoading ? 'Processando...' : 'Selecione ou arraste um arquivo'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
            disabled={isLoading}
          />
        </label>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Formatos aceitos: Excel (.xlsx, .xls) ou CSV
        </p>

        <button 
          onClick={toggleTheme} 
          className="mt-6 text-gray-400 hover:text-brand-500 text-sm flex items-center justify-center gap-2 mx-auto"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Mudar para Claro' : 'Mudar para Escuro'}
        </button>
      </div>
    </div>
  );
}
