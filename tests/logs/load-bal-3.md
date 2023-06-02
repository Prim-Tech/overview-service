  scenarios: (100.00%) 1 scenario, 1000 max VUs, 1m0s max duration (incl. graceful stop):
           * default: 1000 looping VUs for 30s (gracefulStop: 30s)


     ✗ status was 200
      ↳  98% — ✓ 90007 / ✗ 1345

     checks.........................: 98.52% ✓ 90007       ✗ 1345  
     data_received..................: 342 MB 8.0 MB/s
     data_sent......................: 8.4 MB 197 kB/s
     http_req_blocked...............: avg=30.56ms  min=377ns   med=1.05µs   max=11.95s p(90)=2µs      p(95)=3.02µs  
     http_req_connecting............: avg=30.56ms  min=0s      med=0s       max=11.95s p(90)=0s       p(95)=0s      
     http_req_duration..............: avg=303.16ms min=18.01ms med=91.54ms  max=21.76s p(90)=434.54ms p(95)=777.52ms
       { expected_response:true }...: avg=299.07ms min=18.01ms med=92.25ms  max=21.76s p(90)=430.76ms p(95)=752.98ms
     http_req_failed................: 1.47%  ✓ 1345        ✗ 90007 
     http_req_receiving.............: avg=38.39ms  min=7.67µs  med=31.82µs  max=10.18s p(90)=74.46ms  p(95)=234.78ms
     http_req_sending...............: avg=11.91µs  min=2.44µs  med=5.14µs   max=8.43ms p(90)=8.52µs   p(95)=17.3µs  
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s     p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=264.76ms min=17.97ms med=77.88ms  max=21.76s p(90)=345.45ms p(95)=669.88ms
     http_reqs......................: 91352  2132.377951/s
     iteration_duration.............: avg=1.34s    min=77.63ms med=563.24ms max=33.79s p(90)=3.44s    p(95)=6.02s   
     iterations.....................: 22838  533.094488/s
     successes......................: 90007  2100.982379/s
     vus............................: 1      min=1         max=1000
     vus_max........................: 1000   min=1000      max=1000


running (0m42.8s), 0000/1000 VUs, 22838 complete and 0 interrupted iterations
default ✓ [======================================] 1000 VUs  30s