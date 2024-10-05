import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 8050,
  },
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: (id) => {
          if (id.includes('@mantine')) {
            return 'mantine';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
    legalComments: 'none',
  },
  resolve: {
    alias: {
      '@formatjs/icu-messageformat-parser': '@formatjs/icu-messageformat-parser/no-parser',
    },
  },
});
