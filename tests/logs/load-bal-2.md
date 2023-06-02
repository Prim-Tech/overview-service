 scenarios: (100.00%) 1 scenario, 1000 max VUs, 1m0s max duration (incl. graceful stop):
           * default: 1000 looping VUs for 30s (gracefulStop: 30s)


     ✗ status was 200
      ↳  97% — ✓ 66178 / ✗ 1862

     checks.........................: 97.26% ✓ 66178       ✗ 1862  
     data_received..................: 252 MB 7.1 MB/s
     data_sent......................: 6.3 MB 177 kB/s
     http_req_blocked...............: avg=48.22ms  min=375ns   med=1.07µs  max=23.51s p(90)=2.14µs   p(95)=6.54µs  
     http_req_connecting............: avg=48.21ms  min=0s      med=0s      max=23.51s p(90)=0s       p(95)=0s      
     http_req_duration..............: avg=406.23ms min=17.38ms med=93.6ms  max=25.92s p(90)=644.45ms p(95)=1.32s   
       { expected_response:true }...: avg=392.09ms min=18.05ms med=95.07ms max=25.92s p(90)=604.74ms p(95)=1.14s   
     http_req_failed................: 2.73%  ✓ 1862        ✗ 66178 
     http_req_receiving.............: avg=66.05ms  min=6.62µs  med=36.4µs  max=19.18s p(90)=176.7ms  p(95)=347.61ms
     http_req_sending...............: avg=17.59µs  min=2.4µs   med=5.21µs  max=5.08ms p(90)=9.49µs   p(95)=19.06µs 
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s      max=0s     p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=340.16ms min=17.35ms med=67.88ms max=23.92s p(90)=471.4ms  p(95)=1.12s   
     http_reqs......................: 68040  1919.390152/s
     iteration_duration.............: avg=1.82s    min=78.91ms med=706.9ms max=31.42s p(90)=4.77s    p(95)=8.51s   
     iterations.....................: 17010  479.847538/s
     successes......................: 66178  1866.863631/s
     vus............................: 7      min=7         max=1000
     vus_max........................: 1000   min=1000      max=1000


running (0m35.4s), 0000/1000 VUs, 17010 complete and 0 interrupted iterations
default ✓ [======================================] 1000 VUs  30s