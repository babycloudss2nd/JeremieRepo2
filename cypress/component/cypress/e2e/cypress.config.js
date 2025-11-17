// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Global timeouts for reliability
  defaultCommandTimeout: 20000,  // Wait longer for DOM updates
  pageLoadTimeout: 60000,        // Allow time for SPA route hydration
  requestTimeout: 15000,
  responseTimeout: 15000,

  video: false,                  // Optional: skip video recording for faster runs
  chromeWebSecurity: false,      // Allow cross-origin requests (needed for Vite+React)
  viewportWidth: 1366,
  viewportHeight: 768,

  e2e: {
    baseUrl: "http://localhost:5173", // Your Vite dev server
    supportFile: false,               // Disable auto support file
    experimentalModifyObstructiveThirdPartyCode: true,

    setupNodeEvents(on, config) {
      // Hook for plugins or env vars (keep for expansion)
      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
