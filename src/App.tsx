/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { Toast, ToastMessage } from './components/Toast';
import { storageService } from './services/storageService';
import {
  StudyObjective,
  ObjectiveFormData,
  ObjectiveStatus,
  StatusFilter,
  SortOption,
} from './types/objective';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filtros e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('deadline_asc');

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [objectiveToDelete, setObjectiveToDelete] = useState<StudyObjective | null>(null);

  // Feedback Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Carrega os dados do localStorage na inicialização
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
    setIsLoaded(true);
  }, []);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({
      id: Date.now().toString(),
      message,
      type,
    });
  };

  // Categorias disponíveis
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    objectives.forEach((obj) => {
      if (obj.category && obj.category.trim()) {
        categoriesSet.add(obj.category.trim());
      }
    });
    return Array.from(categoriesSet);
  }, [objectives]);

  // Contadores
  const totalCount = objectives.length;
  const completedCount = objectives.filter((o) => o.status === 'completed').length;

  // Filtragem e ordenação dos objetivos
  const filteredObjectives = useMemo(() => {
    return objectives
      .filter((obj) => {
        // Filtro por status
        if (statusFilter !== 'all' && obj.status !== statusFilter) {
          return false;
        }

        // Filtro por categoria
        if (selectedCategory !== 'all' && obj.category !== selectedCategory) {
          return false;
        }

        // Filtro por busca textual
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = obj.title.toLowerCase().includes(query);
          const matchDesc = obj.description?.toLowerCase().includes(query) || false;
          const matchCategory = obj.category?.toLowerCase().includes(query) || false;
          const matchLinks = obj.links?.some(
            (l) => l.title.toLowerCase().includes(query) || l.url.toLowerCase().includes(query)
          );
          if (!matchTitle && !matchDesc && !matchCategory && !matchLinks) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'deadline_asc') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        }
        if (sortOption === 'deadline_desc') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return b.deadline.localeCompare(a.deadline);
        }
        if (sortOption === 'created_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption === 'title_asc') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        return 0;
      });
  }, [objectives, statusFilter, selectedCategory, searchTerm, sortOption]);

  // Abertura do formulário para criação
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abertura do formulário para edição
  const handleOpenEditModal = (obj: StudyObjective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  // Salvar objetivo (Criação ou Edição)
  const handleSaveObjective = (data: ObjectiveFormData, id?: string) => {
    if (id) {
      const updated = storageService.updateObjective(id, data);
      if (updated) {
        setObjectives((prev) => prev.map((item) => (item.id === id ? updated : item)));
        showToast(`Objetivo "${data.title}" atualizado com sucesso!`);
      }
    } else {
      const created = storageService.addObjective(data);
      setObjectives((prev) => [created, ...prev]);
      showToast(`Objetivo "${data.title}" cadastrado com sucesso!`);
    }
    setIsFormModalOpen(false);
    setEditingObjective(null);
  };

  // Alteração de status rápida no card
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      setObjectives((prev) => prev.map((item) => (item.id === id ? updated : item)));
      const statusLabels = {
        not_started: 'marcado como "A Iniciar"',
        in_progress: 'em "Em Andamento"',
        completed: 'concluído com sucesso! Parabéns! 🎉',
      };
      showToast(`Objetivo ${statusLabels[newStatus]}`, newStatus === 'completed' ? 'success' : 'info');
    }
  };

  // Iniciar fluxo de exclusão (com confirmação obrigatória)
  const handleDeleteRequest = (obj: StudyObjective) => {
    setObjectiveToDelete(obj);
  };

  // Confirmação da exclusão
  const handleDeleteConfirmed = () => {
    if (!objectiveToDelete) return;

    const removedTitle = objectiveToDelete.title;
    const success = storageService.deleteObjective(objectiveToDelete.id);
    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== objectiveToDelete.id));
      showToast(`Objetivo "${removedTitle}" foi excluído.`, 'info');
    }
    setObjectiveToDelete(null);
  };

  // Restaurar dados de exemplo se o usuário desejar
  const handleRestoreSamples = () => {
    const samples = storageService.resetToDefaultSample();
    setObjectives(samples);
    showToast('Exemplos de objetivos restaurados!', 'info');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSelectedCategory('all');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-600">Carregando sua órbita de estudos...</span>
        </div>
      </div>
    );
  }

  const isFiltered = Boolean(searchTerm.trim() || statusFilter !== 'all' || selectedCategory !== 'all');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50 flex flex-col text-slate-800">
      {/* Cabeçalho */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        totalCount={totalCount}
        completedCount={completedCount}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Painel de Estatísticas e Progresso */}
        <StatsOverview
          objectives={objectives}
          onFilterChange={(status) => setStatusFilter(status)}
          currentFilter={statusFilter}
        />

        {/* Barra de Filtros, Busca e Ordenação */}
        {totalCount > 0 && (
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortOption={sortOption}
            onSortOptionChange={setSortOption}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            availableCategories={availableCategories}
          />
        )}

        {/* Listagem de Objetivos */}
        <section aria-label="Objetivos de Estudo" className="space-y-4">
          {totalCount > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
              <span className="font-medium">
                Mostrando{' '}
                <strong className="text-slate-800 font-semibold">{filteredObjectives.length}</strong>{' '}
                de <strong className="text-slate-800 font-semibold">{totalCount}</strong> objetivos
                {isFiltered && ' (com filtros ativos)'}
              </span>
              {isFiltered && (
                <button
                  onClick={handleClearFilters}
                  className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}

          {/* Grid de Cards ou Estado Vazio */}
          {filteredObjectives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredObjectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              isFiltered={isFiltered}
              onOpenCreateModal={handleOpenCreateModal}
              onClearFilters={handleClearFilters}
              onRestoreSamples={totalCount === 0 ? handleRestoreSamples : undefined}
            />
          )}
        </section>
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-slate-200/60 bg-white/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">Orbit</span>
            <span>— Seu copiloto de estudos diários</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido com carinho para estudantes</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>• Dados salvos automaticamente no seu navegador</span>
          </div>
        </div>
      </footer>

      {/* Modal de Formulário (Criação e Edição) */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={handleSaveObjective}
        editingObjective={editingObjective}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(objectiveToDelete)}
        objective={objectiveToDelete}
        onClose={() => setObjectiveToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />

      {/* Notificação Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
