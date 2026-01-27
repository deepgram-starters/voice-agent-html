import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: parseInt(process.env.VITE_PORT || '5173'),
    strictPort: true,  // Fail if port is in use instead of trying alternatives
    open: false,
    host: true,
    proxy: {
      // Proxy WebSocket and API routes back to backend
      '/agent': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      },
      '/metadata': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4173,
    open: false,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});

