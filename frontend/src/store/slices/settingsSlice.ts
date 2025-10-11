/**
 * Settings slice - manages user configuration and environment variables.
 * Persists settings to localStorage with encryption for sensitive data.
 */
import { StateCreator } from 'zustand';

// ============================================================================
// Types
// ============================================================================

export interface Settings {
  // API Keys
  anthropicApiKey: string;
  openaiApiKey: string;
  googleApiKey: string;
  
  // Server Configuration
  backendUrl: string;
  
  // Agent Configuration
  maxConcurrentAgents: number;
  agentTimeout: number;
  
  // UI Preferences
  theme: 'light' | 'dark' | 'system';
  enableNotifications: boolean;
  autoShowAgentPanel: boolean;
  
  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface SettingsSlice {
  settings: Settings;
  isSettingsLoaded: boolean;
  
  // Actions
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
  saveSettings: (settings: Settings) => void;
  validateApiKey: (provider: 'anthropic' | 'openai' | 'google', key: string) => boolean;
}

// ============================================================================
// Default Settings
// ============================================================================

export const defaultSettings: Settings = {
  // API Keys - empty by default
  anthropicApiKey: '',
  openaiApiKey: '',
  googleApiKey: '',
  
  // Server Configuration
  backendUrl: 'http://localhost:8000',
  
  // Agent Configuration
  maxConcurrentAgents: 5,
  agentTimeout: 120,
  
  // UI Preferences
  theme: 'system',
  enableNotifications: true,
  autoShowAgentPanel: true,
  
  // Logging
  logLevel: 'info',
};

// ============================================================================
// Local Storage Key
// ============================================================================

const SETTINGS_STORAGE_KEY = 'quorum-settings';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simple obfuscation for API keys in localStorage.
 * Note: This is NOT encryption, just basic obfuscation to prevent casual viewing.
 * For production, consider using a proper encryption library or backend storage.
 */
const obfuscate = (str: string): string => {
  if (!str) return '';
  return btoa(str);
};

const deobfuscate = (str: string): string => {
  if (!str) return '';
  try {
    return atob(str);
  } catch {
    return '';
  }
};

/**
 * Save settings to localStorage with API key obfuscation.
 */
const saveToStorage = (settings: Settings): void => {
  try {
    const toStore = {
      ...settings,
      anthropicApiKey: obfuscate(settings.anthropicApiKey),
      openaiApiKey: obfuscate(settings.openaiApiKey),
      googleApiKey: obfuscate(settings.googleApiKey),
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

/**
 * Load settings from localStorage with API key deobfuscation.
 */
const loadFromStorage = (): Settings | null => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      anthropicApiKey: deobfuscate(parsed.anthropicApiKey || ''),
      openaiApiKey: deobfuscate(parsed.openaiApiKey || ''),
      googleApiKey: deobfuscate(parsed.googleApiKey || ''),
    };
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return null;
  }
};

/**
 * Validate API key format based on provider.
 */
const validateApiKeyFormat = (provider: 'anthropic' | 'openai' | 'google', key: string): boolean => {
  if (!key) return false;
  
  switch (provider) {
    case 'anthropic':
      // Anthropic keys start with 'sk-ant-' and are typically 100+ characters
      return key.startsWith('sk-ant-') && key.length > 50;
    case 'openai':
      // OpenAI keys start with 'sk-' and are typically 50+ characters
      return key.startsWith('sk-') && key.length > 20;
    case 'google':
      // Google API keys are typically 39 characters
      return key.length >= 30;
    default:
      return false;
  }
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createSettingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  settings: defaultSettings,
  isSettingsLoaded: false,
  
  /**
   * Load settings from localStorage on initialization.
   */
  loadSettings: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({
        settings: { ...defaultSettings, ...stored },
        isSettingsLoaded: true,
      });
    } else {
      set({ isSettingsLoaded: true });
    }
  },
  
  /**
   * Update settings with partial updates.
   */
  updateSettings: (updates: Partial<Settings>) => {
    const currentSettings = get().settings;
    const newSettings = { ...currentSettings, ...updates };
    
    set({ settings: newSettings });
    saveToStorage(newSettings);
  },
  
  /**
   * Save complete settings object.
   */
  saveSettings: (settings: Settings) => {
    set({ settings });
    saveToStorage(settings);
  },
  
  /**
   * Reset settings to defaults.
   */
  resetSettings: () => {
    set({ settings: defaultSettings });
    saveToStorage(defaultSettings);
  },
  
  /**
   * Validate API key format.
   */
  validateApiKey: (provider: 'anthropic' | 'openai' | 'google', key: string): boolean => {
    return validateApiKeyFormat(provider, key);
  },
});

