import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

let failureCounter = new Counter('my_http_req_failed');

export let options = {
  stages: [
    { duration: '100s', target: 100 }, // ramp up to 100 users
    { duration: '160s', target: 150 }, // stay at 100 users
    { duration: '100s', target: 100 },  // ramp down to 0 users
  ],
  // thresholds: {
  //   http_req_duration: ['avg<2000'], // 99% of requests must complete below 2s
  //   'http_req_failed{error}': ['rate<0.01'], // http errors should be less than 1%
  //   'http_reqs': ['rate>100'], // the rate of requests must be more than 100 RPS
  // },
};

let maxPage = 200003; // replace with your actual max page number
let count = 5; // replace with your actual count

function generateRandom() {
  let page;
  // bias towards the last 10% of the dataset with a 10% probability
  if (Math.random() < 0.1) {
    page = Math.floor(0.9 * maxPage + Math.random() * maxPage * 0.1);
  } else {
    page = Math.floor(Math.random() * maxPage) + 1; // random page number
  }
  return { page, count };
}

export default function () {
  let { page, count } = generateRandom();
  let res = http.get(`http://44.203.115.209/products?page=${page}&count=${count}`);
  
  // check if the http request was successful
  let resultCheck = check(res, {
    'http response status code is 200': (r) => r.status === 200,
  });

  if (!resultCheck) {
    failureCounter.add(1, { error: 'non-200 http response' });
  }

}
