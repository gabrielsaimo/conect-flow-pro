import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../ui';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({ isOpen, onClose, onConfirm }: ResetConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Body className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tem certeza?</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Isso apagará todos os dados importados e o progresso atual. 
          Você terá que importar a planilha novamente.
        </p>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1">
            Sim, Sair
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
