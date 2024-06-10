export interface ProductQuery {
  page_size?: number;
  keywords?: string;
  category_id?: string;
  rating?: number;
  page_index?: number;
  price_min?: number;
  price_max?: number;
  sort_by?: SortProductBy;
  sort_direction?: SortDirection;
}

export type SortProductBy = 'rating' | 'price' | 'issue_date' | 'title';
export type SortDirection = 'asc' | 'desc';
