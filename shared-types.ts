import { USER_PERMISSIONS } from './shared-config';

export interface AccessTokenPayload {
  permissions: USER_PERMISSIONS[];
  sub: string;
}

interface ViewsItem {
  views: number;
}

export interface ViewsItemByDomain extends ViewsItem {
  domain: string | null;
}

export interface ViewsItemByCanonical extends ViewsItem {
  canonical: string;
}

export interface ViewsList<T extends ViewsItem> {
  items: T[];
  totalViews: number;
}
