import { AccessTokenPayload } from '../shared-types';

// tracker stuff
export enum ValidTrackerSource {
  Legacy = 'legacy',
  Repub = 'repub',
}

export enum ValidTrackerType {
  Script = 'script',
}

export interface TrackerTokenPayload {
  canonical: string;
  source: ValidTrackerSource;
  type: ValidTrackerType;
  version: string;
}

// permissions stuff
export enum UserPermissions {
  ReadViews = 'dot:view_data',
}

// GraphQL stuff
export interface GQLContext {
  user: AccessTokenPayload;
}

export interface CreateViewArgs {
  domain: string;
  referrer?: string;
  token: string;
  version: string;
}

export interface ViewsItem {
  id: string;
  canonical?: string;
  domain?: string;
  views: number;
}

export interface ViewsList {
  items: ViewsItem[];
  totalViews: number;
}

export interface ViewsListByCanonicalArgs {
  domain?: string;
  endDate: string;
  startDate: string;
}

export interface ViewsListByDomainArgs {
  canonical?: string;
  endDate: string;
  startDate: string;
}

export interface ReprinterItem {
  id: string;
  domain: string;
  reprints: number;
}
