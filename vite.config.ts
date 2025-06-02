import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // আউটপুট ফোল্ডার 'dist' থেকে 'build' এ পরিবর্তন করা
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  esbuild: {
    loader: 'tsx', // .tsx ফাইলের জন্য লোডার সেট করা
    include: [
      'src/**/*.js',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.tsx',
    ],
  },
});