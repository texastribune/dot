export interface AccessTokenPayload {
  permissions: string[];
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
