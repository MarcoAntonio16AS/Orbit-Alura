import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { StatusFilter, SortOption } from '../types/objective';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  availableCategories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
  selectedCategory,
  onCategoryChange,
  availableCategories,
}) => {
  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs space-y-3">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, matéria ou conteúdo..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Category Dropdowns */}
        <div className="flex items-center gap-2">
          {availableCategories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Todas as Áreas</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
                aria-label="Ordenar objetivos"
                className="bg-transparent focus:outline-hidden text-xs sm:text-sm text-slate-700 cursor-pointer pr-1"
              >
                <option value="deadline_asc">Prazo: Mais Próximo</option>
                <option value="deadline_desc">Prazo: Mais Distante</option>
                <option value="created_desc">Criados Recentemente</option>
                <option value="title_asc">Ordem Alfabética</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 pt-1 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Status:</span>
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => onStatusFilterChange('not_started')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 cursor-pointer ${
            statusFilter === 'not_started'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
          }`}
        >
          A Iniciar
        </button>
        <button
          onClick={() => onStatusFilterChange('in_progress')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 cursor-pointer ${
            statusFilter === 'in_progress'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
          }`}
        >
          Em Andamento
        </button>
        <button
          onClick={() => onStatusFilterChange('completed')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
          }`}
        >
          Concluídos
        </button>
      </div>
    </div>
  );
};
