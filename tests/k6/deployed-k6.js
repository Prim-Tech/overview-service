import http from 'k6/http';
import { sleep } from 'k6';

const baseUrl = 'http://3.84.16.18:3030/products';
const duration = '30s';

export default function () {
  http.get(`${baseUrl}`),
  http.get(`${baseUrl}/1`),
  http.get(`${baseUrl}/1/styles`),
  http.get(`${baseUrl}/1/related`),
  sleep(1 / __VU);
}

export const options = {
  vus: 1000,
  duration,
};