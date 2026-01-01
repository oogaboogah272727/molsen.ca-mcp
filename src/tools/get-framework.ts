import { z } from 'zod';
import type { MolsenApiClient } from '../api/client.js';

export const getFrameworkSchema = z.object({
  depth: z
    .enum(['overview', 'detailed', 'full'])
    .optional()
    .default('overview')
    .describe(
      'Level of detail: overview (titles/descriptions), detailed (includes structure), full (includes all content)'
    ),
});

export type GetFrameworkInput = z.infer<typeof getFrameworkSchema>;

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

export async function getFrameworkOverview(client: MolsenApiClient, input: GetFrameworkInput) {
  const essays = await client.getEssays();

  const orderMap = new Map(FRAMEWORK_ORDER.map((slug, i) => [slug, i]));
  const frameworkEssays = essays
    .filter(e => orderMap.has(e.slug))
    .sort((a, b) => (orderMap.get(a.slug) ?? 999) - (orderMap.get(b.slug) ?? 999));

  let response: unknown;

  switch (input.depth) {
    case 'overview':
      response = {
        title: 'Making AI Make Sense Framework',
        description:
          "A framework for deploying AI where it's strong and routing around where it's weak.",
        hub: {
          slug: 'making-ai-make-sense',
          title: frameworkEssays.find(e => e.slug === 'making-ai-make-sense')?.title,
          url: frameworkEssays.find(e => e.slug === 'making-ai-make-sense')?.url,
        },
        essays: frameworkEssays.map(e => ({
          slug: e.slug,
          title: e.title,
          type: e.type,
          description: e.description,
        })),
        readingOrder: FRAMEWORK_ORDER,
      };
      break;

    case 'detailed': {
      const byType = {
        hub: frameworkEssays.filter(e => e.type === 'hub'),
        foundational: frameworkEssays.filter(e => e.type === 'foundational'),
        theoretical: frameworkEssays.filter(e => e.type === 'theoretical'),
        core: frameworkEssays.filter(e => e.type === 'core'),
        applied: frameworkEssays.filter(e => e.type === 'applied'),
      };

      response = {
        title: 'Making AI Make Sense Framework',
        structure: {
          hub: byType.hub.map(e => ({
            slug: e.slug,
            title: e.title,
            description: e.description,
          })),
          foundational: byType.foundational.map(e => ({
            slug: e.slug,
            title: e.title,
            description: e.description,
          })),
          theoretical: byType.theoretical.map(e => ({
            slug: e.slug,
            title: e.title,
            description: e.description,
          })),
          core: byType.core.map(e => ({
            slug: e.slug,
            title: e.title,
            description: e.description,
          })),
          applied: byType.applied.map(e => ({
            slug: e.slug,
            title: e.title,
            description: e.description,
          })),
        },
        readingOrder: FRAMEWORK_ORDER,
      };
      break;
    }

    case 'full':
      response = {
        title: 'Making AI Make Sense Framework',
        essays: frameworkEssays.map(e => ({
          slug: e.slug,
          title: e.title,
          type: e.type,
          description: e.description,
          content: e.content,
        })),
        readingOrder: FRAMEWORK_ORDER,
      };
      break;
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
  };
}
