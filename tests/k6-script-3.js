import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    warm_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
      ],
      gracefulRampDown: '30s',
      gracefulStop: '30s',
    },
    peak_stress: {
      executor: 'ramping-vus',
      startTime: '1m',
      startVUs: 50,
      stages: [
        { duration: '30s', target: 300 },
        { duration: '1m', target: 300 },
        { duration: '30s', target: 50 },
      ],
      gracefulRampDown: '30s',
      gracefulStop: '30s',
    },
    extended_stress: {
      executor: 'ramping-vus',
      startTime: '3m',
      startVUs: 50,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '3m', target: 150 },
        { duration: '1m', target: 50 },
      ],
      gracefulRampDown: '30s',
      gracefulStop: '30s',
    },
  },
};

export default function () {
  const baseUrl = 'http://localhost:3030/products';
  http.get(`${baseUrl}`);
  http.get(`${baseUrl}/1`);
  http.get(`${baseUrl}/1/styles`);
  http.get(`${baseUrl}/1/related`);
  sleep(1);
}
