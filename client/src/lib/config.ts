// Configuration for different environments
const config = {
  development: {
    apiBaseUrl: 'http://localhost:5173',
    domain: 'localhost:5173',
    shortUrlDomain: 'localhost:5173'
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_API_URL || 'https://tinyyourl-api-222258163708.us-central1.run.app',
    domain: 'tinyyourl.com',
    shortUrlDomain: 'tinyyourl.com'
  }
};

const environment = import.meta.env.MODE || 'development';
export const appConfig = config[environment as keyof typeof config];

// API helper function
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${appConfig.apiBaseUrl}${endpoint}`;
  const token = localStorage.getItem('authToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge with any additional headers from options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Short URL generation
export const generateShortUrl = (shortId: string) => {
  return `https://${appConfig.shortUrlDomain}/${shortId}`;
};

// App metadata
export const appMetadata = {
  name: 'TinyYOUrl',
  description: 'Free URL Shortener with QR Codes & Analytics',
  version: '1.0.0',
  author: 'TinyYOUrl Team',
  website: 'https://tinyyourl.com'
}; 