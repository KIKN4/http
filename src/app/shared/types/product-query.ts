export interface ProductQuery {
  page_size?: number;
  page_index?: number;
  keywords?: string;
  category_id?: string;
  rating?: number;
  price_min?: number;
  price_max?: number;
  sort_by?: SortProductBy;
  sort_direction?: SortDirection;
}

export type SortProductBy = 'rating' | 'price' | 'issue_date' | 'title';
export type SortDirection = 'asc' | 'desc';
