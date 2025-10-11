# Multi-Agent Collaboration System

A sophisticated platform where multiple AI agents (Claude, GPT, Gemini) collaborate to accomplish complex tasks. The main orchestrator agent intelligently delegates subtasks to specialized sub-agents, synthesizing their responses into comprehensive answers.

## 🎯 Architecture Highlights

### Why This Design is Superior

**Traditional Approach**: Heavy frameworks like LangGraph, CrewAI, or AutoGen with steep learning curves and complex abstractions.

**Our Approach**: Streaming-first, LiteLLM-powered orchestrator that's:
- ✨ **Simple & Maintainable**: ~400 lines per file, easy to understand and modify
- 🚀 **High Performance**: Async Python + parallel agent execution
- 🔄 **Real-time**: Server-Sent Events for live streaming updates
- 🎨 **Beautiful UX**: React + Framer Motion for smooth animations
- 🧩 **Modular**: Clean separation of concerns

### Tech Stack

**Backend** (Python):
- **FastAPI**: Modern async web framework
- **LiteLLM**: Unified API for Claude, GPT, Gemini with streaming
- **SSE-Starlette**: Server-Sent Events for real-time updates
- **Pydantic**: Type-safe data models

**Frontend** (TypeScript/React):
- **React 18**: Modern UI library
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling with custom dark theme
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- API keys for: Anthropic, OpenAI, Google

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run server
python3 main.py
```

Server runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📁 Project Structure

```
/backend
├── main.py                 # FastAPI app & SSE endpoints
├── config.py              # Configuration management
├── models.py              # Pydantic data models
├── requirements.txt       # Python dependencies
├── /agents
│   ├── base_agent.py      # Base agent class with LiteLLM
│   └── agent_factory.py   # Agent creation & configuration
└── /orchestrator
    └── task_orchestrator.py  # Multi-agent coordination

/frontend
├── /src
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point
│   ├── index.css          # Tailwind styles
│   ├── /components        # React components
│   │   ├── AgentCard.tsx      # Agent status display
│   │   ├── AgentPanel.tsx     # Agent grid container
│   │   ├── ChatWindow.tsx     # Message display
│   │   ├── ChatInput.tsx      # User input
│   │   └── MessageBubble.tsx  # Individual messages
│   ├── /services
│   │   └── api.ts         # Backend API client
│   ├── /store
│   │   └── useConversationStore.ts  # Zustand store
│   └── /types
│       └── index.ts       # TypeScript definitions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 Features

### Intelligent Agent Orchestration
- Main Claude 4.5 agent analyzes tasks and decides on delegation
- Parallel execution of sub-agent queries
- Automatic response synthesis

### Real-Time Collaboration Visualization
- Live agent status updates
- Visual feedback for thinking/responding states
- Progress indicators and animated transitions

### Streaming Responses
- Token-by-token response streaming
- Server-Sent Events for efficient real-time updates
- Smooth UI updates without flicker

### Beautiful Dark Theme
- Glass morphism effects
- Smooth animations with Framer Motion
- Responsive design

## 🔑 API Endpoints

### POST `/api/task/stream`
Process a task with streaming responses (SSE).

**Request Body**:
```json
{
  "message": "Your question here",
  "enableCollaboration": true,
  "maxSubAgents": 3
}
```

**Response**: Server-Sent Events stream

### POST `/api/task`
Process a task and return complete result (non-streaming).

### POST `/api/reset`
Reset the conversation state.

### GET `/health`
Health check with API key status.

## 🎯 How It Works

1. **User Input**: User asks a question through the chat interface
2. **Analysis**: Main Claude agent analyzes the task complexity
3. **Delegation**: If beneficial, creates specific queries for sub-agents
4. **Parallel Execution**: Sub-agents (Claude, GPT, Gemini) work simultaneously
5. **Synthesis**: Main agent combines insights into a coherent response
6. **Streaming**: Response streams to UI in real-time with visual feedback

## 🛠️ Configuration

### Backend (`backend/.env`)
```env
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key

HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

### Frontend
API endpoint is auto-configured via Vite proxy. For production:
```env
VITE_API_BASE=https://your-backend-url
```

## 🧪 Development

### Backend
```bash
# With auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
# Development with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Adding New Agents

1. Add agent type to `models.py`:
```python
class AgentType(str, Enum):
    NEW_AGENT = "new-agent-name"
```

2. Configure in `agent_factory.py`:
```python
MODEL_MAP = {
    AgentType.NEW_AGENT: "provider/model-name",
}
```

3. Update frontend types in `src/types/index.ts`

## 🎨 Customization

### Styling
Edit `frontend/tailwind.config.js` for colors and theme.
Custom styles in `frontend/src/index.css`.

### Agent Behavior
Modify system prompts in `backend/agents/agent_factory.py`.

### Orchestration Logic
Adjust delegation strategy in `backend/orchestrator/task_orchestrator.py`.

## 📄 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

This is a reference implementation. Feel free to fork and customize for your needs!

---

Built with ❤️ using Claude, showcasing the power of multi-agent AI collaboration.

