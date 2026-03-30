import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** 404.html redirects to /project/?/rest so the document loads with 200 (GitHub Pages quirk). */
const githubPagesSpa404Html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <script>
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '%26') : '') +
      l.hash
    );
  </script>
</head>
<body></body>
</html>
`;

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
        writeFileSync(resolve(dist, '404.html'), githubPagesSpa404Html, 'utf8');
      },
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
