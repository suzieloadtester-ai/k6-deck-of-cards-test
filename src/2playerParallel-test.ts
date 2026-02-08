import { sleep, group } from 'k6';
import { Options } from 'k6/options';
import { DeckService } from './services/deckService';


export const options: Options = {
  scenarios: {
    player1: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 1 },
        { duration: '20s', target: 1 },
        { duration: '5s', target: 0 },
      ],
      exec: 'player1',
    },
    player2: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 1 },
        { duration: '20s', target: 1 },
        { duration: '5s', target: 0 },
      ],
      exec: 'player2',
    },
  },
  thresholds: {
    'http_req_duration{name:CreateShuffle}': ['p(95)<5000'],
    'http_req_duration{name:DrawCards}': ['p(95)<5000'],
    'http_req_duration{name:AddToPile}': ['p(95)<5000'],
    'http_req_duration{name:ListPile}': ['p(95)<5000'],
  },
};
export function setup() {
  const deck1 = DeckService.createAndShuffle(1);
  const deck2 = DeckService.createAndShuffle(1);
  return { deck1, deck2 };
}

export function player1(data: { deck1: string; deck2: string }) {
  const deckId = data.deck1;
  group('Player 1 Deck Workflow', () => {
    let player1Cards: string[] = [];

    group('Draw Cards for Player 1', () => {
      const numCards = Math.floor(Math.random() * 50) + 1;
      const drawRes = DeckService.drawCards(deckId, numCards);
      const cards = drawRes.json('cards') as Array<{ code: string }>;
      player1Cards = cards.map((c) => c.code);
    });

    group('Manage Pile Player 1', () => {
      DeckService.addToPile(deckId, 'player1', player1Cards);
      DeckService.listPile(deckId, 'player1');
    });
  });

  sleep(1);
}

export function player2(data: { deck1: string; deck2: string }) {
  const deckId = data.deck2;
  group('Player 2 Deck Workflow', () => {
    let player2Cards: string[] = [];

    group('Draw Cards for Player 2', () => {
      const numCards = Math.floor(Math.random() * 50) + 1;
      const drawRes = DeckService.drawCards(deckId, numCards);
      const cards = drawRes.json('cards') as Array<{ code: string }>;
      player2Cards = cards.map((c) => c.code);
    });

    group('Manage Pile Player 2', () => {
      DeckService.addToPile(deckId, 'player2', player2Cards);
      DeckService.listPile(deckId, 'player2');
    });
  });

  sleep(1);
}