import { z } from 'zod';
import type { MolsenApiClient } from '../api/client.js';

export const listEssaysSchema = z.object({
  type: z
    .enum(['hub', 'foundational', 'core', 'theoretical', 'applied', 'empirical', 'practice', 'all'])
    .optional()
    .default('all')
    .describe('Filter by essay type'),
  tags: z
    .array(z.string())
    .optional()
    .describe('Filter by tags (e.g., ["AI Governance", "Professional Practice"])'),
  frameworkOnly: z
    .boolean()
    .optional()
    .default(false)
    .describe('Return only framework essays in reading order'),
  includeContent: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include full essay content in response'),
});

export type ListEssaysInput = z.infer<typeof listEssaysSchema>;

// Framework essays in reading order
const FRAMEWORK_ORDER = [
  'making-ai-make-sense',
  'knowledge-as-capability',
  'agent-relative-tacitness',
  'tacit-space-shrinkage',
  'ai-oracle-vs-assistant',
  'strong-oracle-trap',
  'executable-knowledge-architecture',
  'capability-governance',
  'agentic-ai-universal-interface',
  'automating-expertise-gets-easier',
  'ontology-generation',
  'what-benchmarks-arent-measuring',
  'ai-first-software',
];

export async function listEssays(client: MolsenApiClient, input: ListEssaysInput) {
  let essays = await client.getEssays();

  if (input.frameworkOnly) {
    const orderMap = new Map(FRAMEWORK_ORDER.map((slug, i) => [slug, i]));
    essays = essays
      .filter(e => orderMap.has(e.slug))
      .sort((a, b) => (orderMap.get(a.slug) ?? 999) - (orderMap.get(b.slug) ?? 999));
  }

  if (input.type && input.type !== 'all') {
    essays = essays.filter(e => e.type === input.type);
  }

  if (input.tags?.length) {
    essays = essays.filter(e =>
      input.tags!.some(tag =>
        e.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      )
    );
  }

  const formatted = essays.map(e => ({
    slug: e.slug,
    title: e.title,
    url: e.url,
    description: e.description,
    type: e.type,
    tags: e.tags,
    date: e.date,
    wordCount: e.wordCount,
    ...(input.includeContent && { content: e.content }),
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(formatted, null, 2),
      },
    ],
  };
}
