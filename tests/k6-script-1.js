import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 20 },
  ],
};

export default function () {
  const baseUrl = 'http://localhost:3030/products';
  http.get(`${baseUrl}`);
  http.get(`${baseUrl}/1`);
  http.get(`${baseUrl}/1/styles`);
  http.get(`${baseUrl}/1/related`);
  sleep(1);
}
