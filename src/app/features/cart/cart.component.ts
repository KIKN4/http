import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../shared/types/product';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ProductCardComponent, AsyncPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private productsService = inject(ProductsService);
  cartProducts$ = this.productsService.cartProducts$;

  onDeleteProduct(id: string) {
    this.productsService.deleteFromCart(id);
  }
}
