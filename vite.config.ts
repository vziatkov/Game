import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import swc from 'unplugin-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), swc.vite()],
  esbuild: false, // Отключаем esbuild в пользу SWC
});