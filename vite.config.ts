import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.isDynamicEntry) return 'js/[name].js';
          return 'js/main.js';
        },
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
