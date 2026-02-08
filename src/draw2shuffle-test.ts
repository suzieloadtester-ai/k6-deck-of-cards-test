import { sleep, group } from 'k6';
import { DeckService } from './services/deckService';
import { defaultOptions } from './config';

export const options = defaultOptions;

export default function () {
  group('Advanced Deck Workflow', () => {
    const deckId = DeckService.createAndShuffle(1);
    let cardCodes: string[] = []; 
    
    group('Draw Cards', () => {
      const numCards = Math.floor(Math.random() * 50) + 1;
      const drawRes = DeckService.drawCards(deckId, numCards);
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