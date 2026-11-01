import React from 'react';
import { Target, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface StatsOverviewProps {
  objectives: StudyObjective[];
  onFilterChange: (status: 'all' | 'not_started' | 'in_progress' | 'completed') => void;
  currentFilter: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  objectives,
  onFilterChange,
  currentFilter,
}) => {
  const total = objectives.length;
  const notStarted = objectives.filter((o) => o.status === 'not_started').length;
  const inProgress = objectives.filter((o) => o.status === 'in_progress').length;
  const completed = objectives.filter((o) => o.status === 'completed').length;

  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Top Banner / Progress motivation */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-indigo-900/10 relative overflow-hidden">
        {/* Subtle decorative orbits */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-2 -top-2 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute left-1/3 -bottom-16 w-52 h-52 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-medium text-indigo-200 mb-3 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sua jornada de aprendizado
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
              {total === 0
                ? 'Bem-vinda ao seu espaço de estudos'
                : progressPercentage === 100
                ? 'Incrível! Todos os objetivos foram concluídos! 🚀'
                : 'Mantenha o ritmo, um objetivo de cada vez'}
            </h2>
            <p className="text-sm text-indigo-100/80 mt-1 leading-relaxed">
              {total === 0
                ? 'Cadastre suas metas, anexe links de apostilas no Drive e cursos online para manter a rotina organizada.'
                : `Você já concluiu ${completed} de ${total} objetivos planejados (${progressPercentage}% da sua jornada).`}
            </p>
          </div>

          {/* Progress gauge card */}
          {total > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 min-w-[240px] flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-100 mb-2">
                <span>Progresso Geral</span>
                <span className="text-sm font-bold text-white">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-indigo-200/80 mt-2">
                <span>{completed} finalizados</span>
                <span>{total - completed} restantes</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <button
          onClick={() => onFilterChange('all')}
          className={`flex flex-col p-4 rounded-2xl border transition-all text-left cursor-pointer group ${
            currentFilter === 'all'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
              Total Cadastrados
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            {total}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {total === 1 ? '1 meta na órbita' : `${total} metas na órbita`}
          </span>
        </button>

        {/* A Iniciar */}
        <button
          onClick={() => onFilterChange('not_started')}
          className={`flex flex-col p-4 rounded-2xl border transition-all text-left cursor-pointer group ${
            currentFilter === 'not_started'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-amber-200 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-medium text-slate-500 group-hover:text-amber-700 transition-colors">
              A Iniciar
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            {notStarted}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">Aguardando início</span>
        </button>

        {/* Em Andamento */}
        <button
          onClick={() => onFilterChange('in_progress')}
          className={`flex flex-col p-4 rounded-2xl border transition-all text-left cursor-pointer group ${
            currentFilter === 'in_progress'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-blue-200 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-medium text-slate-500 group-hover:text-blue-700 transition-colors">
              Em Andamento
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            {inProgress}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">Em foco ativo</span>
        </button>

        {/* Concluídos */}
        <button
          onClick={() => onFilterChange('completed')}
          className={`flex flex-col p-4 rounded-2xl border transition-all text-left cursor-pointer group ${
            currentFilter === 'completed'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/80 hover:border-emerald-200 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-700 transition-colors">
              Concluídos
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            {completed}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">Conquistas alcançadas</span>
        </button>
      </div>
    </div>
  );
};
