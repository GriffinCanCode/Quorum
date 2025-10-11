/**
 * Conversation slice - manages conversation metadata and settings.
 */
import { StateCreator } from 'zustand';
import { ConversationSlice, RootStore } from '../types';
import { AgentMessage } from '@/types';

export const createConversationSlice: StateCreator<
  RootStore,
  [],
  [],
  ConversationSlice
> = (set) => ({
  // State
  conversationId: '',
  startTime: null,
  enableCollaboration: true,
  maxSubAgents: 3,
  agentConversations: [],

  // Actions
  initConversation: (id: string) =>
    set({
      conversationId: id,
      startTime: new Date().toISOString(),
    }),

  setCollaboration: (enabled: boolean) =>
    set({ enableCollaboration: enabled }),

  setMaxSubAgents: (max: number) =>
    set({ maxSubAgents: max }),

  addAgentMessage: (message: AgentMessage) =>
    set((state) => {
      // Create a complete new array to ensure React detects the change
      const rounds = state.agentConversations.map(r => ({...r, messages: [...r.messages]}));
      
      // Find or create the round for this message
      const roundIndex = rounds.findIndex(r => r.roundNumber === message.roundNumber);
      
      if (roundIndex !== -1) {
        // Check if message already exists (prevent duplicates)
        const messageExists = rounds[roundIndex].messages.some(m => m.messageId === message.messageId);
        if (messageExists) {
          // Message already exists, return unchanged state
          return { agentConversations: state.agentConversations };
        }
        
        // Add message to existing round (create new round object)
        rounds[roundIndex] = {
          ...rounds[roundIndex],
          messages: [...rounds[roundIndex].messages, message],
          participatingAgents: Array.from(new Set([...rounds[roundIndex].participatingAgents, message.agentId])),
        };
      } else {
        // Create new round
        const newRound = {
          roundNumber: message.roundNumber,
          messages: [message],
          participatingAgents: [message.agentId],
          isComplete: false,
        };
        rounds.push(newRound);
        // Sort rounds by round number to maintain order
        rounds.sort((a, b) => a.roundNumber - b.roundNumber);
      }
      
      return { agentConversations: rounds };
    }),

  appendToAgentMessage: (messageId: string, content: string) =>
    set((state) => {
      // Create new array with immutable updates
      const rounds = state.agentConversations.map(round => {
        const messageIndex = round.messages.findIndex(m => m.messageId === messageId);
        
        if (messageIndex !== -1) {
          // Found the message, append content (create new message object)
          const updatedMessages = round.messages.map((msg, idx) => 
            idx === messageIndex 
              ? { ...msg, content: msg.content + content }
              : msg
          );
          
          return {
            ...round,
            messages: updatedMessages,
          };
        }
        
        // Return unchanged round
        return round;
      });
      
      return { agentConversations: rounds };
    }),

  addConversationRound: (round) =>
    set((state) => {
      const rounds = state.agentConversations.filter(
        r => r.roundNumber !== round.roundNumber
      );
      return {
        agentConversations: [...rounds, round].sort(
          (a, b) => a.roundNumber - b.roundNumber
        ),
      };
    }),

  resetConversation: () =>
    set({
      conversationId: '',
      startTime: null,
      enableCollaboration: true,
      maxSubAgents: 3,
      agentConversations: [],
    }),
});
