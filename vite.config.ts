import { copyFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
// Production build targets GitHub Pages at /project/ (repo name: project)
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/project/' : '/',
  plugins: [
    react(),
    mkcert(),
    {
      name: 'github-pages-spa-fallback',
      closeBundle() {
        if (command !== 'build') return;
        const dist = resolve(__dirname, 'dist');
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
      },
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
