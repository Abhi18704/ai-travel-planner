
// Environment configuration

// Gemini API key from environment variables with fallback
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Helper function to check if the API key is available
export const hasApiKey = (): boolean => {
  return GEMINI_API_KEY.length > 0;
};
