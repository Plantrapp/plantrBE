// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./data/database.db3", // where to change the name of the database
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },

  staging: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./data/database.db3", // where to change the name of the database
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },

  production: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: "./data/database.db3", // where to change the name of the database
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
};
