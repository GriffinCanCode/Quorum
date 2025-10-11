/**
 * ChatHistory - Sidebar for browsing conversation history
 * Features a unique stacked card design with smart temporal visual weight
 */
import { memo, useMemo } from 'react';
import { X, Search, Clock, MessageSquare, Star, Trash2, History } from 'lucide-react';
import { useStore } from '@/store';
import { ConversationHistory } from '@/store/types';
import { AgentType } from '@/types';
import '../styles/chatHistory.css';

// Agent color mappings matching the main app
const agentColors: Record<AgentType, string> = {
  'claude-sonnet-4.5': 'bg-purple-600 text-white',
  'claude-sonnet-3.5': 'bg-blue-600 text-white',
  'gpt-5': 'bg-green-600 text-white',
  'gemini-2.5-pro': 'bg-orange-600 text-white',
};

const agentInitials: Record<AgentType, string> = {
  'claude-sonnet-4.5': 'C+',
  'claude-sonnet-3.5': 'C',
  'gpt-5': 'G',
  'gemini-2.5-pro': 'Gm',
};

// Format timestamp for display
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  // Format as date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Determine if conversation is recent (for visual weight)
const isRecent = (timestamp: string): boolean => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / 3600000;
  return diffHours < 24; // Less than 24 hours old
};

const isOlder = (timestamp: string): boolean => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / 86400000;
  return diffDays > 7; // More than 7 days old
};

interface ConversationCardProps {
  conversation: ConversationHistory;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
  onLoad: (id: string) => void;
}

