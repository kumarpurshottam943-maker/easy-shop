import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

      <!-- Breadcrumbs and Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          <span>Home</span>
          <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">chevron_right</mat-icon>
          <span class="text-indigo-600 font-semibold">Products Catalog</span>
          @if (selectedCategory() !== 'All') {
            <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">chevron_right</mat-icon>
            <span class="text-slate-800 font-semibold">{{ selectedCategory() }}</span>
          }
        </div>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All Products
            </h1>
            <p class="text-sm text-slate-500 mt-1">
              Browse through our handpicked collection of premium electronics, fashion, and everyday gear.
            </p>
          </div>

          <!-- Total count and active filters indicator -->
          <div class="text-xs sm:text-sm font-medium text-slate-500">
            Showing <strong class="text-slate-900 font-bold">{{ filteredProducts().length }}</strong> of {{ allProducts.length }} products
          </div>
        </div>
      </div>

      <!-- Controls: Search, Category Pills & Sort -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-8 space-y-4">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

          <!-- Search Input -->
          <div class="relative flex-1 max-w-md">
            <input
              type="text"
              #searchInput
              [value]="searchQuery()"
              (input)="setSearchQuery(searchInput.value)"
              placeholder="Filter by product name, features, brand..."
              class="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-xl pl-10 pr-10 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">search</mat-icon>
            </div>
            @if (searchQuery()) {
              <button
                type="button"
                (click)="clearSearch()"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search query"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">close</mat-icon>
              </button>
            }
          </div>

          <!-- Sort Dropdown -->
          <div class="flex items-center gap-2.5 self-end lg:self-auto">
            <label for="sortBy" class="text-xs font-semibold text-slate-600 whitespace-nowrap flex items-center gap-1">
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">sort</mat-icon>
              <span>Sort By:</span>
            </label>
            <select
              id="sortBy"
              #sortSelect
              [value]="sortBy()"
              (change)="sortBy.set(sortSelect.value)"
              class="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-medium rounded-xl px-3 py-2 border border-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="featured">Featured & Best Deals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>

        </div>

        <!-- Category Filter Pills -->
        <div class="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Categories:</span>
          @for (cat of categories; track cat) {
            <button
              type="button"
              (click)="selectCategory(cat)"
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5"
              [class.bg-indigo-600]="selectedCategory() === cat"
              [class.text-white]="selectedCategory() === cat"
              [class.shadow-md]="selectedCategory() === cat"
              [class.shadow-indigo-500/25]="selectedCategory() === cat"
              [class.bg-slate-100]="selectedCategory() !== cat"
              [class.text-slate-600]="selectedCategory() !== cat"
              [class.hover:bg-slate-200]="selectedCategory() !== cat"
            >
              <span>{{ cat }}</span>
              @if (getCategoryCount(cat) > 0) {
                <span
                  class="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
                  [class.bg-white/20]="selectedCategory() === cat"
                  [class.text-white]="selectedCategory() === cat"
                  [class.bg-slate-200]="selectedCategory() !== cat"
                  [class.text-slate-700]="selectedCategory() !== cat"
                >
                  {{ getCategoryCount(cat) }}
                </span>
              }
            </button>
          }
        </div>
      </div>

      <!-- ACTIVE FILTERS BADGES -->
      @if (selectedCategory() !== 'All' || searchQuery()) {
        <div class="flex items-center flex-wrap gap-2 mb-6">
          <span class="text-xs text-slate-500 font-medium">Active filters:</span>
          @if (selectedCategory() !== 'All') {
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
              Category: {{ selectedCategory() }}
              <button type="button" (click)="selectCategory('All')" class="hover:text-indigo-900 cursor-pointer">
                <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">close</mat-icon>
              </button>
            </span>
          }
          @if (searchQuery()) {
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
              Search: "{{ searchQuery() }}"
              <button type="button" (click)="clearSearch()" class="hover:text-indigo-900 cursor-pointer">
                <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">close</mat-icon>
              </button>
            </span>
          }
          <button
            type="button"
            (click)="resetAllFilters()"
            class="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1"
          >
            Clear All
          </button>
        </div>
      }

      <!-- PRODUCTS GRID -->
      @if (filteredProducts().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of filteredProducts(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      } @else {
        <!-- Empty Results State -->
        <div class="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-12">
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <mat-icon class="!text-[32px] !w-[32px] !h-[32px]">search_off</mat-icon>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No matching products found</h3>
          <p class="text-sm text-slate-500 mb-6">
            We couldn't find any products matching your current search or category criteria. Try adjusting your query or resetting filters.
          </p>
          <button
            type="button"
            (click)="resetAllFilters()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">refresh</mat-icon>
            <span>Reset All Filters</span>
          </button>
        </div>
      }

    </div>
  `
})
export class ProductsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly allProducts = this.productService.getProducts();
  readonly categories: Category[] = this.productService.getCategories();

  readonly selectedCategory = signal<Category>('All');
  readonly searchQuery = signal('');
  readonly sortBy = signal<string>('featured');

  constructor() {
    // Listen to query parameters from URL e.g. /products?category=Electronics&search=watch
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const found = this.categories.find(c => c.toLowerCase() === (params['category'] as string).toLowerCase());
        if (found) {
          this.selectedCategory.set(found);
        }
      } else {
        this.selectedCategory.set('All');
      }

      if (params['search']) {
        this.searchQuery.set(params['search']);
      }
    });
  }

  readonly filteredProducts = computed(() => {
    let list = [...this.allProducts];
    const cat = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();
    const sort = this.sortBy();

    // Filter by Category
    if (cat !== 'All') {
      list = list.filter(p => p.category === cat);
    }

    // Filter by Search Query
    if (query) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  });

  getCategoryCount(cat: Category): number {
    if (cat === 'All') return this.allProducts.length;
    return this.allProducts.filter(p => p.category === cat).length;
  }

  selectCategory(cat: Category): void {
    this.selectedCategory.set(cat);
    this.updateUrlParams();
  }

  setSearchQuery(q: string): void {
    this.searchQuery.set(q);
    this.updateUrlParams();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.updateUrlParams();
  }

  resetAllFilters(): void {
    this.selectedCategory.set('All');
    this.searchQuery.set('');
    this.sortBy.set('featured');
    this.router.navigate(['/products']);
  }

  private updateUrlParams(): void {
    const queryParams: Record<string, string | null> = {};
    if (this.selectedCategory() !== 'All') {
      queryParams['category'] = this.selectedCategory();
    } else {
      queryParams['category'] = null;
    }

    if (this.searchQuery().trim()) {
      queryParams['search'] = this.searchQuery().trim();
    } else {
      queryParams['search'] = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
