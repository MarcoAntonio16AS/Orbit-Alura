export type ObjectiveStatus = 'not_started' | 'in_progress' | 'completed';

export type LinkType = 'drive' | 'course' | 'article' | 'general';

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type?: LinkType;
}

export interface StudyObjective {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: ObjectiveStatus;
  links: ResourceLink[];
  category?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type StatusFilter = 'all' | ObjectiveStatus;

export type SortOption = 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'title_asc';

export interface ObjectiveFormData {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
  category: string;
  links: ResourceLink[];
}
