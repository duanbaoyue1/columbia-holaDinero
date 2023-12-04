const MODE = process.env.MODE;

// api host
const BASE_URL = {
  development: "https://colombia-loan-test.6688-epoch.com",
  production: "",
};
export const apiHost = BASE_URL[MODE];

// upload host
const UPLOAD_HOST = {
  development: "http://abattoir-test.epoch-api.com",
  production: "",
};
export const uploadHost = UPLOAD_HOST[MODE];
