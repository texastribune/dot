export type UserPermissions = 'dot:view_data';

export interface AccessTokenPayload {
  permissions: UserPermissions[];
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
