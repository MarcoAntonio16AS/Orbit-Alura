export function formatDatePtBr(dateString: string): string {
  if (!dateString) return 'Sem prazo';
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

export interface DeadlineInfo {
  text: string;
  isUrgent: boolean;
  isOverdue: boolean;
  isToday: boolean;
  isCompleted: boolean;
}

export function getDeadlineInfo(deadlineString: string, isCompleted: boolean): DeadlineInfo {
  if (isCompleted) {
    return {
      text: `Prazo era ${formatDatePtBr(deadlineString)}`,
      isUrgent: false,
      isOverdue: false,
      isToday: false,
      isCompleted: true,
    };
  }

  if (!deadlineString) {
    return {
      text: 'Sem data limite',
      isUrgent: false,
      isOverdue: false,
      isToday: false,
      isCompleted: false,
    };
  }

  const [year, month, day] = deadlineString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: overdueDays === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${overdueDays} dias`,
      isUrgent: true,
      isOverdue: true,
      isToday: false,
      isCompleted: false,
    };
  }

  if (diffDays === 0) {
    return {
      text: 'Vence hoje!',
      isUrgent: true,
      isOverdue: false,
      isToday: true,
      isCompleted: false,
    };
  }

  if (diffDays === 1) {
    return {
      text: 'Vence amanhã',
      isUrgent: true,
      isOverdue: false,
      isToday: false,
      isCompleted: false,
    };
  }

  if (diffDays <= 3) {
    return {
      text: `Faltam ${diffDays} dias`,
      isUrgent: true,
      isOverdue: false,
      isToday: false,
      isCompleted: false,
    };
  }

  if (diffDays <= 7) {
    return {
      text: `Falta 1 semana (${formatDatePtBr(deadlineString)})`,
      isUrgent: false,
      isOverdue: false,
      isToday: false,
      isCompleted: false,
    };
  }

  return {
    text: formatDatePtBr(deadlineString),
    isUrgent: false,
    isOverdue: false,
    isToday: false,
    isCompleted: false,
  };
}
