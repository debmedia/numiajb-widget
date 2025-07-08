import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  build: {
    outDir: 'dist', 
     lib: {
      entry: 'src/index.tsx',
      name: 'CustomChat',
      fileName: () => 'build/static/js/bundle.min.js', 
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'static/css/[name].[hash].css',
      },
    },
    minify: 'terser', 
  },
});
