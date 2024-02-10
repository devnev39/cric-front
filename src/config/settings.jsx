const settings = {
  BaseUrl:
    import.meta.env.VITE_ENV === 'production' ?
      import.meta.env.VITE_PROD_URL :
      import.meta.env.VITE_DEV_URL,
};
export default settings;
