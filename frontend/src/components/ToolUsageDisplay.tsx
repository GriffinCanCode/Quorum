/**
 * ToolUsageDisplay component - displays tool usage (especially web search) during agent processing
 * Shows what tools were used and their queries in a visually contained window
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, ExternalLink } from 'lucide-react';

export interface ToolUsage {
  toolName: string;
  query?: string;
  provider?: string;
  timestamp: string;
  results?: any[];
  status: 'pending' | 'complete' | 'error';
}

interface ToolUsageDisplayProps {
  tools: ToolUsage[];
  isProcessing?: boolean;
}

export const ToolUsageDisplay: React.FC<ToolUsageDisplayProps> = ({ tools, isProcessing = false }) => {
  if (tools.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="tool-usage-container"
    >
      <div className="tool-usage-header">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">Tool Usage</span>
      </div>

      <div className="tool-usage-content">
        {tools.map((tool, index) => (
          <ToolUsageItem key={`${tool.timestamp}-${index}`} tool={tool} isProcessing={isProcessing} />
        ))}
      </div>
    </motion.div>
  );
};

interface ToolUsageItemProps {
  tool: ToolUsage;
  isProcessing?: boolean;
}

const ToolUsageItem: React.FC<ToolUsageItemProps> = ({ tool, isProcessing }) => {
  const isWebSearch = tool.toolName === 'web_search';
  
  const getStatusColor = () => {
    switch (tool.status) {
      case 'complete':
        return 'status-complete';
      case 'error':
        return 'status-error';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = () => {
    if (tool.status === 'pending') {
      return (
        <div className="status-spinner">
          <div className="spinner-ring"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="tool-usage-item"
    >
      <div className="tool-icon">
        {isWebSearch ? (
          <Search className="w-4 h-4 text-blue-600" />
        ) : (
          <Globe className="w-4 h-4 text-blue-600" />
        )}
      </div>
      
      <div className="tool-details">
        <div className="tool-name-row">
          <span className="tool-name">
            {isWebSearch ? 'Web Search' : tool.toolName}
          </span>
          <span className={`tool-status ${getStatusColor()}`}>
            {getStatusIcon()}
            {tool.status === 'complete' && tool.results && (
              <span className="text-xs">{tool.results.length} results</span>
            )}
          </span>
        </div>
        
        {tool.query && (
          <div className="tool-query">
            <Search className="w-3 h-3 opacity-50" />
            <span className="query-text">"{tool.query}"</span>
          </div>
        )}
        
        {tool.provider && (
          <div className="tool-provider">
            <span className="text-xs text-neutral-500">via {tool.provider}</span>
          </div>
        )}

        {tool.status === 'complete' && tool.results && tool.results.length > 0 && (
          <div className="tool-results">
            {tool.results.slice(0, 3).map((result, idx) => (
              <a
                key={idx}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="result-link"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="result-title">{result.title}</span>
              </a>
            ))}
            {tool.results.length > 3 && (
              <span className="more-results">
                +{tool.results.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

