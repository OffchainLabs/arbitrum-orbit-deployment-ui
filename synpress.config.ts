import { defineConfig } from "cypress";

export default defineConfig({
  userAgent: "synpress",
  retries: 2,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  video: false,
  screenshotOnRunFailure: true,
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
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
