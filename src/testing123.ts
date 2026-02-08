import http from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';

export const options: Options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'], 
  },
};

export default function () {
  const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/';
  const res = http.get(url);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has valid deck_id': (r) => {
      const body = r.json() as { deck_id: string };
      return body && body.deck_id !== undefined;
    },
  });
  if (res.status === 200) {
    const data = res.json() as { deck_id: string };
    console.log(`Live API Success! Deck ID: ${data.deck_id}`);
  }
  sleep(1);
}