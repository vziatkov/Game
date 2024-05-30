import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import swc from 'unplugin-swc';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), swc.vite()],
    esbuild: false, // Отключаем esbuild в пользу SWC
    build: {
      sourcemap: mode === 'development',
      minify: mode === 'production',
      outDir: 'dist',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]',
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
        },
      },
    },
    server: {
      port: 3000,
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };
});
