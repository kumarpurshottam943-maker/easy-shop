import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, MatIconModule, ProductCardComponent],
  template: `
    @if (product(); as p) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <!-- Top Navigation / Breadcrumbs -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
            <a routerLink="/" class="hover:text-indigo-600 transition-colors">Home</a>
            <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">chevron_right</mat-icon>
            <a routerLink="/products" class="hover:text-indigo-600 transition-colors">Products</a>
            <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">chevron_right</mat-icon>
            <a [routerLink]="['/products']" [queryParams]="{ category: p.category }" class="hover:text-indigo-600 transition-colors">
              {{ p.category }}
            </a>
            <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">chevron_right</mat-icon>
            <span class="text-slate-800 font-semibold truncate max-w-[150px] sm:max-w-xs">{{ p.name }}</span>
          </div>

          <!-- Back to Products Button -->
          <a
            routerLink="/products"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">arrow_back</mat-icon>
            <span>Back to Products</span>
          </a>
        </div>

        <!-- Product Main Container -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs mb-14">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

            <!-- Left: Large Image & Gallery -->
            <div class="lg:col-span-6 space-y-4">
              <div class="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
                <img
                  [src]="activeImage()"
                  [alt]="p.name"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                @if (p.tag) {
                  <span class="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                    {{ p.tag }}
                  </span>
                }
                @if (discountPercent() > 0) {
                  <span class="absolute top-4 right-4 px-3 py-1 bg-rose-500 text-white text-xs font-extrabold rounded-full shadow-md">
                    -{{ discountPercent() }}% OFF
                  </span>
                }
              </div>

              <!-- Thumbnails selector (if additional images exist) -->
              @if (p.additionalImages && p.additionalImages.length > 1) {
                <div class="flex items-center gap-3 overflow-x-auto pb-2">
                  @for (img of p.additionalImages; track img) {
                    <button
                      type="button"
                      (click)="setActiveImage(img)"
                      class="relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer"
                      [class.border-indigo-600]="activeImage() === img"
                      [class.ring-2]="activeImage() === img"
                      [class.ring-indigo-100]="activeImage() === img"
                      [class.border-slate-200]="activeImage() !== img"
                    >
                      <img [src]="img" [alt]="p.name" referrerpolicy="no-referrer" class="w-full h-full object-cover" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Right: Product Information & Purchase Panel -->
            <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div class="space-y-4">

                <!-- Category & Stock Status -->
                <div class="flex items-center justify-between gap-2">
                  <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide">
                    {{ p.category }}
                  </span>

                  @if (p.inStock) {
                    <span class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      In Stock ({{ p.stockCount }} units ready to ship)
                    </span>
                  } @else {
                    <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                      Out of stock
                    </span>
                  }
                </div>

                <!-- Product Title -->
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {{ p.name }}
                </h1>

                <!-- Ratings & Reviews Count -->
                <div class="flex items-center gap-3">
                  <div class="flex items-center text-amber-400">
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">star</mat-icon>
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">star</mat-icon>
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">star</mat-icon>
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">star</mat-icon>
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">star_half</mat-icon>
                  </div>
                  <span class="font-bold text-slate-900 text-sm">{{ p.rating }}</span>
                  <span class="text-slate-400 text-sm">({{ p.ratingCount }} verified customer ratings)</span>
                </div>

                <!-- Price Section -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
                  <span class="text-3xl sm:text-4xl font-extrabold text-indigo-600">
                    {{ p.price | currency }}
                  </span>
                  @if (p.originalPrice) {
                    <span class="text-lg text-slate-400 line-through font-medium">
                      {{ p.originalPrice | currency }}
                    </span>
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Save {{ (p.originalPrice - p.price) | currency }}
                    </span>
                  }
                </div>

                <!-- Description -->
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Overview</h3>
                  <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {{ p.description }}
                  </p>
                </div>

                <!-- Key Features Bullet List -->
                @if (p.features && p.features.length > 0) {
                  <div>
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Highlights</h3>
                    <ul class="space-y-2">
                      @for (feature of p.features; track feature) {
                        <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <mat-icon class="!text-[18px] !w-[18px] !h-[18px] text-emerald-500 shrink-0 mt-0.5">check_circle</mat-icon>
                          <span>{{ feature }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }

              </div>

              <!-- Quantity Selector and Action Buttons -->
              <div class="pt-6 border-t border-slate-100 space-y-4">
                <div class="flex items-center gap-4">
                  <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
                  <div class="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      type="button"
                      (click)="decrementQty()"
                      [disabled]="quantity() <= 1"
                      class="w-9 h-9 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">remove</mat-icon>
                    </button>
                    <span class="w-12 text-center font-bold text-slate-900 text-sm select-none">
                      {{ quantity() }}
                    </span>
                    <button
                      type="button"
                      (click)="incrementQty()"
                      [disabled]="quantity() >= p.stockCount"
                      class="w-9 h-9 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">add</mat-icon>
                    </button>
                  </div>
                  <span class="text-xs text-slate-500 font-medium">Total: {{ (p.price * quantity()) | currency }}</span>
                </div>

                <!-- Main Action Buttons -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    (click)="addToCart()"
                    class="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                  >
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">add_shopping_cart</mat-icon>
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    (click)="buyNow()"
                    class="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                  >
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">bolt</mat-icon>
                    <span>Buy Now</span>
                  </button>
                </div>

                <!-- Safe Checkout Guarantee -->
                <div class="flex items-center justify-around gap-2 pt-3 border-t border-slate-100 text-slate-500 text-xs">
                  <span class="flex items-center gap-1">
                    <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">verified</mat-icon>
                    Genuine Brand
                  </span>
                  <span class="flex items-center gap-1">
                    <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-blue-600">local_shipping</mat-icon>
                    Fast Delivery
                  </span>
                  <span class="flex items-center gap-1">
                    <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-purple-600">cached</mat-icon>
                    30-Day Returns
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>

        <!-- RELATED PRODUCTS SECTION -->
        @if (relatedProducts().length > 0) {
          <div class="mt-14">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Related Products in {{ p.category }}
                </h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Customers also loved these matching items</p>
              </div>
              <a
                [routerLink]="['/products']"
                [queryParams]="{ category: p.category }"
                class="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View More</span>
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">chevron_right</mat-icon>
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (item of relatedProducts(); track item.id) {
                <app-product-card [product]="item" />
              }
            </div>
          </div>
        }

      </div>
    } @else {
      <!-- Product Not Found State -->
      <div class="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl text-center border border-slate-200 shadow-sm">
        <div class="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <mat-icon class="!text-[32px] !w-[32px] !h-[32px]">error_outline</mat-icon>
        </div>
        <h2 class="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p class="text-sm text-slate-500 mb-6">The requested product could not be found or may have been removed.</p>
        <a
          routerLink="/products"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">arrow_back</mat-icon>
          <span>Return to Catalog</span>
        </a>
      </div>
    }
  `
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly product = signal<Product | undefined>(undefined);
  readonly activeImage = signal<string>('');
  readonly quantity = signal<number>(1);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const id = parseInt(idStr, 10);
        const item = this.productService.getProductById(id);
        this.product.set(item);
        if (item) {
          this.activeImage.set(item.image);
          this.quantity.set(1);
          // Scroll window to top when navigating to details
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    });
  }

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (p && p.originalPrice && p.originalPrice > p.price) {
      return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    }
    return 0;
  });

  readonly relatedProducts = computed(() => {
    const current = this.product();
    if (!current) return [];
    return this.productService
      .getProducts()
      .filter(p => p.category === current.category && p.id !== current.id)
      .slice(0, 4);
  });

  setActiveImage(img: string): void {
    this.activeImage.set(img);
  }

  incrementQty(): void {
    const current = this.product();
    if (current && this.quantity() < current.stockCount) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
    }
  }

  buyNow(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      this.router.navigate(['/cart']);
    }
  }
}
