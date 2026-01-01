import { z } from 'zod';
import type { MolsenApiClient } from '../api/client.js';

export const getEssaySchema = z.object({
  slug: z.string().describe('Essay slug (e.g., "executable-knowledge-architecture")'),
  format: z
    .enum(['full', 'summary', 'markdown'])
    .optional()
    .default('full')
    .describe('Response format: full (plain text), summary (metadata only), markdown (raw)'),
});

export type GetEssayInput = z.infer<typeof getEssaySchema>;

export async function getEssay(client: MolsenApiClient, input: GetEssayInput) {
  const essay = await client.getEssay(input.slug);

  if (!essay) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Essay not found: ${input.slug}. Use list_essays to see available essays.`,
        },
      ],
      isError: true,
    };
  }

  let response: string;

  switch (input.format) {
    case 'summary':
      response = JSON.stringify(
        {
          title: essay.title,
          description: essay.description,
          type: essay.type,
          tags: essay.tags,
          date: essay.date,
          url: essay.url,
          wordCount: essay.wordCount,
          readingTime: essay.readingTime,
        },
        null,
        2
      );
      break;

    case 'markdown':
      response = essay.contentMarkdown || essay.content;
      break;

    case 'full':
    default:
      response =
        `# ${essay.title}\n\n` +
        `> ${essay.description}\n\n` +
        `Type: ${essay.type} | Tags: ${essay.tags.join(', ')} | Date: ${essay.date}\n` +
        `URL: ${essay.url}\n\n---\n\n` +
        essay.content;
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: response,
      },
    ],
  };
}
