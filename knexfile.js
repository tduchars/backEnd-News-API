const ENV = process.env.NODE_ENV || 'development';
const { DATABASE_URL } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
    }
  },
  production: {
    connection: `${DATABASE_URL}?ssl=true`
  }
};
console.log({ ...customConfig[ENV], ...baseConfig });
module.exports = { ...customConfig[ENV], ...baseConfig };
