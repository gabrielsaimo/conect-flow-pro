import { Modal, Button } from '../ui';
import { TEMPLATE_VARIABLES } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  onTemplateChange: (template: string) => void;
}

export function SettingsModal({ isOpen, onClose, template, onTemplateChange }: SettingsModalProps) {
  const handleVariableClick = (variable: string) => {
    onTemplateChange(template + ' ' + variable);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6 border-b dark:border-dark-border flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Editor de Template</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <Modal.Body>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sua mensagem padrão
        </label>
        <textarea
          className="w-full h-40 p-3 border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none text-sm leading-relaxed shadow-inner"
          value={template}
          onChange={(e) => onTemplateChange(e.target.value)}
          placeholder="Digite sua mensagem personalizada..."
        />

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Variáveis Dinâmicas
          </p>
          <div className="flex gap-2 flex-wrap">
            {TEMPLATE_VARIABLES.map((tag) => (
              <button
                key={tag}
                onClick={() => handleVariableClick(tag)}
                className="px-2 py-1 bg-white dark:bg-dark-bg text-gray-600 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-dark-border hover:border-brand-300 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all font-mono"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose}>
          Salvar e Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
