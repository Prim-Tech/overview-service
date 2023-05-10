import http from 'k6/http';
import { sleep } from 'k6';

const baseURL = 'http://localhost:3030/products';
const duration = '30s';

const routes = [
  `${baseURL}`,
  `${baseURL}/1`,
  `${baseURL}/1/styles`,
  `${baseURL}/1/related`,
];

function performRequests() {
  for (const route of routes) {
    http.get(`${baseURL}${route}`);
  }
}

export default function () {
  performRequests();
  sleep(1 / __VU);
}

export const options = {
  vus: 1, // 10, 100, or 1000
  duration: duration,
};