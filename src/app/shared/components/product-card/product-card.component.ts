import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../types/product';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() deleteBtnVisible = false;
  @Output() addToCart = new EventEmitter<string>();
  @Output() deleteProduct = new EventEmitter<string>();
}
