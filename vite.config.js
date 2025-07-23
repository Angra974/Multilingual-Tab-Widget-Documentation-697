import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  assetsInclude: ['**/*.md', '**/*.mdx'], // Inclure les fichiers Markdown comme assets
  server: {
    fs: {
      allow: ['..'] // Permettre l'accès aux fichiers en dehors du root
    }
  }
});