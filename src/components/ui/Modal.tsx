import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({ isOpen, onClose, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current === e.target) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Fecha ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className={`bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full ${sizeClasses[size]} overflow-hidden animate-fade-in-up border dark:border-dark-border`}>
        {children}
      </div>
    </div>
  );
}

// Sub-componentes para estrutura do Modal
Modal.Header = function ModalHeader({
  children,
  onClose,
  variant = 'default',
}: {
  children: ReactNode;
  onClose?: () => void;
  variant?: 'default' | 'success' | 'danger';
}) {
  const bgColors = {
    default: 'bg-brand-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
  };

  return (
    <div className={`${bgColors[variant]} p-4 text-white flex justify-between items-center`}>
      <h3 className="font-bold text-lg flex items-center gap-2">{children}</h3>
      {onClose && (
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 text-gray-900 dark:text-white ${className}`}>{children}</div>;
};

Modal.Footer = function ModalFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-4 border-t dark:border-dark-border bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
};
