import { Component, OnInit, inject } from '@angular/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { ProductsFilterPipe } from '../../shared/pipes/products-filter.pipe';
import { ProductsService } from '../../shared/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { SortDirection, SortProductBy } from '../../shared/types/product-query';

type Direction = 'asc' | 'desc' | null;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductCardComponent,
    FormsModule,
    ProductsFilterPipe,
    AsyncPipe,
    ReactiveFormsModule,
    JsonPipe,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly fb = inject(FormBuilder);
  products$ = this.productsService.products$;

  filterForm = this.fb.group({
    keywords: '',
    sort_By: '',
    sort_Direction: '',
    minPrice: '',
    maxPrice: '',
  });
  priceOptions = [1500, 2000, 2500, 3000, 3500, 4500, 5000, 5500, 6000];

  ngOnInit(): void {
    this.filterForm.addValidators(this.minAndMaxPriceValidator());
    this.filterForm.addValidators(this.sortValidator());

    //  ეს მეთოდი submit ის გარეშე გამოსახავს ეგრევე queryparams  და
    // ამიტომ ეგრევე იფილტრება(იგზავნება რექვესტი) აპი

    // this.filterForm.valueChanges.subscribe((value) => {
    //   this.router.navigate([], {
    //     queryParams: {
    //       keywords: this.filterForm.value.keywords || null,
    //       sort_By: this.filterForm.value.sort_By || null,
    //       sort_Direction: this.filterForm.value.sort_Direction || null,
    //       minPrice: this.filterForm.value.minPrice || null,
    //       maxPrice: this.filterForm.value.maxPrice || null,
    //     },
    //   });
    // });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.filterForm.setValue({
        keywords: params['keywords'] || null,
        sort_By: params['sort_By'] || null,
        sort_Direction: params['sort_Direction'] || null,
        minPrice: params['minPrice'] || null,
        maxPrice: params['maxPrice'] || null,
      });
    });

    this.activatedRoute.queryParamMap.subscribe((query) => {
      let baseParams = {
        keywords: query.get('keywords'),
        page_size: 40,
        page_index: 1,
        sort_by: query.get('sort_By') as SortProductBy,
        sort_direction: query.get('sort_Direction') as SortDirection,
        price_min: Number(query.get('minPrice')),
        price_max: Number(query.get('maxPrice')),
      };

      const params = Object.fromEntries(
        Object.entries(baseParams).filter(
          ([_, value]: any) => value !== '' && value !== 0 && value !== null,
        ),
      );

      this.productsService.getProducts(params);
    });
  }

  get controls() {
    return this.filterForm.controls;
  }

  onAddToCart(id: string) {
    this.productsService.addToCart(id);
  }

  onSubmit() {
    this.router.navigate([], {
      queryParams: {
        keywords: this.filterForm.value.keywords || null,
        sort_By: this.filterForm.value.sort_By || null,
        sort_Direction: this.filterForm.value.sort_Direction || null,
        minPrice: this.filterForm.value.minPrice || null,
        maxPrice: this.filterForm.value.maxPrice || null,
      },
    });
  }

  minAndMaxPriceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.minPrice !== '' && control.value.maxPrice !== ''
        ? null
        : { minAndmaxPrice: 'controls is not valid!' };
    };
  }

  sortValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.sort_By && control.value.sort_Direction
        ? null
        : {
            sortControl: 'უნდა შეავსო ორივე ველი',
          };
    };
  }
}
