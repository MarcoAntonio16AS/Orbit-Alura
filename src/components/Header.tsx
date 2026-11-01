import React from 'react';
import { Compass, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  totalCount: number;
  completedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  totalCount,
  completedCount,
}) => {
  return (
    <header className="border-b border-indigo-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 ring-4 ring-indigo-50">
              <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  Orbit
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Estudos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Organize seus objetivos de estudo com leveza e clareza
              </p>
            </div>
          </div>

          {/* Quick Actions & Overview */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {totalCount > 0 && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  <strong className="text-slate-800 font-semibold">{completedCount}</strong> de{' '}
                  <strong className="text-slate-800 font-semibold">{totalCount}</strong> concluídos
                </span>
              </div>
            )}

            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/20 cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Objetivo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
