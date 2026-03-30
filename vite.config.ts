import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
// Production build targets GitHub Pages at /project/ (repo name: project)
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/project/' : '/',
  plugins: [react(), mkcert()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
