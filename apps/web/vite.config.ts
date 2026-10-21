import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // 1. This server block is for local development
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: `http://localhost:${env.PORT || 4000}`, // Matches our local backend port for development (read from .env with fallback to 4000)
          changeOrigin: true,
        },
      },
    },

    // 2. Keep your existing preview/production config
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