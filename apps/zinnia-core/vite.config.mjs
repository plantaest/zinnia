import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import zinniaSpecificFilesPlugin from './zinniaSpecificFilesPlugin.js';

export default defineConfig(({ mode }) => ({
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
    sourcemap: true,
    copyPublicDir: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mantine: ['@mantine/core', '@mantine/hooks'],
        },
      },
      plugins: [zinniaSpecificFilesPlugin(mode)],
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
}));
