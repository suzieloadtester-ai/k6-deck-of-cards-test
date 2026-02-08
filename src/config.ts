import { Options } from 'k6/options';

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
