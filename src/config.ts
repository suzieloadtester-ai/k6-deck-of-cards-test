import { Options } from 'k6/options';
import { Trend } from 'k6/metrics';

// Change this to switch between test scenarios: 'debug', 'peak', 'stress', 'endurance'
export const TEST_SCENARIO: 'debug' | 'peak' | 'stress' | 'endurance' = 'debug';

export const BASE_URL = 'https://deckofcardsapi.com/api/deck';

export const debugStages = [
  { target: 2, duration: '1s' },   // Ramp to 2 RPS over 1 second for debugging
  { target: 2, duration: '10s' },  // Stay at 2 RPS for 10 seconds while debugging
  { target: 0, duration: '1s' },   // Ramp down to 0 RPS over 1 second
];

export const peakStages = [
  { target: 5, duration: '1m' },   // Ramp to 5 RPS over 1 minute
  { target: 5, duration: '10m' },  // Stay at 5 RPS for 10 minutes
  { target: 0, duration: '1m' },   // Ramp down to 0 RPS over 1 minute
];

export const stressStages = [
  { target: 10, duration: '10m' },  // Ramp to 10 RPS over 10 minutes
  { target: 10, duration: '5m' },   // Stay at 10 RPS for 5 minutes
];

export const enduranceStages = [
  { target: 3, duration: '1m' },    // Ramp to 3 RPS over 1 minute
  { target: 3, duration: '55m' },   // Stay at 3 RPS for 55 minutes
  { target: 0, duration: '1m' },    // Ramp down to 0 RPS over 1 minute
];

export const commonThresholds = {
'http_req_duration{name:CreateShuffle}': [{ threshold: 'p(95)<500', abortOnFail: false }],
  'http_req_duration{name:DrawCards}': [{ threshold: 'p(95)<500', abortOnFail: false }],
  'http_req_duration{name:AddToPile}': [{ threshold: 'p(95)<500', abortOnFail: false }],
  'http_req_duration{name:ListPile}': [{ threshold: 'p(95)<500', abortOnFail: false }],
};

// Scenario configurations
export const debugConfig = {
  executor: 'ramping-arrival-rate',
  startRate: 0,
  timeUnit: '1s',
  preAllocatedVUs: 1,
  maxVUs: 10,
  stages: debugStages,
} as const;

export const peakConfig = {
  executor: 'ramping-arrival-rate',
  startRate: 0,
  timeUnit: '1s',
  preAllocatedVUs: 1,
  maxVUs: 50,
  stages: peakStages,
} as const;

export const stressConfig = {
  executor: 'ramping-arrival-rate',
  startRate: 0,
  timeUnit: '1s',
  preAllocatedVUs: 10,
  maxVUs: 100,
  stages: stressStages,
} as const;

export const enduranceConfig = {
  executor: 'ramping-arrival-rate',
  startRate: 0,
  timeUnit: '1s',
  preAllocatedVUs: 5,
  maxVUs: 50,
  stages: enduranceStages,
} as const;

// Select config based on TEST_SCENARIO
function getScenarioConfig() {
  switch (TEST_SCENARIO) {
    case 'peak':
      return peakConfig;
    case 'stress':
      return stressConfig;
    case 'endurance':
      return enduranceConfig;
    case 'debug':
    default:
      return debugConfig;
  }
}

export const rampingArrivalRateConfig = getScenarioConfig();

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
