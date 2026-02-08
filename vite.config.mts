import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/ygig/' : '/',
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      include: [
        'buffer',
        'process',
        'stream',
        'util',
        'events',
        'path',
        'fs',
        'url',
        'http',
        'https',
        'zlib',
        'crypto',
      ],
      overrides: {
        fs: 'memfs',
      },
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      injectRegister: null,
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    outDir: 'build',
  },
  optimizeDeps: {
    include: ['node-downloader-helper'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
}));
