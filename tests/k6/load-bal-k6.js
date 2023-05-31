import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// A counter for successful status codes
let successCounter = new Counter('successes');

const baseUrl = 'http://34.227.22.185/products';
const duration = '30s';

function getAndCheck(url) {
  let res = http.get(url);
  let isSuccess = check(res, { 'status was 200': (r) => r.status === 200 });
  if (isSuccess) {
    successCounter.add(1);
  }
}

export default function () {
  getAndCheck(`${baseUrl}`),
  getAndCheck(`${baseUrl}/1`),
  getAndCheck(`${baseUrl}/1/styles`),
  getAndCheck(`${baseUrl}/1/related`),
  sleep(1 / __VU);
}

export const options = {
  vus: 1000,
  duration,
};
