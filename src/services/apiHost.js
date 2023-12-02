const MODE = process.env.MODE;
const BASE_URL = {
  development: "https://colombia-loan-test.6688-epoch.com",
  production: "https://vfekmp.online",
};

export default BASE_URL[MODE];
