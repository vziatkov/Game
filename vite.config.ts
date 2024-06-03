import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import swc from 'unplugin-swc';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      swc.vite(),
      mode === 'production' && terser(),
      mode === 'production' && visualizer({ open: true }),
      mode === 'production' && compression()
    ].filter(Boolean),
    esbuild: false,
    build: {
      sourcemap: mode === 'development',
      minify: 'terser',
      outDir: 'dist',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash].[ext]',
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
        },
        treeshake: true,
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
