import { Options } from 'k6/options';
import { Trend } from 'k6/metrics';

export const BASE_URL = 'https://deckofcardsapi.com/api/deck';

export const commonStages = [
  { duration: '5s', target: 2 },
  { duration: '20s', target: 2 },
  { duration: '5s', target: 0 },
];

export const commonThresholds = {
  'http_req_duration{name:CreateShuffle}': ['p(95)<5000'],
  'http_req_duration{name:DrawCards}': ['p(95)<5000'],
  'http_req_duration{name:AddToPile}': ['p(95)<5000'],
  'http_req_duration{name:ListPile}': ['p(95)<5000'],
};

export const defaultOptions: Options = {
  stages: commonStages,
  thresholds: commonThresholds,
};

export const trends: { [tag: string]: Trend } = {
  CreateShuffle: new Trend('Trend_CreateShuffle', true),
  DrawCards: new Trend('Trend_DrawCards', true),
  AddToPile: new Trend('Trend_AddToPile', true),
  ListPile: new Trend('Trend_ListPile', true),
};
