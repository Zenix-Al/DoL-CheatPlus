import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  root: 'src/ui',
  build: {
    outDir: '../_compiled',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/ui/index.html',
      },
    },
  },
});
