import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['prairiejoybaskets.onrender.com'],
    host: '0.0.0.0',
    port: Number((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.PORT) || 10000,
    strictPort: true,
  }
});
