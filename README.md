# molsen.ca-mcp

MCP server for accessing [molsen.ca](https://molsen.ca) essay content. Exposes Mike Olsen's essays on AI governance, professional accountability, and the future of technical work to LLMs via the Model Context Protocol.

## Installation

```bash
npm install -g molsen.ca-mcp
```

Or run directly with npx:

```bash
npx molsen.ca-mcp
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "molsen-essays": {
      "command": "npx",
      "args": ["-y", "molsen.ca-mcp"]
    }
  }
}
```

## Usage with Claude Code

Add to your Claude Code MCP settings or use the included skill.

## Available Tools

### list_essays

List essays from molsen.ca with optional filtering.

**Parameters:**
- `type` (optional): Filter by type - `hub`, `foundational`, `core`, `theoretical`, `applied`, `empirical`, `practice`, or `all`
- `tags` (optional): Filter by tags array
- `frameworkOnly` (optional): Return only framework essays in reading order
- `includeContent` (optional): Include full essay content

### get_essay

Retrieve a specific essay by slug.

**Parameters:**
- `slug` (required): Essay slug (e.g., "executable-knowledge-architecture")
- `format` (optional): `full`, `summary`, or `markdown`

### search_essays

Search essays by keyword.

**Parameters:**
- `query` (required): Search query
- `tags` (optional): Filter by tags
- `type` (optional): Filter by type
- `limit` (optional): Max results (default 10)

### get_framework_overview

Get an overview of the "Making AI Make Sense" framework.

**Parameters:**
- `depth` (optional): `overview`, `detailed`, or `full`

### get_knowledge_graph

Get relationships between essays.

**Parameters:**
- `essay` (optional): Get connections for a specific essay (use short ID like "eka")
- `connectionType` (optional): `core`, `soft`, or `all`

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Run built version
npm start
```

## License

MIT
