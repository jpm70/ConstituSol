import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Base relativa: funciona en GitHub Pages (https://jpm70.github.io/ConstituSol/) y en cualquier subcarpeta.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // La base de datos de los 169 artículos va en el propio bundle
    chunkSizeWarningLimit: 2000,
  },
});
