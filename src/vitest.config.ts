import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/']
    },
  },
});