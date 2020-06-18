import { AccessTokenPayload } from '../shared-types';

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

export enum UserPermissions {
  ReadViews = 'dot:view_data',
}

export interface GQLContext {
  user: AccessTokenPayload;
}
