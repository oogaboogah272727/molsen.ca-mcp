import type { Essay, KnowledgeGraph, SiteMetadata } from './types.js';

const BASE_URL = 'https://molsen.ca';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class MolsenApiClient {
  private cache = new Map<string, CacheEntry<unknown>>();

  private async fetchWithCache<T>(path: string): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const cached = this.cache.get(url);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as T;
    this.cache.set(url, { data, timestamp: Date.now() });
    return data;
  }

  async getEssays(): Promise<Essay[]> {
    return this.fetchWithCache<Essay[]>('/api/essays.json');
  }

  async getEssay(slug: string): Promise<Essay | null> {
    const essays = await this.getEssays();
    return essays.find(e => e.slug === slug) ?? null;
  }

  async getGraph(): Promise<KnowledgeGraph> {
    return this.fetchWithCache<KnowledgeGraph>('/js/knowledge-graph.json');
  }

  async getMetadata(): Promise<SiteMetadata> {
    return this.fetchWithCache<SiteMetadata>('/api/metadata.json');
  }

  async searchEssays(
    query: string,
    options?: { tags?: string[]; type?: string }
  ): Promise<Essay[]> {
    let essays = await this.getEssays();

    // Filter by tags
    if (options?.tags?.length) {
      essays = essays.filter(e =>
        options.tags!.some(tag =>
          e.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }

    // Filter by type
    if (options?.type) {
      essays = essays.filter(e => e.type === options.type);
    }

    // Full-text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      essays = essays.filter(e =>
        e.title.toLowerCase().includes(lowerQuery) ||
        e.description.toLowerCase().includes(lowerQuery) ||
        e.content.toLowerCase().includes(lowerQuery)
      );
    }

    return essays;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
