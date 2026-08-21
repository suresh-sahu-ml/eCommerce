import React from 'react';

export default function Modal({ isOpen, title, message, type = 'info', onClose, buttons = [] }) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'error',
          iconColor: 'text-error',
          borderColor: 'border-error/20',
          bgColor: 'bg-error/5',
        };
      case 'success':
        return {
          icon: 'check_circle',
          iconColor: 'text-success',
          borderColor: 'border-success/20',
          bgColor: 'bg-success/5',
        };
      case 'warning':
        return {
          icon: 'warning',
          iconColor: 'text-warning',
          borderColor: 'border-warning/20',
          bgColor: 'bg-warning/5',
        };
      default:
        return {
          icon: 'info',
          iconColor: 'text-primary',
          borderColor: 'border-primary/20',
          bgColor: 'bg-primary/5',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-surface rounded-lg shadow-2xl max-w-md w-full mx-4 border ${typeStyles.borderColor} overflow-hidden`}>
        <div className={`${typeStyles.bgColor} p-6 flex items-start gap-4`}>
          <span className={`material-symbols-outlined text-2xl ${typeStyles.iconColor} flex-shrink-0`}>
            {typeStyles.icon}
          </span>
          <div className="flex-1">
            {title && (
              <h2 className="font-headline-md text-headline-md text-primary mb-2">{title}</h2>
            )}
            <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
          </div>
        </div>

        <div className="p-6 flex gap-3 justify-end">
          {buttons.length > 0 ? (
            buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => {
                  btn.onClick?.();
                  onClose?.();
                }}
                className={`px-6 py-3 font-label-sm text-label-sm uppercase tracking-widest rounded transition-colors ${
                  btn.variant === 'primary'
                    ? 'bg-primary text-on-primary hover:bg-secondary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {btn.label}
              </button>
            ))
          ) : (
            <button
              onClick={onClose}
              className="px-8 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest rounded hover:bg-secondary transition-colors"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
