import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const config = {
    success: {
      bg: 'bg-emerald-900/95 text-white border-emerald-700',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    info: {
      bg: 'bg-slate-900/95 text-white border-slate-700',
      icon: Info,
      iconColor: 'text-indigo-400',
    },
    warning: {
      bg: 'bg-amber-950/95 text-white border-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in slide-in-from-bottom-3 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${config.bg}`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
        <span className="text-xs sm:text-sm font-medium leading-tight flex-1">
          {toast.message}
        </span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
