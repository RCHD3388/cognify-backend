const app = require("./app");

// set .env config
const env = require("./config/env");

// mongoose connection

// server
const port = env("APP_PORT") || 8000;
const server = app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
})
