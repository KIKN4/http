import { Product } from './product';

export interface GetProductsResponse {
  total: number;
  limit: number;
  page: number;
  skip: number;
  products: Product[];
}
