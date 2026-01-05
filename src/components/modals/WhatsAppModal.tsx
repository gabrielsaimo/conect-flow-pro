import { MessageCircle, Phone, ChevronRight } from 'lucide-react';
import { Modal } from '../ui';
import type { Contact } from '../../types';
import { interpolateMessage, generateWhatsAppLink, truncateText } from '../../utils';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  template: string;
  onContactMade: () => void;
}

export function WhatsAppModal({ isOpen, onClose, contact, template, onContactMade }: WhatsAppModalProps) {
  if (!contact) return null;

  const message = interpolateMessage(template, contact);

  const handlePhoneClick = () => {
    if (!contact.contacted) {
      onContactMade();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header variant="success" onClose={onClose}>
        <MessageCircle size={20} />
        Iniciar Conversa
      </Modal.Header>

      <Modal.Body>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Contatar <strong className="dark:text-white">{contact.name}</strong>:
        </p>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {contact.phones.map((phone, idx) => {
            const link = generateWhatsAppLink(phone, message);

            return (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePhoneClick}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-dark-bg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 p-2 rounded-full transition-colors">
                    <Phone size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-green-700 dark:group-hover:text-green-400" />
                  </div>
                  <span className="font-mono text-gray-800 dark:text-gray-200 font-medium text-sm">{phone}</span>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-green-600 dark:group-hover:text-green-400" />
              </a>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg text-xs text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-dark-border italic">
          Prévia: "{truncateText(message, 80)}"
        </div>
      </Modal.Body>
    </Modal>
  );
}
