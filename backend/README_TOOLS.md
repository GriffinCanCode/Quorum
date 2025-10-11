# Tool Registry System

The Quorum agent system includes a comprehensive tool registry that allows agents to access external capabilities like web search.

## Features

- **Extensible Tool System**: Easy-to-use base class for creating custom tools
- **Tool Registry**: Central registry for managing and organizing tools
- **Web Search**: Built-in web search tool with multiple provider support
- **LangChain Integration**: Seamless integration with LangChain's function calling
- **Multiple Providers**: Support for DuckDuckGo (free), Tavily, and SerpAPI

## Quick Start

### Basic Usage

```python
from src.agents.agent_factory import AgentFactory
from src.core.models import AgentType
from src.tools.registry import ToolRegistry
from src.tools.web_search import WebSearchTool

# Create tool registry
registry = ToolRegistry()

# Register web search tool
web_search = WebSearchTool(provider="duckduckgo")
registry.register(web_search)

# Create agent with tools
agent = AgentFactory.create_agent(
    agent_type=AgentType.CLAUDE_MAIN,
    tool_registry=registry
)

# Execute tool
result = await agent.execute_tool(
    "web_search",
    query="latest AI developments",
    num_results=5
)

if result.success:
    for item in result.data['results']:
        print(f"{item['title']}: {item['url']}")
```

## Web Search Tool

### Providers

#### DuckDuckGo (Default - No API Key Required)

```python
web_search = WebSearchTool(provider="duckduckgo")
```

- **Pros**: Free, no API key needed, privacy-focused
- **Cons**: Rate limited, less control over results
- **Installation**: `pip install duckduckgo-search`

#### Tavily (Recommended for Production)

```python
web_search = WebSearchTool(provider="tavily", api_key="your_api_key")
# Or set TAVILY_API_KEY environment variable
```

- **Pros**: AI-optimized search, advanced features, reliable
- **Cons**: Requires paid API key
- **Get API Key**: https://tavily.com

#### SerpAPI (Google Search Results)

```python
web_search = WebSearchTool(provider="serpapi", api_key="your_api_key")
# Or set SERPAPI_API_KEY environment variable
```

- **Pros**: Real Google results, comprehensive data
- **Cons**: Requires paid API key
- **Get API Key**: https://serpapi.com

### Search Types

```python
# General web search
result = await agent.execute_tool(
    "web_search",
    query="Python programming",
    num_results=5,
    search_type="general"
)

# News search
result = await agent.execute_tool(
    "web_search",
    query="tech news today",
    num_results=5,
    search_type="news"
)

# Image search
result = await agent.execute_tool(
    "web_search",
    query="sunset photos",
    num_results=5,
    search_type="images"
)
```

## Creating Custom Tools

### Step 1: Implement BaseTool

```python
from src.tools.base import BaseTool, ToolResult, ToolParameter
from typing import List

class MyCustomTool(BaseTool):
    @property
    def name(self) -> str:
        return "my_custom_tool"
    
    @property
    def description(self) -> str:
        return "Description of what your tool does"
    
    @property
    def parameters(self) -> List[ToolParameter]:
        return [
            ToolParameter(
                name="param1",
                type="string",
                description="First parameter",
                required=True
            ),
            ToolParameter(
                name="param2",
                type="number",
                description="Second parameter",
                required=False,
                default=10
            )
        ]
    
    async def execute(self, param1: str, param2: int = 10, **kwargs) -> ToolResult:
        try:
            # Your tool logic here
            result = f"Processed {param1} with {param2}"
            
            return ToolResult(
                success=True,
                data={"result": result},
                metadata={"param1": param1, "param2": param2}
            )
        except Exception as e:
            return ToolResult(
                success=False,
                error=str(e)
            )
```

### Step 2: Register and Use

```python
# Register your tool
registry = ToolRegistry()
registry.register(MyCustomTool())

# Create agent with tool
agent = AgentFactory.create_agent(
    agent_type=AgentType.CLAUDE_MAIN,
    tool_registry=registry
)

# Execute tool
result = await agent.execute_tool("my_custom_tool", param1="test", param2=20)
```

## Global Registry Pattern

For applications where tools should be shared across all agents:

```python
from src.tools.registry import get_tool_registry

# Get global registry (singleton)
registry = get_tool_registry()

# Register tools once
registry.register(WebSearchTool())

# All agents can access the same registry
agent1 = AgentFactory.create_agent(
    agent_type=AgentType.CLAUDE_MAIN,
    tool_registry=registry
)

agent2 = AgentFactory.create_agent(
    agent_type=AgentType.GPT5,
    tool_registry=registry
)
```

## Integration with Orchestrator

To add tools to the task orchestrator:

```python
from src.core.orchestrator.task_orchestrator import TaskOrchestrator
from src.tools.registry import ToolRegistry
from src.tools.web_search import WebSearchTool

# Create registry with tools
registry = ToolRegistry()
registry.register(WebSearchTool(provider="duckduckgo"))

# Create orchestrator and pass registry to agents
orchestrator = TaskOrchestrator(session_id="your_session")

# When creating agents in orchestrator, pass the registry
# (You may need to modify task_orchestrator.py to accept tool_registry parameter)
```

## Environment Variables

Create a `.env` file in the backend directory:

```bash
# Web Search API Keys (optional, only if not using DuckDuckGo)
TAVILY_API_KEY=your_tavily_api_key_here
SERPAPI_API_KEY=your_serpapi_key_here
```

## Tool Result Format

All tools return a `ToolResult` object:

```python
class ToolResult:
    success: bool           # Whether the tool execution succeeded
    data: Any              # Tool output data (None if failed)
    error: str | None      # Error message if failed
    metadata: dict         # Additional metadata
    timestamp: datetime    # Execution timestamp
```

## Examples

Run the examples:

```bash
cd backend
source venv/bin/activate
python3 -m examples.web_search_example
```

## Best Practices

1. **Error Handling**: Always check `result.success` before using `result.data`
2. **Parameter Validation**: Use the built-in parameter validation
3. **Logging**: Tools automatically log execution through the logging system
4. **Rate Limiting**: Be mindful of API rate limits for paid providers
5. **Caching**: Consider implementing caching for frequently used queries
6. **Security**: Never expose API keys in code, use environment variables

## Troubleshooting

### DuckDuckGo Search Not Working

Install the required dependency:
```bash
pip install duckduckgo-search
```

### Tool Not Found

Make sure the tool is registered before creating the agent:
```python
registry = ToolRegistry()
registry.register(WebSearchTool())  # Register BEFORE creating agent
agent = AgentFactory.create_agent(..., tool_registry=registry)
```

### API Key Issues

Check that environment variables are set:
```python
import os
print(os.getenv("TAVILY_API_KEY"))  # Should not be None
```

## Future Tools

Ideas for additional tools to implement:

- **Calculator**: Math operations and computations
- **Code Executor**: Safe code execution in sandboxed environment
- **Database Query**: Direct database access for agents
- **API Caller**: Generic HTTP API calling tool
- **File Operations**: Read/write files with permissions
- **Image Generation**: DALL-E or Stable Diffusion integration
- **Document Parser**: Extract text from PDFs, Word docs, etc.

## Contributing

To add a new tool:

1. Create a new file in `backend/src/tools/`
2. Inherit from `BaseTool`
3. Implement required methods
4. Add to `__init__.py`
5. Write tests
6. Update this documentation

