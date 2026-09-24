export interface Link {
  id: string;
  original_url: string;
  short_url: string;
  clicks: number;
  created_at: string;
}

export interface CreateLinkPayload {
  original_url: string;
  short_url: string;
}

export interface GetLinksQueryParams {
  cursor?: string;
  limit?: number;
}

export interface GetLinksResponse {
  links: Link[];
  next_cursor: string | null;
}

export interface ExportLinksResponse {
  url: string;
  filename: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: Array<{ path: string[]; message: string }>;
}
