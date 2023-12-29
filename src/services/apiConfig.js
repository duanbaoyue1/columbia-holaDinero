const MODE = process.env.MODE;

// api host
const BASE_URL = {
  development: "https://colombia-loan-test.6688-epoch.com",
  production: "https://hzknbc.fun",
};
export const apiHost = BASE_URL[MODE];

// upload host
const UPLOAD_HOST = {
  development: "http://america-abattoir-test.timespodcast.cloud",
  production: "https://jK7mXq3r.hzknbc.fun",
};
export const uploadHost = UPLOAD_HOST[MODE];
