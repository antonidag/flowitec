import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Set base to root for custom domain deployment
  // build: {
  //   outDir: '_site',
  //   emptyOutDir: true, // Ensures old builds are removed
  // }
});
