/**
 * AgentPanel displays all active agents in a grid.
 * Shows real-time status updates for agent collaboration.
 */
import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AgentState } from '@/types';
import { AgentCard } from './AgentCard';
import { Users } from 'lucide-react';
import { useLogger } from '@/hooks/useLogger';

interface AgentPanelProps {
  agents: AgentState[];
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ agents }) => {
  const logger = useLogger({ component: 'AgentPanel' });

  useEffect(() => {
    if (agents.length > 0) {
      logger.debug('Active agents updated', { 
        agentCount: agents.length,
        agentTypes: agents.map(a => a.agentType),
        statuses: agents.map(a => a.status),
      });
    }
  }, [agents, logger]);

  // Separate active and completed agents for better organization
  const activeAgents = agents.filter(
    (agent) => agent.status === 'thinking' || agent.status === 'responding'
  );
  const completedAgents = agents.filter(
    (agent) => agent.status === 'complete' || agent.status === 'error' || agent.status === 'idle'
  );
  
  if (agents.length === 0) {
    return (
      <div className="agent-panel-empty">
        <Users className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-700 text-sm font-semibold">No active agents</p>
        <p className="text-neutral-500 text-xs mt-1.5 font-medium">
          Agents will appear when processing
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Agents Section */}
      {activeAgents.length > 0 && (
        <div className="space-y-3">
          <div className="px-1">
            <h2 className="text-xs uppercase tracking-wider font-bold text-blue-600">
              Active · {activeAgents.length}
            </h2>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {activeAgents.map((agent) => (
                <AgentCard key={agent.agentId} agent={agent} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Divider between active and completed */}
      {activeAgents.length > 0 && completedAgents.length > 0 && (
        <div className="agent-section-divider" />
      )}

      {/* Completed Agents Section */}
      {completedAgents.length > 0 && (
        <div className="space-y-3">
          <div className="px-1">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
              Completed · {completedAgents.length}
            </h2>
          </div>
          <div className="space-y-3 opacity-60">
            <AnimatePresence mode="popLayout">
              {completedAgents.map((agent) => (
                <AgentCard key={agent.agentId} agent={agent} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

