import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpsdmwtnfzifxmvqyzxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc2Rtd3RuZnppZnhtdnF5enhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODgxODUsImV4cCI6MjA4Mzk2NDE4NX0.hQ9RsgdDKY7yArAiIP7BLKcu4J-tqRBiHSnkWN5thAQ';

// Safety check to ensure valid credentials are provided
const isConfigured = () => {
  return (
    supabaseUrl && 
    supabaseUrl.startsWith('https://') && 
    !supabaseUrl.includes('YOUR_PROJECT_ID')
  );
};

export const supabase = isConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (target, prop) => {
        if (prop === 'from') {
          return () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: null, error: null }),
            delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
            order: () => Promise.resolve({ data: [], error: null }),
          });
        }
        console.warn(`Supabase configuration is missing or invalid. Attempted to access: ${String(prop)}`);
        return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') });
      }
    });
