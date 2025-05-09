const dotenv = require("dotenv");

dotenv.config({ path: `.env` });
const env = process.env.APP_ENV || 'development';

module.exports = (envname) => {
    return process.env[envname];
}