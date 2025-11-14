# NoOversight - Multi-Agent AI Platform

A production-ready platform enabling multiple AI agents (Claude, GPT, Gemini) to collaborate on complex tasks via OpenRouter's unified API. The system uses an intelligent orchestrator to delegate subtasks to specialized agents, synthesizing their responses into coherent solutions.

## Overview

NoOversight implements a lightweight, streaming-first architecture for multi-agent AI coordination. Unlike heavyweight frameworks (LangGraph, CrewAI, AutoGen), this system prioritizes maintainability, performance, and real-time user feedback through Server-Sent Events and asynchronous processing.

### Architecture

**Backend**
- FastAPI with async support
- OpenRouter for unified model access (Claude, GPT, Gemini, etc.)
- PostgreSQL for conversation persistence
- WebSocket and SSE for real-time streaming
- Tool system with web search capabilities

**Frontend**
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Framer Motion for animations
- Real-time message streaming

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL 13 or higher
- OpenRouter API key (get one at https://openrouter.ai/keys)

## Installation

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp config/env_template.txt .env
# Edit .env with your API keys and database credentials

# Initialize database
./scripts/setup_postgres.sh
./scripts/init_database.sh

# Start server
make run
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

### Quick Start with Make

From project root:
```bash
make setup    # Install all dependencies
make dev      # Start both backend and frontend
make test     # Run test suites
```

## Configuration

### Environment Variables

**Backend** (`.env` in backend directory):
```env
# API Keys
OPENROUTER_API_KEY=your_openrouter_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nooversight

# Server
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173

# Optional
LOG_LEVEL=INFO
MAX_SUB_AGENTS=3
```

**Frontend** (environment-specific):
- Development: Vite proxy auto-configured
- Production: Set `VITE_API_BASE_URL`

## Project Structure

```
backend/
├── src/
│   ├── agents/          # Agent implementations
│   ├── api/             # FastAPI routes
│   ├── core/            # Business logic
│   ├── infrastructure/  # Database, logging, tracking
│   ├── tools/           # Tool implementations
│   └── app.py          # Application entry point
├── tests/              # Test suite
└── scripts/            # Database setup scripts

frontend/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API clients
│   ├── store/          # State management
│   ├── styles/         # CSS modules
│   └── types/          # TypeScript definitions
└── dist/              # Production build
```

## API Reference

### Core Endpoints

**POST** `/api/tasks/execute`
Execute a task with optional agent collaboration.

Request:
```json
{
  "message": "string",
  "enable_collaboration": boolean,
  "max_sub_agents": number
}
```

**GET** `/api/conversations/{id}`
Retrieve conversation history.

**POST** `/api/conversations/{id}/messages`
Add message to existing conversation.

**GET** `/api/settings`
Retrieve system settings and model configurations.

**GET** `/health`
Health check with service status.

### WebSocket

**WS** `/ws`
Real-time bidirectional communication for streaming responses.

## Usage

### Basic Task Execution

```python
import requests

response = requests.post(
    "http://localhost:8000/api/tasks/execute",
    json={
        "message": "Analyze market trends for Q4",
        "enable_collaboration": True
    }
)
```

### Streaming with SSE

```javascript
const eventSource = new EventSource('/api/tasks/stream');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
source venv/bin/activate
pytest

# Frontend tests
cd frontend
npm test
```

### Database Management

```bash
# Reset database
cd backend
./scripts/reset_database.sh

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

### Code Quality

```bash
# Backend linting
cd backend
make lint

# Frontend linting
cd frontend
npm run lint
```

## Deployment

### Backend

```bash
cd backend
pip install -r requirements.frozen.txt
uvicorn src.app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

```bash
cd frontend
npm run build
# Deploy dist/ directory to static hosting
```

### Docker (if applicable)

```bash
docker-compose up -d
```

## Extending the System

### Adding New Agents

1. Define agent type in `backend/src/core/models.py`
2. Configure model mapping in `backend/src/agents/agent_factory.py`
3. Update frontend types in `frontend/src/types/index.ts`

### Adding New Tools

1. Create tool class in `backend/src/tools/`
2. Implement `BaseTool` interface
3. Register in `backend/src/tools/registry.py`

### Custom Agent Behavior

Modify system prompts and parameters in:
- `backend/src/agents/agent_factory.py` - Agent configuration
- `backend/src/core/orchestrator/task_orchestrator.py` - Orchestration logic

## Troubleshooting

**Database connection errors**: Verify PostgreSQL is running and credentials are correct in `.env`

**API key errors**: Ensure all required API keys are set in backend `.env` file

**Port conflicts**: Change `PORT` in backend `.env` or `vite.config.ts` for frontend

**WebSocket connection issues**: Check CORS settings and ensure backend is running

**Package installation errors**: Use `requirements.frozen.txt` for exact dependency versions

## Performance Considerations

- Database connection pooling configured for 20 concurrent connections
- Token usage tracking to monitor API costs
- Caching for conversation history
- Parallel agent execution for improved response time

## Security

- API keys stored in environment variables
- CORS configured for specific origins
- SQL injection prevention via SQLAlchemy ORM
- Input validation with Pydantic models

## License

MIT License. See LICENSE file for details.

## Support

For issues and feature requests, please use the GitHub issue tracker.