const ConversationCard = memo(({ conversation, onToggleStar, onDelete, onLoad }: ConversationCardProps) => {
  const cardClass = [
    'history-card',
    conversation.isStarred && 'starred',
    isRecent(conversation.lastUpdated) && 'recent',
    isOlder(conversation.lastUpdated) && 'older',
  ].filter(Boolean).join(' ');

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${conversation.title}"?`)) {
      onDelete(conversation.id);
    }
  };

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStar(conversation.id);
  };

  return (
    <div
      className={cardClass}
      onClick={() => onLoad(conversation.id)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onLoad(conversation.id);
        }
      }}
      aria-label={`Load conversation: ${conversation.title}`}
    >
      <div className="history-card-header">
        <div className="history-card-title">{conversation.title}</div>
        <button
          className={`history-star-button ${conversation.isStarred ? 'starred' : ''}`}
          onClick={handleToggleStar}
          aria-label={conversation.isStarred ? 'Unstar conversation' : 'Star conversation'}
        >
          <Star
            className="w-4 h-4"
            fill={conversation.isStarred ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {conversation.assistantPreview && (
        <div className="history-card-preview">{conversation.assistantPreview}</div>
      )}

      <div className="history-card-footer">
        <div className="history-card-agents">
          {conversation.agentsUsed.slice(0, 3).map((agentType) => (
            <div
              key={agentType}
              className={`history-agent-badge ${agentColors[agentType]}`}
              title={agentType}
            >
              {agentInitials[agentType]}
            </div>
          ))}
          {conversation.agentsUsed.length > 3 && (
            <div className="history-agent-badge bg-gray-500 text-white text-[10px]">
              +{conversation.agentsUsed.length - 3}
            </div>
          )}
        </div>

        <div className="history-card-metadata">
          <div className="history-card-meta-item">
            <MessageSquare className="history-card-meta-icon" />
            <span>{conversation.messageCount}</span>
          </div>
          <div className="history-card-meta-item">
            <Clock className="history-card-meta-icon" />
            <span>{formatTimestamp(conversation.lastUpdated)}</span>
          </div>
        </div>
      </div>

      <div className="history-card-actions">
        <button
          className="history-delete-button"
          onClick={handleDelete}
          aria-label="Delete conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

ConversationCard.displayName = 'ConversationCard';

function ChatHistoryComponent() {
  const showHistory = useStore((state) => state.showHistory);
  const conversationHistory = useStore((state) => state.conversationHistory);
  const searchQuery = useStore((state) => state.historySearchQuery);
  
  const setShowHistory = useStore((state) => state.setShowHistory);
  const setSearchQuery = useStore((state) => state.setHistorySearchQuery);
  const toggleStarred = useStore((state) => state.toggleStarred);
  const removeFromHistory = useStore((state) => state.removeFromHistory);
  const loadConversation = useStore((state) => state.loadConversation);
  const clearHistory = useStore((state) => state.clearHistory);

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversationHistory;
    
    const query = searchQuery.toLowerCase();
    return conversationHistory.filter(
      (conv) =>
        conv.title.toLowerCase().includes(query) ||
        conv.userQuery.toLowerCase().includes(query) ||
        conv.assistantPreview.toLowerCase().includes(query)
    );
  }, [conversationHistory, searchQuery]);

  // Group conversations by time period
  const { starred, today, thisWeek, older } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    return {
      starred: filteredConversations.filter((c) => c.isStarred),
      today: filteredConversations.filter((c) => {
        const date = new Date(c.lastUpdated);
        return !c.isStarred && date >= todayStart;
      }),
      thisWeek: filteredConversations.filter((c) => {
        const date = new Date(c.lastUpdated);
        return !c.isStarred && date < todayStart && date >= weekStart;
      }),
      older: filteredConversations.filter((c) => {
        const date = new Date(c.lastUpdated);
        return !c.isStarred && date < weekStart;
      }),
    };
  }, [filteredConversations]);

  const handleClearHistory = () => {
    if (confirm('Clear all conversation history? This cannot be undone.')) {
      clearHistory();
    }
  };

  const handleLoadConversation = (conversationId: string) => {
    loadConversation(conversationId);
    setShowHistory(false);
  };

  if (!showHistory) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="history-backdrop"
        onClick={() => setShowHistory(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className="history-sidebar" role="complementary" aria-label="Conversation history">
        {/* Header */}
        <div className="history-header">
          <div className="history-title-row">
            <div className="history-title-group">
              <div className="history-icon-wrapper">
                <History className="history-icon" />
              </div>
              <h2 className="history-title">History</h2>
            </div>
            <button
              className="history-close-button"
              onClick={() => setShowHistory(false)}
              aria-label="Close history"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="history-search-container">
            <Search className="history-search-icon" />
            <input
              type="text"
              className="history-search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search conversations"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="history-list-container">
          {filteredConversations.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon-wrapper">
                <MessageSquare className="history-empty-icon" />
              </div>
              <div className="history-empty-title">
                {searchQuery ? 'No conversations found' : 'No conversation history'}
              </div>
              <div className="history-empty-description">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Your past conversations will appear here for easy access'}
              </div>
            </div>
          ) : (
            <>
              {/* Starred Conversations */}
              {starred.length > 0 && (
                <div>
                  <div className="history-section-header">
                    <Star className="w-3 h-3 inline mr-1" />
                    Starred
                  </div>
                  <div className="history-list">
                    {starred.map((conv) => (
                      <ConversationCard
                        key={conv.id}
                        conversation={conv}
                        onToggleStar={toggleStarred}
                        onDelete={removeFromHistory}
                        onLoad={handleLoadConversation}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Today */}
              {today.length > 0 && (
                <div>
                  <div className="history-section-header">Today</div>
                  <div className="history-list">
                    {today.map((conv) => (
                      <ConversationCard
                        key={conv.id}
                        conversation={conv}
                        onToggleStar={toggleStarred}
                        onDelete={removeFromHistory}
                        onLoad={handleLoadConversation}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* This Week */}
              {thisWeek.length > 0 && (
                <div>
                  <div className="history-section-header">This Week</div>
                  <div className="history-list">
                    {thisWeek.map((conv) => (
                      <ConversationCard
                        key={conv.id}
                        conversation={conv}
                        onToggleStar={toggleStarred}
                        onDelete={removeFromHistory}
                        onLoad={handleLoadConversation}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {older.length > 0 && (
                <div>
                  <div className="history-section-header">Older</div>
                  <div className="history-list">
                    {older.map((conv) => (
                      <ConversationCard
                        key={conv.id}
                        conversation={conv}
                        onToggleStar={toggleStarred}
                        onDelete={removeFromHistory}
                        onLoad={handleLoadConversation}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {filteredConversations.length > 0 && (
          <div className="history-footer">
            <button
              className="history-clear-button"
              onClick={handleClearHistory}
              aria-label="Clear all history"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All History</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export const ChatHistory = memo(ChatHistoryComponent);

