import React from 'react';
import { Compass, Plus, SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenCreateModal: () => void;
  onClearFilters: () => void;
  onRestoreSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenCreateModal,
  onClearFilters,
  onRestoreSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 mx-auto mb-4 border border-slate-200/60">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold font-display text-slate-900 mb-1.5">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Não localizamos nenhuma meta com os filtros e termos de busca selecionados.
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          Limpar filtros e busca
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-indigo-100/80 shadow-xs max-w-lg mx-auto my-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white mx-auto mb-4 shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-50">
          <Compass className="w-8 h-8 animate-[spin_20s_linear_infinite]" />
        </div>
        <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
          Sua órbita de estudos está limpa
        </h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Você não possui nenhum objetivo de estudo cadastrado no momento. Cadastre sua primeira meta para organizar matérias, prazos e anexar materiais do Drive e cursos!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow-indigo-500/20 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Meu Primeiro Objetivo</span>
          </button>
          {onRestoreSamples && (
            <button
              onClick={onRestoreSamples}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer w-full sm:w-auto"
              title="Carregar objetivos de estudo de exemplo para conhecer o app"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver exemplos de metas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
