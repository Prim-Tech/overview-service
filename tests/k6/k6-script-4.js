import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1000 },
    { duration: '20s', target: 1000 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const baseUrl = 'http://localhost:3030/products';

  const requests = [
    http.get(`${baseUrl}`),
    http.get(`${baseUrl}/1`),
    http.get(`${baseUrl}/1/styles`),
    http.get(`${baseUrl}/1/related`),
  ];

  Promise.all(requests).then((responses) => {
    check(responses[0], {'status is 200': (r) => r.status === 200});
    check(responses[1], {'status is 200': (r) => r.status === 200});
    check(responses[2], {'status is 200': (r) => r.status === 200});
    check(responses[3], {'status is 200': (r) => r.status === 200});
  });
}
