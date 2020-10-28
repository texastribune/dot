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
  endDate: Date;
  startDate: Date;
}

export interface ViewsListByDomainArgs {
  canonical?: string;
  endDate: Date;
  startDate: Date;
}
