export interface Essay {
  slug: string;
  title: string;
  url: string;
  description: string;
  type: EssayType;
  tags: string[];
  date: string;
  wordCount: number;
  readingTime: number;
  content: string;
  contentMarkdown: string;
}

export type EssayType =
  | 'hub'
  | 'foundational'
  | 'core'
  | 'theoretical'
  | 'applied'
  | 'empirical'
  | 'practice';

export interface GraphNode {
  id: string;
  label: string;
  url: string;
  defines: string[];
  type: string;
  themes: string[];
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'core' | 'soft';
  label: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface SiteMetadata {
  site: {
    title: string;
    description: string;
    author: string;
    baseURL: string;
  };
  essays: {
    total: number;
  };
  endpoints: {
    essays: string;
    metadata: string;
    llmsSummary: string;
    llmsFull: string;
    graph: string;
  };
  lastUpdated: string;
}
