import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  objective,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !objective) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-bold font-display text-slate-900 mb-2">
            Confirmar exclusão
          </h3>

          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Tem certeza de que deseja remover o objetivo{' '}
            <strong className="text-slate-900 font-semibold">"{objective.title}"</strong> da
            sua rotina de estudos?
          </p>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800 mb-6">
            Esta ação não poderá ser desfeita. Todos os links anexados a esta meta também serão excluídos.
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-sm hover:shadow-rose-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sim, excluir objetivo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
