import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./scripts/setupTests.ts'],
    include: ['packages/**/src/**/*.test.ts', 'tests/**/*.test.ts'],
  }
});
