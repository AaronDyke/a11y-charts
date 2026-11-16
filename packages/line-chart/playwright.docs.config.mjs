import { defineConfig } from '@playwright/test';

// Loads every page of the built docs site (docs/dist) and checks that each live
// chart example renders without an error state. Build the docs first with
// `npm run docs:build`.
export default defineConfig({
  testDir: './browser-tests', testMatch: 'docs-examples.spec.ts',
  outputDir: '../../tmp/docs/test-results', workers: 1, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5196', browserName: 'chromium', channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL || 'chrome', viewport: { width: 1280, height: 900 } },
  webServer: {
    // The docs are fully static, so a plain file server is enough.
    command: 'python3 -m http.server 5196 --bind 127.0.0.1 --directory ../../docs/dist',
    url: 'http://127.0.0.1:5196/',
    reuseExistingServer: false,
  },
});
