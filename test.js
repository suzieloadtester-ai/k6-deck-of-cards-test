import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1, 
  duration: '10s', 
};

export default function () {
  // Targeting the live production API
  const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/';

  const res = http.get(url);

  // Verification
  check(res, {
    'is status 200': (r) => r.status === 200,
    'has deck_id': (r) => r.json().deck_id !== undefined,
  });

  // Log the deck_id to see real-time data flow
  if (res.status === 200) {
    console.log(`Success! New Deck ID: ${res.json().deck_id}`);
  }

  sleep(1);
}