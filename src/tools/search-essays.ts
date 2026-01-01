import { z } from 'zod';
import type { MolsenApiClient } from '../api/client.js';

export const searchEssaysSchema = z.object({
  query: z.string().describe('Search query to match against title, description, and content'),
  tags: z.array(z.string()).optional().describe('Filter results by tags'),
  type: z
    .enum(['hub', 'foundational', 'core', 'theoretical', 'applied', 'empirical', 'practice'])
    .optional()
    .describe('Filter results by essay type'),
  limit: z.number().optional().default(10).describe('Maximum number of results'),
});

export type SearchEssaysInput = z.infer<typeof searchEssaysSchema>;

function extractSnippet(content: string, query: string, contextChars = 150): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) return content.slice(0, 200) + '...';

  const start = Math.max(0, index - contextChars);
  const end = Math.min(content.length, index + query.length + contextChars);

  return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '');
}

export async function searchEssays(client: MolsenApiClient, input: SearchEssaysInput) {
  const results = await client.searchEssays(input.query, {
    tags: input.tags,
    type: input.type,
  });

  const limited = results.slice(0, input.limit);

  const formatted = limited.map(e => ({
    slug: e.slug,
    title: e.title,
    description: e.description,
    type: e.type,
    tags: e.tags,
    url: e.url,
    snippet: extractSnippet(e.content, input.query),
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            query: input.query,
            totalMatches: results.length,
            results: formatted,
          },
          null,
          2
        ),
      },
    ],
  };
}
