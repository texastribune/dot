export enum UserPermissions {
  ReadViews = 'dot:view_data',
}

export interface AccessTokenPayload {
  permissions: UserPermissions[];
}

export interface ReprinterItem {
  id: string;
  domain: string;
  reprints: number;
}

export interface ViewsItem {
  id: string;
  canonical?: string | null;
  domain?: string | null;
  views: number;
}

export interface ViewsList {
  items: ViewsItem[];
  totalViews: number;
}
