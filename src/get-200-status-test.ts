import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export let options:Options = {
  vus: 2,
  duration: '10s',
  insecureSkipTLSVerify: true,
};

export default () => {
//const res = http.get('http://127.0.0.1:8000/api/deck/new/shuffle/?deck_count=1');

 // const res = http.get('http://localhost:8000/api/deck/new/shuffle/?deck_count=1');
 // const res = http.get('http://localhost:8000');
  // const res = http.get('https://test-api.k6.io'); //
  const res = http.post('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
//  const res = http.post('http://localhost:8000/api/deck/new/shuffle/?deck_count=1');

  check(res, {
    'status is 200': () => res.status === 200,
  });
  console.log('prod get shuffle api res: ' + JSON.stringify(res));
  sleep(1);
};
