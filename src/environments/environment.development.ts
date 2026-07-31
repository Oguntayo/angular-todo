export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && (window as any).__env?.API_URL) || 'http://localhost:3000/todos',
  apiBaseUrl: (typeof window !== 'undefined' && (window as any).__env?.API_BASE_URL) || 'http://localhost:3000',
  appName: 'TaskFlow Enterprise'
};
