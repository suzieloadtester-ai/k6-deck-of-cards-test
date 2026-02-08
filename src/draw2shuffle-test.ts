import { sleep, group } from 'k6';
import { Options } from 'k6/options';
import { DeckService } from './services/deckService';


export const options: Options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    'http_req_duration{name:CreateShuffle}': ['p(95)<5000'],
    'http_req_duration{name:DrawCards}': ['p(95)<5000'],
    'http_req_duration{name:AddToPile}': ['p(95)<5000'],
    'http_req_duration{name:ListPile}': ['p(95)<5000'],
  },
};

export default function () {
  group('Advanced Deck Workflow', () => {
    const deckId = DeckService.createAndShuffle(1);
    let cardCodes: string[] = []; 
    
    group('Draw Cards', () => {
      const drawRes = DeckService.drawCards(deckId, 2);
      const cards = drawRes.json('cards') as Array<{ code: string }>;
      cardCodes = cards.map(c => c.code);
    });

    const pileName = 'player1';
    
    group('Manage Piles', () => {
      DeckService.addToPile(deckId, pileName, cardCodes);
      DeckService.listPile(deckId, pileName);
    });
  });

  sleep(1);
}