import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
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
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
export class HomeComponent implements OnInit, AfterViewInit {
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

  ngOnInit(): void {
    this.filterForm.addValidators(this.sortValidator());

    //  ეს მეთოდი submit ის გარეშე გამოსახავს ეგრევე queryparams  და
    // ამიტომ ეგრევე იფილტრება(იგზავნება რექვესტი) აპით

    this.filterForm.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        if (this.filterForm.errors?.['sortControl']) {
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
      });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.filterForm.setValue({
        keywords: params['keywords'] || null,
        sort_By: params['sort_By'] || null,
        sort_Direction: params['sort_Direction'] || null,
        minPrice: params['minPrice'] || 0,
        maxPrice: params['maxPrice'] || 10000,
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
        MINPRICE: Number(query.get('MINPRICE')),
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

  sortValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.sort_By && control.value.sort_Direction
        ? null
        : {
            sortControl: 'უნდა შეავსო ორივე ველი',
          };
    };
  }

  // price filter

  private minPriceValue!: number;
  private maxPriceValue!: number;
  private priceGap = 1000;
  private timeout: any;

  ngAfterViewInit() {
    const rangeInputs = document.querySelectorAll(
      '.range-input input',
    ) as NodeListOf<HTMLInputElement>;
    const priceInputs = document.querySelectorAll(
      '.price-input input',
    ) as NodeListOf<HTMLInputElement>;
    const progress = document.querySelector('.slider .progress') as HTMLElement;

    const updateSlider = () => {
      let minVal = parseInt(rangeInputs[0].value);
      let maxVal = parseInt(rangeInputs[1].value);

      if (maxVal - minVal >= this.priceGap) {
        priceInputs[0].value = minVal.toString();
        priceInputs[1].value = maxVal.toString();
        progress.style.left =
          (minVal / parseInt(rangeInputs[0].max)) * 100 + '%';
        progress.style.right =
          100 - (maxVal / parseInt(rangeInputs[1].max)) * 100 + '%';
      }
    };

    // const updateQueryParams = () => {
    //   if (this.timeout) {
    //     clearTimeout(this.timeout);
    //   }
    //   this.timeout = setTimeout(() => {
    //     this.router.navigate([], {
    //       relativeTo: this.route,
    //       queryParams: {
    //         minPrice: this.minPriceValue,
    //         maxPrice: this.maxPriceValue,
    //       },
    //       queryParamsHandling: 'merge',
    //     });
    //   }, 500);
    // };

    rangeInputs.forEach((input) => {
      input.addEventListener('input', () => {
        let minVal = parseInt(rangeInputs[0].value);
        let maxVal = parseInt(rangeInputs[1].value);

        if (maxVal - minVal < this.priceGap) {
          if (input === rangeInputs[0]) {
            rangeInputs[0].value = (maxVal - this.priceGap).toString();
          } else {
            rangeInputs[1].value = (minVal + this.priceGap).toString();
          }
        }
        this.minPriceValue = parseInt(rangeInputs[0].value);
        this.maxPriceValue = parseInt(rangeInputs[1].value);
        // updateQueryParams();
        updateSlider();
      });
    });

    priceInputs.forEach((input) => {
      input.addEventListener('input', () => {
        let minVal = parseInt(priceInputs[0].value);
        let maxVal = parseInt(priceInputs[1].value);

        if (
          maxVal - minVal >= this.priceGap &&
          minVal >= 0 &&
          maxVal <= parseInt(rangeInputs[0].max)
        ) {
          rangeInputs[0].value = minVal.toString();
          rangeInputs[1].value = maxVal.toString();
          this.minPriceValue = minVal;
          this.maxPriceValue = maxVal;
          // updateQueryParams();
          updateSlider();
        }
      });
    });

    updateSlider();
  }
}
