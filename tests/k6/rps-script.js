import http from 'k6/http';
import { sleep } from 'k6';

const baseUrl = 'http://localhost:3030/products';
const duration = '30s';

const routes = [
  `${baseUrl}`,
  `${baseUrl}/1`,
  `${baseUrl}/1/styles`,
  `${baseUrl}/1/related`,
];

// function performRequests() {
//   for (const route of routes) {
//     http.get(`${baseUrl}${route}`);
//   }
// }

export default function () {
  http.get(`${baseUrl}`),
  http.get(`${baseUrl}/1`),
  http.get(`${baseUrl}/1/styles`),
  http.get(`${baseUrl}/1/related`),
  sleep(1 / __VU);
}

export const options = {
  vus: 3000, // 10, 100, or 1000
  duration,
};