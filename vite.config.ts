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
});
