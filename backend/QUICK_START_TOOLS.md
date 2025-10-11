# Quick Start: Web Search Tool

## Installation

1. Install the new dependency:
```bash
cd backend
source venv/bin/activate
pip install duckduckgo-search==7.1.1
```

2. (Optional) For production use, set API keys for premium providers:
```bash
# In backend/.env
TAVILY_API_KEY=your_tavily_key_here
SERPAPI_API_KEY=your_serpapi_key_here
```

## Usage Example

```python
from src.agents.agent_factory import AgentFactory
from src.core.models import AgentType
from src.tools.registry import ToolRegistry
from src.tools.web_search import WebSearchTool

# Create tool registry
registry = ToolRegistry()

# Register web search tool (DuckDuckGo - no API key needed)
web_search = WebSearchTool(provider="duckduckgo")
registry.register(web_search)

# Create agent with tools
agent = AgentFactory.create_agent(
    agent_type=AgentType.CLAUDE_MAIN,
    tool_registry=registry
)

# Execute web search
result = await agent.execute_tool(
    "web_search",
    query="latest AI developments",
    num_results=5,
    search_type="general"  # "general", "news", or "images"
)

if result.success:
    for item in result.data['results']:
        print(f"{item['title']}: {item['url']}")
        print(f"{item['snippet']}\n")
```

## Testing

Run the examples:
```bash
cd backend
source venv/bin/activate
python3 -m examples.web_search_example
```

## Integration with Task Orchestrator

To add tools to your orchestrator, modify the agent creation in `task_orchestrator.py`:

```python
# In TaskOrchestrator.__init__()
from src.tools.registry import ToolRegistry
from src.tools.web_search import WebSearchTool

self.tool_registry = ToolRegistry()
self.tool_registry.register(WebSearchTool(provider="duckduckgo"))

# Then pass the registry when creating agents:
self.main_agent = AgentFactory.create_main_agent(
    session_id=self.session_id,
    tool_registry=self.tool_registry
)
```

## What Was Fixed

**Frontend Issue**: The "Export to PDF" button wasn't appearing after task completion because:
- The `MessageBubble` component was memoized and didn't re-render when `isProcessing` changed
- **Solution**: Pass `isProcessing` as a prop instead of reading from store inside memoized component

**Files Changed**:
- `frontend/src/components/MessageBubble.tsx` - Now accepts `isProcessing` as prop
- `frontend/src/components/ChatWindow.tsx` - Passes `isProcessing` to MessageBubble

The PDF export button will now appear correctly when generation completes!

## Architecture

```
backend/src/tools/
├── __init__.py          # Module exports
├── base.py              # BaseTool, ToolResult, ToolParameter
├── registry.py          # ToolRegistry (central management)
└── web_search.py        # WebSearchTool (DuckDuckGo, Tavily, SerpAPI)
```

## Search Providers

| Provider | API Key Required | Cost | Best For |
|----------|------------------|------|----------|
| DuckDuckGo | ❌ No | Free | Development, basic search |
| Tavily | ✅ Yes | Paid | Production, AI-optimized |
| SerpAPI | ✅ Yes | Paid | Real Google results |

## Next Steps

1. **Install the dependency**: `pip install duckduckgo-search==7.1.1`
2. **Test it**: Run `python3 -m examples.web_search_example`
3. **Integrate**: Add tool registry to your orchestrator
4. **Extend**: Create custom tools using `BaseTool`

For full documentation, see `README_TOOLS.md`.

