const settings = {
  BaseUrl:
    process.env.VITE_ENV === 'production' ?
      process.env.VITE_ENV_PROD_URL :
      process.env.VITE_ENV_DEV_URL,
};

export default settings;
