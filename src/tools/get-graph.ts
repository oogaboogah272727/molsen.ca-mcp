import { z } from 'zod';
import type { MolsenApiClient } from '../api/client.js';

export const getGraphSchema = z.object({
  essay: z.string().optional().describe('Optional: Get connections for a specific essay'),
  connectionType: z
    .enum(['core', 'soft', 'all'])
    .optional()
    .default('all')
    .describe('Filter by connection type'),
});

export type GetGraphInput = z.infer<typeof getGraphSchema>;

export async function getKnowledgeGraph(client: MolsenApiClient, input: GetGraphInput) {
  const graph = await client.getGraph();

  let links = graph.links;

  if (input.connectionType !== 'all') {
    links = links.filter(l => l.type === input.connectionType);
  }

  if (input.essay) {
    // Get connections for specific essay
    const incoming = links.filter(l => l.target === input.essay);
    const outgoing = links.filter(l => l.source === input.essay);

    const essayNode = graph.nodes.find(n => n.id === input.essay);

    if (!essayNode) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Essay not found in graph: ${input.essay}. Note: graph uses short IDs like "eka" not full slugs.`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              essay: essayNode,
              connections: {
                incoming: incoming.map(l => ({
                  from: graph.nodes.find(n => n.id === l.source),
                  relationship: l.label,
                  type: l.type,
                })),
                outgoing: outgoing.map(l => ({
                  to: graph.nodes.find(n => n.id === l.target),
                  relationship: l.label,
                  type: l.type,
                })),
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // Return full graph
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            nodes: graph.nodes,
            links: links,
          },
          null,
          2
        ),
      },
    ],
  };
}
