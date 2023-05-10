import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 50 },
    { duration: '45s', target: 250 },
    { duration: '30s', target: 50 },
  ],
};

export default function () {
  const baseUrl = 'http://localhost:3030/products';
  http.get(`${baseUrl}`);
  http.get(`${baseUrl}/1`);
  http.get(`${baseUrl}/1/styles`);
  http.get(`${baseUrl}/1/related`);
  sleep(0.5); // Reduced sleep time
}
