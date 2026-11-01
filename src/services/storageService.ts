import { StudyObjective, ObjectiveFormData, ResourceLink, LinkType } from '../types/objective';

const STORAGE_KEY = 'orbit_study_objectives_v1';

export function detectLinkType(url: string): LinkType {
  const cleanUrl = url.toLowerCase();
  if (
    cleanUrl.includes('drive.google.com') ||
    cleanUrl.includes('docs.google.com') ||
    cleanUrl.includes('sheets.google.com') ||
    cleanUrl.includes('dropbox.com') ||
    cleanUrl.includes('onedrive.live.com')
  ) {
    return 'drive';
  }
  if (
    cleanUrl.includes('udemy.com') ||
    cleanUrl.includes('coursera.org') ||
    cleanUrl.includes('alura.com.br') ||
    cleanUrl.includes('youtube.com') ||
    cleanUrl.includes('edx.org') ||
    cleanUrl.includes('dio.me') ||
    cleanUrl.includes('hotmart.com') ||
    cleanUrl.includes('curso') ||
    cleanUrl.includes('class')
  ) {
    return 'course';
  }
  return 'general';
}

// Exemplos iniciais realistas e acolhedores para estudantes
const INITIAL_SAMPLE_OBJECTIVES: StudyObjective[] = [
  {
    id: 'orbit-sample-1',
    title: 'Dominar Estruturas de Dados e Algoritmos',
    description: 'Revisar conceitos fundamentais: listas ligadas, árvores binárias e algoritmos de busca para as provas da faculdade e entrevistas técnicas.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in_progress',
    category: 'Faculdade / Computação',
    links: [
      {
        id: 'l1',
        title: 'Pasta com Resumos e PDFs (Google Drive)',
        url: 'https://drive.google.com',
        type: 'drive',
      },
      {
        id: 'l2',
        title: 'Curso Online de Algoritmos (YouTube)',
        url: 'https://www.youtube.com',
        type: 'course',
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'orbit-sample-2',
    title: 'Simulado de Redação e Atualidades',
    description: 'Produzir 2 textos dissertativos-argumentativos com foco na estrutura padrão e repertório sociocultural.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'not_started',
    category: 'Vestibular / Concurso',
    links: [
      {
        id: 'l3',
        title: 'Folha de Redação e Modelos Nota 1000',
        url: 'https://docs.google.com',
        type: 'drive',
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'orbit-sample-3',
    title: 'Artigo Científico: Metodologia e Revisão Bibliográfica',
    description: 'Finalizar o levantamento de referências e escrita do capítulo de metodologia para o TCC.',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'completed',
    category: 'Pós / Graduação',
    links: [
      {
        id: 'l4',
        title: 'Mendeley / Pasta de Artigos no Drive',
        url: 'https://drive.google.com',
        type: 'drive',
      },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  getObjectives(): StudyObjective[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Inicializa com dados de exemplo amigáveis se for a primeira vez
        this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
        return INITIAL_SAMPLE_OBJECTIVES;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  addObjective(data: ObjectiveFormData): StudyObjective {
    const objectives = this.getObjectives();
    const now = new Date().toISOString();
    
    // Processa links identificando o tipo automaticamente se não preenchido
    const processedLinks: ResourceLink[] = data.links.map((link) => ({
      ...link,
      type: link.type || detectLinkType(link.url),
    }));

    const newObjective: StudyObjective = {
      id: 'orbit-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      category: data.category.trim() || 'Geral',
      links: processedLinks,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newObjective, ...objectives];
    this.saveObjectives(updated);
    return newObjective;
  },

  updateObjective(id: string, data: ObjectiveFormData): StudyObjective | null {
    const objectives = this.getObjectives();
    const index = objectives.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const processedLinks: ResourceLink[] = data.links.map((link) => ({
      ...link,
      type: link.type || detectLinkType(link.url),
    }));

    const updatedObjective: StudyObjective = {
      ...objectives[index],
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      category: data.category.trim() || 'Geral',
      links: processedLinks,
      updatedAt: new Date().toISOString(),
    };

    objectives[index] = updatedObjective;
    this.saveObjectives(objectives);
    return updatedObjective;
  },

  deleteObjective(id: string): boolean {
    const objectives = this.getObjectives();
    const filtered = objectives.filter((item) => item.id !== id);
    if (filtered.length !== objectives.length) {
      this.saveObjectives(filtered);
      return true;
    }
    return false;
  },

  updateStatus(id: string, newStatus: StudyObjective['status']): StudyObjective | null {
    const objectives = this.getObjectives();
    const target = objectives.find((item) => item.id === id);
    if (!target) return null;

    target.status = newStatus;
    target.updatedAt = new Date().toISOString();
    this.saveObjectives(objectives);
    return target;
  },

  resetToDefaultSample(): StudyObjective[] {
    this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
    return INITIAL_SAMPLE_OBJECTIVES;
  },

  clearAll(): void {
    this.saveObjectives([]);
  },
};
