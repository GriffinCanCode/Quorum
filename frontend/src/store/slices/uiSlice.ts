/**
 * UI slice - ephemeral UI state (not persisted).
 */
import { StateCreator } from 'zustand';
import { UISlice, RootStore } from '../types';

export const createUISlice: StateCreator<
  RootStore,
  [],
  [],
  UISlice
> = (set) => ({
  // State - ephemeral, not persisted
  showAgentPanel: true,
  isProcessing: false,
  error: null,
  inputValue: '',

  // Actions
  setShowAgentPanel: (show: boolean) =>
    set({ showAgentPanel: show }),

  setProcessing: (processing: boolean) =>
    set({ isProcessing: processing }),

  setError: (error: string | null) =>
    set({ error }),

  setInputValue: (value: string) =>
    set({ inputValue: value }),

  clearError: () =>
    set({ error: null }),
});

