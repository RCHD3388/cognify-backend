const app = require("./app");
const env = require("./config/env");
const { testConnection } = require("./models");

async function initializeApp() {
    // Test koneksi database
    await testConnection();

    const port = env("APP_PORT") || 8000;
    const server = app.listen(port, () => {
        console.log(`App running on http://localhost:${port}`);
    })
}

initializeApp().catch(err => {
    console.error('Application failed to start:', err);
    process.exit(1);
});