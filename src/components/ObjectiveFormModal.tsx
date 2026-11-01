import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  FolderOpen,
  GraduationCap,
  Globe,
  Sparkles,
} from 'lucide-react';
import {
  StudyObjective,
  ObjectiveFormData,
  ObjectiveStatus,
  ResourceLink,
} from '../types/objective';
import { detectLinkType } from '../services/storageService';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectiveFormData, id?: string) => void;
  editingObjective?: StudyObjective | null;
}

const CATEGORY_SUGGESTIONS = [
  'Faculdade',
  'Concurso Público',
  'Vestibular / ENEM',
  'Curso Livre / Tech',
  'Pós-Graduação',
  'TCC & Artigos',
  'Idiomas',
];

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingObjective,
}) => {
  const isEditing = Boolean(editingObjective);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('not_started');
  const [category, setCategory] = useState('');
  const [links, setLinks] = useState<ResourceLink[]>([]);

  // Input states para novo link
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Erros de validação
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    if (editingObjective) {
      setTitle(editingObjective.title);
      setDescription(editingObjective.description || '');
      setDeadline(editingObjective.deadline || '');
      setStatus(editingObjective.status || 'not_started');
      setCategory(editingObjective.category || '');
      setLinks(editingObjective.links || []);
    } else {
      // Default para novo objetivo: data daqui a 7 dias
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setTitle('');
      setDescription('');
      setDeadline(defaultDate);
      setStatus('not_started');
      setCategory('Faculdade');
      setLinks([]);
    }
    setNewLinkTitle('');
    setNewLinkUrl('');
    setErrors({});
  }, [editingObjective, isOpen]);

  if (!isOpen) return null;

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;

    let formattedUrl = newLinkUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const type = detectLinkType(formattedUrl);
    const newLink: ResourceLink = {
      id: 'link-' + Date.now().toString(36),
      title: newLinkTitle.trim() || (type === 'drive' ? 'Material no Google Drive' : 'Link de Estudo'),
      url: formattedUrl,
      type,
    };

    setLinks([...links, newLink]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleDateShortcut = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    setDeadline(target.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, insira o título do seu objetivo de estudo.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, escolha uma data limite para o objetivo.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Se o usuário digitou uma URL no formulário de link mas não clicou em "Adicionar", adiciona automaticamente
    let finalLinks = [...links];
    if (newLinkUrl.trim()) {
      let formattedUrl = newLinkUrl.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      finalLinks.push({
        id: 'link-' + Date.now().toString(36),
        title: newLinkTitle.trim() || 'Material Anexo',
        url: formattedUrl,
        type: detectLinkType(formattedUrl),
      });
    }

    onSubmit(
      {
        title: title.trim(),
        description: description.trim(),
        deadline,
        status,
        category: category.trim() || 'Geral',
        links: finalLinks,
      },
      editingObjective ? editingObjective.id : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Atualize os dados e acompanhe o ritmo do seu aprendizado'
                  : 'Defina sua meta com foco, prazo e seus materiais de apoio'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="Ex: Concluir Módulo de Direito Constitucional, Simulado ENEM..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                  : 'border-slate-200 bg-slate-50/40 focus:border-indigo-500 focus:bg-white'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.title}</p>
            )}
          </div>

          {/* Categoria / Área de Estudo */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Área ou Disciplina
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Faculdade, Concurso, Matemática, Programação..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/40 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
            />
            {/* Sugestões rápidas de categoria */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Sugestões:</span>
              {CATEGORY_SUGGESTIONS.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setCategory(sug)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    category === sug
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Prazo & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prazo */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Prazo de Conclusão <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline) setErrors({ ...errors, deadline: undefined });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.deadline
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                      : 'border-slate-200 bg-slate-50/40 focus:border-indigo-500 focus:bg-white'
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.deadline}</p>
              )}
              {/* Atalhos de data */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <button
                  type="button"
                  onClick={() => handleDateShortcut(0)}
                  className="text-[11px] text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
                >
                  Hoje
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleDateShortcut(3)}
                  className="text-[11px] text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
                >
                  +3 dias
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleDateShortcut(7)}
                  className="text-[11px] text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
                >
                  +1 semana
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleDateShortcut(30)}
                  className="text-[11px] text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
                >
                  +1 mês
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Status Atual
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatus('not_started')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    status === 'not_started'
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold shadow-xs ring-2 ring-amber-400/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  A Iniciar
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('in_progress')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    status === 'in_progress'
                      ? 'bg-blue-100 text-blue-900 border-blue-300 font-semibold shadow-xs ring-2 ring-blue-400/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Em Andamento
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('completed')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    status === 'completed'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold shadow-xs ring-2 ring-emerald-400/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Concluído
                </button>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Descrição e Detalhes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que será estudado, tópicos essenciais, metas de páginas ou capítulos..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-y"
            />
          </div>

          {/* Links e Materiais Anexados (Google Drive, Cursos, etc.) */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-indigo-600" />
                  Links de Cursos e Drive Pessoal
                </span>
                <p className="text-[11px] text-slate-500">
                  Anexe links de pastas do Google Drive, Docs, PDFs, YouTube ou plataformas de cursos
                </p>
              </div>
            </div>

            {/* Lista de links adicionados */}
            {links.length > 0 && (
              <div className="space-y-1.5">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {link.type === 'drive' ? (
                        <FolderOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : link.type === 'course' ? (
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="font-medium truncate">{link.title}</span>
                      <span className="text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">
                        ({link.url})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                      title="Remover link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar novo link */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Nome (ex: Apostila no Drive)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLinkUrl.trim()}
                  className="w-full h-full py-1.5 px-3 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Anexar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
