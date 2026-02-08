import { sleep, group } from 'k6';
import { DeckService } from './services/deckService';
import { defaultOptions } from './config';

export const options = defaultOptions;

export default function () {
  group('2 Player Deck Workflow', () => {
    const deckId = DeckService.createAndShuffle(1);
    let player1Cards: string[] = []; 
    let player2Cards: string[] = [];
    
    group('Draw Cards for Player 1', () => {
      const numCards = Math.floor(Math.random() * 50) + 1;
      const drawRes = DeckService.drawCards(deckId, numCards);
      const cards = drawRes.json('cards') as Array<{ code: string }>;
      player1Cards = cards.map(c => c.code);
    });

    group('Draw Cards for Player 2', () => {
      const numCards = Math.floor(Math.random() * 50) + 1;
      const drawRes = DeckService.drawCards(deckId, numCards);
      const cards = drawRes.json('cards') as Array<{ code: string }>;
      player2Cards = cards.map(c => c.code);
    });
    
    group('Manage Piles', () => {
      DeckService.addToPile(deckId, 'player1', player1Cards);
      DeckService.listPile(deckId, 'player1');
      
      DeckService.addToPile(deckId, 'player2', player2Cards);
      DeckService.listPile(deckId, 'player2');
    });
  });

  sleep(1);
}