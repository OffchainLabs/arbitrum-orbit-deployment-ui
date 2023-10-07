import { defineConfig } from 'cypress';
const synpressPlugins = require('@synthetixio/synpress/plugins');

export default defineConfig({
  userAgent: 'synpress',
  retries: 2,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  video: false,
  screenshotOnRunFailure: false,
  chromeWebSecurity: true,
  modifyObstructiveCode: false,
  scrollBehavior: false,
  viewportWidth: 1366,
  viewportHeight: 850,

  env: {
    coverage: false,
  },

  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,

  e2e: {
    testIsolation: true,
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
});
