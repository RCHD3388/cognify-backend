const env = require('./env');

class DatabaseConfig {
  constructor() {
    this.config = {
      development: {
        username: process.env.DB_USER_DEV,
        password: process.env.DB_PASS_DEV,
        database: process.env.DB_NAME_DEV || 'cognifydb_development',
        host: process.env.DB_HOST_DEV || '127.0.0.1',
        dialect: process.env.DB_DIALECT_DEV || 'mysql',
        port: process.env.DB_PORT_DEV || '3306',
        database: process.env.DB_NAME_DEV || "cognifydb_development",
        host: process.env.DB_HOST_DEV || "127.0.0.1",
        dialect: process.env.DB_DIALECT_DEV || "mysql",
        port: process.env.DB_PORT_DEV || "3306",
      },
      test: {
        username: process.env.DB_USER_TEST || process.env.DB_USERNAME,
        password: process.env.DB_PASS_TEST || process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST || "cognifydb_test",
        host: process.env.DB_HOST_TEST || process.env.DB_HOST,
        dialect: process.env.DB_DIALECT_TEST || 'mysql',
        port: process.env.DB_PORT_TEST || '3306',
        dialect: process.env.DB_DIALECT_TEST || "mysql",
        port: process.env.DB_PORT_TEST || "3306",
      },
      production: {
        username: process.env.DB_USER_PROD,
        password: process.env.DB_PASS_PROD,
        database: process.env.DB_NAME_PROD || "cognifydb_production",
        host: process.env.DB_HOST_PROD,
        dialect: process.env.DB_DIALECT_PROD || 'mysql',
        port: process.env.DB_PORT_PROD || '3306',
      },
        dialect: process.env.DB_DIALECT_PROD || "mysql",
        port: process.env.DB_PORT_PROD || "3306",
      },
    };
  }

  getConfig(config_name) {
    const env_type = process.env.APP_ENV || "development";
    return this.config[env_type][config_name];
  }
}

const databaseConfig = new DatabaseConfig();

module.exports = {
  database: databaseConfig.getConfig("database"),
  username: databaseConfig.getConfig("username"),
  password: databaseConfig.getConfig("password"),
  config: {
    host: databaseConfig.getConfig('host'),
    port: databaseConfig.getConfig('port'),
    dialect: databaseConfig.getConfig('dialect'),
  },
    host: databaseConfig.getConfig("host"),
    port: databaseConfig.getConfig("port"),
    dialect: databaseConfig.getConfig("dialect"),
  },
};

