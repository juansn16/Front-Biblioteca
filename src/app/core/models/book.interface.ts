export interface Book {
  id: string;
  title: string;
  author_id: string;
  author?: Author;
  publish_year: number;
  copies: number;
  available_copies: number;
  cover_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookRequest {
  title: string;
  author_id: string;
  publish_year: number;
  copies: number;
  cover_url: string;
}

export interface UpdateBookRequest extends CreateBookRequest {}

export interface Author {
  id: string;
  name: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAuthorRequest {
  name: string;
  bio: string;
}

export interface UpdateAuthorRequest extends CreateAuthorRequest {}