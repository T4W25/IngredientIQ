import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-4">
          {toasts.map(({ id, title, description, variant }) => (
            <div
              key={id}
              className={cn(
                'rounded-lg p-4 shadow-lg',
                variant === 'default' && 'bg-white dark:bg-gray-800',
                variant === 'destructive' && 'bg-red-500 text-white',
                'animate-in slide-in-from-right-4'
              )}
            >
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm opacity-90">{description}</p>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 