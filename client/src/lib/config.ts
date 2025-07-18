// Configuration for different environments

interface Config {
  apiBaseUrl: string;
  environment: 'development' | 'production';
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const getConfig = (): Config => {
  const environment = import.meta.env.MODE || 'development';
  
  if (environment === 'production') {
    return {
      apiBaseUrl: import.meta.env.VITE_API_URL || 'https://urlshortpro-backend-222258163708.us-central1.run.app',
      environment: 'production',
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };
  }
  
  // Development environment
  return {
    apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5173',
    environment: 'development',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };
};

export const config = getConfig();

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};

// Log configuration in development
if (config.environment === 'development') {
  console.log('🔧 App Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    environment: config.environment,
  });
} 