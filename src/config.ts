import { Options } from 'k6/options';
import { Trend } from 'k6/metrics';

export const BASE_URL = 'https://deckofcardsapi.com/api/deck';

export const commonStages = [
  { target: 2, duration: '5s' },   // Ramp to 2 RPS over 5 seconds
  { target: 2, duration: '10s' },  // Stay at 2 RPS for 10 seconds
  { target: 0, duration: '5s' },   // Ramp down to 0 RPS over 5 seconds
];

export const commonThresholds = {
  'http_req_duration{name:CreateShuffle}': ['p(95)<5000'],
  'http_req_duration{name:DrawCards}': ['p(95)<5000'],
  'http_req_duration{name:AddToPile}': ['p(95)<5000'],
  'http_req_duration{name:ListPile}': ['p(95)<5000'],
};

export const rampingArrivalRateConfig = {
  executor: 'ramping-arrival-rate',
  startRate: 0,
  timeUnit: '1s',
  preAllocatedVUs: 1,
  maxVUs: 10,
  stages: commonStages,
} as const;

export const defaultOptions: Options = {
  scenarios: {
    default: rampingArrivalRateConfig,
  },
  thresholds: commonThresholds,
};

export const trends: { [tag: string]: Trend } = {
  CreateShuffle: new Trend('Trend_CreateShuffle', true),
  DrawCards: new Trend('Trend_DrawCards', true),
  AddToPile: new Trend('Trend_AddToPile', true),
  ListPile: new Trend('Trend_ListPile', true),
};
