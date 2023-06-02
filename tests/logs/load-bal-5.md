 scenarios: (100.00%) 1 scenario, 1000 max VUs, 1m0s max duration (incl. graceful stop):
           * default: 1000 looping VUs for 30s (gracefulStop: 30s)


     ✗ status was 200
      ↳  98% — ✓ 108408 / ✗ 1464

     checks.........................: 98.66% ✓ 108408      ✗ 1464  
     data_received..................: 412 MB 6.9 MB/s
     data_sent......................: 10 MB  169 kB/s
     http_req_blocked...............: avg=27.91ms  min=355ns   med=1.03µs   max=11.51s p(90)=1.79µs   p(95)=2.55µs  
     http_req_connecting............: avg=27.91ms  min=0s      med=0s       max=11.51s p(90)=0s       p(95)=0s      
     http_req_duration..............: avg=261.86ms min=17.31ms med=50.84ms  max=51.91s p(90)=308.37ms p(95)=593.86ms
       { expected_response:true }...: avg=260.71ms min=17.94ms med=51.1ms   max=51.91s p(90)=306.13ms p(95)=584.62ms
     http_req_failed................: 1.33%  ✓ 1464        ✗ 108408
     http_req_receiving.............: avg=20.75ms  min=7.95µs  med=29.92µs  max=33.82s p(90)=18.89ms  p(95)=35.29ms 
     http_req_sending...............: avg=13.05µs  min=2.38µs  med=4.97µs   max=5.18ms p(90)=7.84µs   p(95)=16.22µs 
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s     p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=241.09ms min=17.24ms med=47.27ms  max=51.91s p(90)=295.86ms p(95)=533.35ms
     http_reqs......................: 109872 1831.148048/s
     iteration_duration.............: avg=1.16s    min=77.14ms med=253.15ms max=54.25s p(90)=2.12s    p(95)=5.54s   
     iterations.....................: 27468  457.787012/s
     successes......................: 108408 1806.748741/s
     vus............................: 11     min=11        max=1000
     vus_max........................: 1000   min=1000      max=1000


running (1m00.0s), 0000/1000 VUs, 27468 complete and 11 interrupted iterations
default ✓ [======================================] 1000 VUs  30s