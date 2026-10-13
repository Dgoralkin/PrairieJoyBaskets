import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || process.env.VITE_API_URL || ''
      ),
    },

    preview: {
      allowedHosts: ['prairiejoybaskets.onrender.com'],
      host: '0.0.0.0',
      port:
        Number(
          (globalThis as {
            process?: {
              env?: Record<string, string | undefined>;
            };
          }).process?.env?.PORT
        ) || 10000,
      strictPort: true,
    },
  };
});