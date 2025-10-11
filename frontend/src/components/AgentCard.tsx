/**
 * AgentCard component displays the status and activity of an individual agent.
 * Shows real-time updates with visual feedback for different states.
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { AgentState, AgentType } from '@/types';
import { useLogger } from '@/hooks/useLogger';

interface AgentCardProps {
  agent: AgentState;
}

const AGENT_DISPLAY_NAMES: Record<AgentType, string> = {
  'claude-sonnet-4.5': 'Claude 4.5',
  'claude-sonnet-3.5': 'Claude 3.5',
  'gpt-5': 'GPT-5',
  'gemini-2.5-pro': 'Gemini 2.5',
};

const AGENT_COLORS: Record<AgentType, string> = {
  'claude-sonnet-4.5': 'bg-accent-500',
  'claude-sonnet-3.5': 'bg-primary-500',
  'gpt-5': 'bg-success-500',
  'gemini-2.5-pro': 'bg-warning-500',
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const logger = useLogger({ 
    component: 'AgentCard',
    context: { agentId: agent.agentId },
  });

  const displayName = AGENT_DISPLAY_NAMES[agent.agentType] || agent.agentType;
  const agentColor = AGENT_COLORS[agent.agentType] || 'bg-gray-500';

  useEffect(() => {
    logger.debug('Agent status changed', {
      agentType: agent.agentType,
      status: agent.status,
      hasMessage: !!agent.currentMessage,
    });
  }, [agent.status, agent.agentType, agent.currentMessage, logger]);

  const getStatusText = () => {
    switch (agent.status) {
      case 'thinking':
        return 'Thinking...';
      case 'responding':
        return 'Responding...';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Error';
      default:
        return 'Idle';
    }
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'thinking':
        return 'text-blue-600';
      case 'responding':
        return 'text-purple-600';
      case 'complete':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-neutral-500';
    }
  };

  const isActive = agent.status === 'thinking' || agent.status === 'responding';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`agent-card-clean ${isActive ? 'agent-active' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${agentColor} ${isActive ? 'agent-indicator-pulse' : ''}`} />
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">{displayName}</h3>
            <p className={`text-xs font-semibold mt-0.5 ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        {isActive && (
          <Loader className="w-4 h-4 animate-spin text-blue-600" />
        )}
      </div>

      {/* Current Task */}
      {agent.currentMessage && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
          className="mt-3 pt-3 border-t border-neutral-200"
        >
          <p className="text-xs text-neutral-700 line-clamp-3 leading-relaxed">
            {agent.currentMessage}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};


