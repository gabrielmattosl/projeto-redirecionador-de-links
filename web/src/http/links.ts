import {
  Link,
  CreateLinkPayload,
  GetLinksQueryParams,
  GetLinksResponse,
  ExportLinksResponse,
} from '@/types/link';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333').replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Erro ${response.status}: Requisição falhou.`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export async function createLink(payload: CreateLinkPayload): Promise<Link> {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<Link>(response);
}

export async function getLinks(params?: GetLinksQueryParams): Promise<GetLinksResponse> {
  const searchParams = new URLSearchParams();
  if (params?.cursor) {
    searchParams.set('cursor', params.cursor);
  }
  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/links${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<GetLinksResponse>(response);
}

export async function deleteLink(shortUrl: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/links/${encodeURIComponent(shortUrl)}`, {
    method: 'DELETE',
  });

  return handleResponse<void>(response);
}

export async function incrementLink(shortUrl: string): Promise<{ original_url: string }> {
  const response = await fetch(`${API_BASE_URL}/links/${encodeURIComponent(shortUrl)}/increment`, {
    method: 'PATCH',
  });

  return handleResponse<{ original_url: string }>(response);
}

export async function exportLinks(): Promise<ExportLinksResponse> {
  const response = await fetch(`${API_BASE_URL}/links/export`, {
    method: 'POST',
  });

  return handleResponse<ExportLinksResponse>(response);
}
