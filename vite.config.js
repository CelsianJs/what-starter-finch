import { defineConfig } from 'vite';
import what from 'what-compiler/vite';

export default defineConfig({
  plugins: [what()],
  test: {
    environment: 'node',
    include: ['test/**/*.test.js'],
    exclude: ['test/browser/**', 'node_modules/**', 'dist/**'],
  },
});
