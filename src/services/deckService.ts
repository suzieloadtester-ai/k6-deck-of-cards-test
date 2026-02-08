import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'https://deckofcardsapi.com/api/deck';

export class DeckService {

  static createAndShuffle(count: number = 1): string {
    const res = http.get(`${BASE_URL}/new/shuffle/?deck_count=${count}`, { tags: { name: 'CreateShuffle' } });
    check(res, {
      'shuffle success': (r) => r.status === 200,
    });
    return res.json('deck_id') as string;
  }

  static drawCards(deckId: string, count: number) {
    const res = http.get(`${BASE_URL}/${deckId}/draw/?count=${count}`, { tags: { name: 'DrawCards' } });
    check(res, {
      'draw success': (r) => r.status === 200,
    });
    return res;
  }

  static addToPile(deckId: string, pileName: string, cardCodes: string[]) {
    const codes = cardCodes.join(',');
    const res = http.get(`${BASE_URL}/${deckId}/pile/${pileName}/add/?cards=${codes}`, { tags: { name: 'AddToPile' } });
    
    check(res, {
      'add to pile status is 200': (r) => r.status === 200,
      'pile has cards': (r) => (r.json(`piles.${pileName}.remaining`) as number) > 0,
    });
    return res;
  }

  static listPile(deckId: string, pileName: string) {
    const res = http.get(`${BASE_URL}/${deckId}/pile/${pileName}/list/`, { tags: { name: 'ListPile' } });
    check(res, {
      'list pile success': (r) => r.status === 200,
    });
    return res;
  }
}