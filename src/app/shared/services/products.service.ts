import { Injectable, inject } from '@angular/core';
import { Product, ProductDetails } from '../types/product';
import { BehaviorSubject } from 'rxjs';
import { ENVIRONMENT } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GetProductsResponse } from '../types/response';
import { ProductQuery } from '../types/product-query';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private httpClient = inject(HttpClient);
  private env = inject(ENVIRONMENT);
  private baseUrl = `${this.env.apiUrl}/shop/products`;

  products$ = new BehaviorSubject<Product[]>([]);
  cartProducts$ = new BehaviorSubject<Product[]>([]);

  addToCart(productId: string) {
    const product = this.products$.value.find((prod) => prod._id === productId);
    if (product) {
      const updatedCart = [...this.cartProducts$.value, product];
      this.cartProducts$.next(updatedCart);
    }
  }

  deleteFromCart(id: string) {
    const updatedProducts = this.cartProducts$.value.filter(
      (prod) => prod._id !== id,
    );
    this.cartProducts$.next(updatedProducts);
  }

  getProductById(id: string | null) {
    return this.httpClient.get<ProductDetails>(`${this.baseUrl}/id/${id}`);
  }

  getProducts(query: ProductQuery) {
    return this.httpClient
      .get<GetProductsResponse>(`${this.baseUrl}/search`, {
        params: {
          ...query,
        },
      })
      .subscribe((response) => {
        this.products$.next(response.products);
      });
  }
}
