/**
 * Agents slice - normalized agent state for O(1) lookups.
 */
import { StateCreator } from 'zustand';
import { AgentsSlice, RootStore } from '../types';
import { AgentState } from '@/types';

const generateAgentId = (type: string) =>
  `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createAgentsSlice: StateCreator<
  RootStore,
  [],
  [],
  AgentsSlice
> = (set, get) => ({
  // State - normalized structure
  agents: {
    byId: {},
    allIds: [],
  },

  // Actions
  addAgent: (agent) => {
    // Use provided agentId if available (from backend), otherwise generate one
    const id = agent.agentId || generateAgentId(agent.agentType);
    
    // Check if agent already exists
    const existingAgent = get().agents.byId[id];
    if (existingAgent) {
      console.debug(`Agent ${id} already exists, skipping add`);
      return id;
    }

    const newAgent: AgentState = {
      ...agent,
      agentId: id,
      progress: agent.progress ?? 0,
      status: agent.status ?? 'idle',
      startTime: new Date().toISOString(),
    };

    set((state) => ({
      agents: {
        byId: {
          ...state.agents.byId,
          [id]: newAgent,
        },
        allIds: [...state.agents.allIds, id],
      },
    }));

    return id;
  },

  updateAgent: (id, updates) => {
    set((state) => {
      const agent = state.agents.byId[id];
      if (!agent) {
        console.warn(`Agent ${id} not found for update`);
        return state;
      }

      // Set endTime if status is complete or error
      const updatedAgent: AgentState = {
        ...agent,
        ...updates,
        ...(updates.status === 'complete' || updates.status === 'error'
          ? { endTime: new Date().toISOString() }
          : {}),
      };

      return {
        agents: {
          ...state.agents,
          byId: {
            ...state.agents.byId,
            [id]: updatedAgent,
          },
        },
      };
    });
  },

  removeAgent: (id) => {
    set((state) => {
      const { [id]: removed, ...remainingById } = state.agents.byId;
      return {
        agents: {
          byId: remainingById,
          allIds: state.agents.allIds.filter((agentId) => agentId !== id),
        },
      };
    });
  },

  clearAgents: () =>
    set({
      agents: {
        byId: {},
        allIds: [],
      },
    }),

  setAgentStatus: (id, status) => {
    get().updateAgent(id, { status });
  },
});

