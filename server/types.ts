import { AccessTokenPayload } from '../shared-types';
import { VALID_TRACKER_SOURCE } from './config';

export type Environments = 'production' | 'staging' | 'development';

export interface TrackerTokenPayload {
  canonical: string;
  source: VALID_TRACKER_SOURCE;
  version: string;
}

export interface GQLContext {
  user: AccessTokenPayload;
}

export interface ViewsListByCanonicalArgs {
  domain?: string | null;
  endDate: string;
  startDate: string;
}

export interface ViewsListByDomainArgs {
  canonical?: string;
  endDate: string;
  startDate: string;
}
