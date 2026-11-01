import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  Trash2,
  FolderOpen,
  GraduationCap,
  Globe,
  Tag,
} from 'lucide-react';
import { StudyObjective, ObjectiveStatus, ResourceLink } from '../types/objective';
import { getDeadlineInfo } from '../utils/dateUtils';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDeleteRequest: (objective: StudyObjective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const isCompleted = objective.status === 'completed';
  const deadlineInfo = getDeadlineInfo(objective.deadline, isCompleted);

  // Status visual configs
  const statusConfig = {
    not_started: {
      label: 'A Iniciar',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      icon: AlertCircle,
      nextStatus: 'in_progress' as ObjectiveStatus,
      nextLabel: 'Iniciar meta',
    },
    in_progress: {
      label: 'Em Andamento',
      bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
      icon: Clock,
      nextStatus: 'completed' as ObjectiveStatus,
      nextLabel: 'Marcar concluído',
    },
    completed: {
      label: 'Concluído',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icon: CheckCircle2,
      nextStatus: 'not_started' as ObjectiveStatus,
      nextLabel: 'Reabrir meta',
    },
  }[objective.status];

  const StatusIcon = statusConfig.icon;

  const renderLinkIcon = (type?: ResourceLink['type']) => {
    switch (type) {
      case 'drive':
        return <FolderOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'course':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div
      className={`group relative rounded-2xl p-5 sm:p-6 transition-all duration-200 border bg-white ${
        isCompleted
          ? 'border-emerald-200/60 bg-gradient-to-b from-white to-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200/80 hover:border-rose-300 shadow-xs hover:shadow-md'
          : 'border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md hover:shadow-indigo-500/5'
      }`}
    >
      {/* Header: Category & Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {objective.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
              <Tag className="w-3 h-3 text-slate-400" />
              {objective.category}
            </span>
          )}

          {/* Status Badge with quick-toggle click */}
          <button
            onClick={() => onStatusChange(objective.id, statusConfig.nextStatus)}
            title={`Clique para avançar: ${statusConfig.nextLabel}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${statusConfig.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(objective)}
            aria-label={`Editar objetivo ${objective.title}`}
            title="Editar objetivo"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteRequest(objective)}
            aria-label={`Excluir objetivo ${objective.title}`}
            title="Excluir objetivo"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        className={`text-base sm:text-lg font-bold font-display text-slate-900 leading-snug mb-2 ${
          isCompleted ? 'line-through text-slate-500 decoration-slate-400' : ''
        }`}
      >
        {objective.title}
      </h3>

      {/* Description */}
      {objective.description && (
        <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed whitespace-pre-line">
          {objective.description}
        </p>
      )}

      {/* Links de Material e Cursos (Google Drive / Online Courses) */}
      {objective.links && objective.links.length > 0 && (
        <div className="mb-4 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block mb-1.5">
            Materiais e Links Anexados ({objective.links.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {objective.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Abrir ${link.url}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors max-w-full truncate"
              >
                {renderLinkIcon(link.type)}
                <span className="truncate max-w-[200px]">{link.title || link.url}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Deadline & Quick status toggle button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Deadline badge */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`font-medium ${
              deadlineInfo.isOverdue
                ? 'text-rose-600 font-semibold'
                : deadlineInfo.isToday
                ? 'text-amber-600 font-semibold'
                : deadlineInfo.isUrgent
                ? 'text-amber-700 font-medium'
                : 'text-slate-500'
            }`}
          >
            {deadlineInfo.text}
          </span>
        </div>

        {/* Quick progression shortcut button */}
        <button
          onClick={() => onStatusChange(objective.id, statusConfig.nextStatus)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 transition-colors cursor-pointer"
        >
          {isCompleted ? 'Reabrir' : objective.status === 'not_started' ? 'Iniciar →' : 'Concluir ✓'}
        </button>
      </div>
    </div>
  );
};
