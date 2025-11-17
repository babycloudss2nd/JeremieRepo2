// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 8000,       // commands like get, click
  pageLoadTimeout: 30000,            // increase for SPA routes
  requestTimeout: 10000,             // axios/fetch requests
  responseTimeout: 10000,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: "http://localhost:5173", // Vite dev server URL
    setupNodeEvents(on, config) {
      // implement node event listeners if needed
      return config;
    },
    // SPA-friendly options
    supportFile: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
  },
});
