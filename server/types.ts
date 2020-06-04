export enum ValidTrackerSource {
  Legacy = 'legacy',
  Repub = 'repub',
}

export enum ValidTrackerType {
  Script = 'script',
}

export interface TrackerTokenPayload {
  version: string;
  canonical: string;
  source: ValidTrackerSource;
  type: ValidTrackerType;
}

export interface CreateViewArgs {
  token: string;
  domain: string;
  referrer?: string;
}
