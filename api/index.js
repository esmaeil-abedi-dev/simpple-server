// This file is the entry point for your Express server on Vercel
// It imports the compiled TypeScript server from the dist directory

// Import the compiled Express app
const app = require("../dist/server").default;

// Export the app for Vercel
module.exports = app;

// Note: The actual server initialization and listening happens in the original server.ts file
// This file only serves as an entry point for Vercel to find your Express application
