import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'nf9rdc',
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
