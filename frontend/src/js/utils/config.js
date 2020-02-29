const environment = process.env.NODE_ENV || 'development';

const config = {
  production: {
    API_BASE_URL: 'https://deja-api.herokuapp.com',
  },
  development: {
    API_BASE_URL: 'http://localhost:8080',
    // API_BASE_URL: 'https://deja-api.herokuapp.com',
  },
};

export default config[environment];
