import { AccessTokenPayload } from '../shared-types';

export type Environments = 'production' | 'staging' | 'development';

export enum ValidTrackerSource {
  Legacy = 'legacy',
  Repub = 'repub',
  Rss = 'rss',
}

export interface TrackerTokenPayload {
  canonical: string;
  source: ValidTrackerSource;
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
