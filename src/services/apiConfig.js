const MODE = process.env.MODE;

// api host
const BASE_URL = {
  development: "http://colombia-loan-test.timespodcast.cloud",
  production: "https://hzknbc.fun",
};
export const apiHost = BASE_URL[MODE];

// upload host
const UPLOAD_HOST = {
  development: "http://america-abattoir-test.timespodcast.cloud",
  production: "https://jK7mXq3r.hzknbc.fun",
};
export const uploadHost = UPLOAD_HOST[MODE];
