import { defineConfig } from 'vite';
import swc from 'unplugin-swc';
import visualizer from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      swc.vite(),
      mode === 'production' && visualizer({ open: true }),
      mode === 'production' && compression()
    ].filter(Boolean),
    esbuild: false,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'src': path.resolve(__dirname, 'src'),
      }
    },
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
