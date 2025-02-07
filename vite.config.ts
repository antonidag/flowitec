import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/flowitec/', // Replace <REPO_NAME> with your GitHub repository name
  // build: {
  //   outDir: '_site',
  //   emptyOutDir: true, // Ensures old builds are removed
  // }
});
