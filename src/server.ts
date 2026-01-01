import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { MolsenApiClient } from './api/client.js';
import {
  listEssays,
  listEssaysSchema,
  getEssay,
  getEssaySchema,
  searchEssays,
  searchEssaysSchema,
  getFrameworkOverview,
  getFrameworkSchema,
  getKnowledgeGraph,
  getGraphSchema,
} from './tools/index.js';

export function createServer() {
  const server = new McpServer({
    name: 'molsen.ca-mcp',
    version: '1.0.0',
  });

  const client = new MolsenApiClient();

  // list_essays
  server.tool(
    'list_essays',
    'List essays from molsen.ca. Can filter by type, tags, or get framework essays in reading order.',
    listEssaysSchema.shape,
    async (input) => listEssays(client, input as Parameters<typeof listEssays>[1])
  );

  // get_essay
  server.tool(
    'get_essay',
    'Retrieve a specific essay by its slug. Returns full content, summary, or markdown format.',
    getEssaySchema.shape,
    async (input) => getEssay(client, input as Parameters<typeof getEssay>[1])
  );

  // search_essays
  server.tool(
    'search_essays',
    'Search essays by keyword. Searches title, description, and content.',
    searchEssaysSchema.shape,
    async (input) => searchEssays(client, input as Parameters<typeof searchEssays>[1])
  );

  // get_framework_overview
  server.tool(
    'get_framework_overview',
    'Get an overview of the "Making AI Make Sense" framework with its essays and structure.',
    getFrameworkSchema.shape,
    async (input) => getFrameworkOverview(client, input as Parameters<typeof getFrameworkOverview>[1])
  );

  // get_knowledge_graph
  server.tool(
    'get_knowledge_graph',
    'Get the knowledge graph showing relationships between essays. Optionally filter by essay or connection type.',
    getGraphSchema.shape,
    async (input) => getKnowledgeGraph(client, input as Parameters<typeof getKnowledgeGraph>[1])
  );

  return server;
}
