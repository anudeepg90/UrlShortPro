// Configuration for different environments

interface Config {
  apiBaseUrl: string;
  environment: 'development' | 'production';
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const getConfig = (): Config => {
  const environment = process.env.NODE_ENV || 'development';
  
  if (environment === 'production') {
    return {
      apiBaseUrl: process.env.VITE_API_URL || 'https://linkvault-api-m7jbmtvdha-uc.a.run.app',
      environment: 'production',
      supabaseUrl: process.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
    };
  }
  
  // Development environment
  return {
    apiBaseUrl: process.env.VITE_API_URL || '',
    environment: 'development',
    supabaseUrl: process.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
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