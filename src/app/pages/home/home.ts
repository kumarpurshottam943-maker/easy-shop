import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, ProductCardComponent],
  template: `
    <div>
      <!-- HERO BANNER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
        <!-- Abstract glowing background circles -->
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <!-- Hero Left Content -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-indigo-300">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIMITED TIME OFFER • FALL & WINTER COLLECTION</span>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Big Sale – Up to <span class="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">50% Off</span>
              </h1>

              <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Elevate your everyday lifestyle with trendsetting fashion, state-of-the-art tech audio, and essential accessories. Handcrafted quality at prices you will love.
              </p>

              <!-- Search Bar in Hero -->
              <div class="max-w-md mx-auto lg:mx-0 pt-2">
                <div class="relative flex items-center">
                  <input
                    type="text"
                    #heroSearch
                    (keydown.enter)="onSearch(heroSearch.value)"
                    placeholder="Search smartwatches, sneakers, hoodies..."
                    class="w-full bg-white/10 backdrop-blur-md text-white placeholder-slate-300 text-sm rounded-full pl-11 pr-28 py-3.5 border border-white/20 focus:outline-hidden focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/30 transition-all"
                  />
                  <div class="absolute left-3.5 flex items-center pointer-events-none text-slate-300">
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">search</mat-icon>
                  </div>
                  <button
                    type="button"
                    (click)="onSearch(heroSearch.value)"
                    class="absolute right-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-full shadow-md transition-all cursor-pointer"
                  >
                    Find
                  </button>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  routerLink="/products"
                  class="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
                >
                  <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">shopping_bag</mat-icon>
                  <span>Shop Now</span>
                </a>
                <a
                  routerLink="/products"
                  [queryParams]="{ category: 'Electronics' }"
                  class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-all cursor-pointer"
                >
                  <span>Explore Electronics</span>
                  <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">arrow_forward</mat-icon>
                </a>
              </div>

              <!-- Trust Metrics -->
              <div class="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
                <div>
                  <div class="text-2xl font-bold text-white">10k+</div>
                  <div class="text-xs text-slate-400">Happy Shoppers</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-white">4.9 / 5</div>
                  <div class="text-xs text-slate-400">Average Rating</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-white">24h</div>
                  <div class="text-xs text-slate-400">Fast Dispatch</div>
                </div>
              </div>
            </div>

            <!-- Hero Right Image Showcase -->
            <div class="lg:col-span-5 relative flex justify-center">
              <div class="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="Sony WH-1000XM5 Wireless Headphones Hero Feature"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                <!-- Floating Product Info Pill -->
                <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 shadow-xl border border-white/50 flex items-center justify-between">
                  <div>
                    <span class="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Editor's Choice</span>
                    <h4 class="font-bold text-sm text-slate-900">Sony WH-1000XM5 ANC</h4>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="font-extrabold text-indigo-700 text-base">$299.99</span>
                      <span class="text-xs text-slate-400 line-through">$399.99</span>
                    </div>
                  </div>
                  <a
                    [routerLink]="['/product', 1]"
                    class="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
                    aria-label="View Product Details"
                  >
                    <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">arrow_forward</mat-icon>
                  </a>
                </div>

                <!-- Floating Sale Tag -->
                <div class="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-rose-500 text-white text-xs font-extrabold shadow-lg animate-bounce">
                  SAVE $100
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- VALUE PROPOSITIONS BAR -->
      <section class="bg-white border-y border-slate-200/80 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">local_shipping</mat-icon>
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900">Free Express Shipping</h4>
                <p class="text-xs text-slate-500">Free delivery on orders over $75</p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">verified_user</mat-icon>
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900">30-Day Money Back</h4>
                <p class="text-xs text-slate-500">Hassle-free easy returns policy</p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">lock</mat-icon>
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900">100% Secure Checkout</h4>
                <p class="text-xs text-slate-500">Bank-level 256-bit encryption</p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">support_agent</mat-icon>
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900">24/7 Dedicated Support</h4>
                <p class="text-xs text-slate-500">Instant customer service team</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- SHOP BY POPULAR CATEGORIES -->
      <section class="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <span>EXPLORE COLLECTIONS</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <a
            routerLink="/products"
            class="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span>View All Categories</span>
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">chevron_right</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <!-- Electronics Category Card -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'Electronics' }"
            class="group relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
              alt="Electronics Category"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="text-xs text-indigo-300 font-semibold">4 items available</span>
              <h3 class="font-bold text-lg sm:text-xl">Electronics</h3>
            </div>
          </a>

          <!-- Fashion Category Card -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'Fashion' }"
            class="group relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
              alt="Fashion Category"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="text-xs text-indigo-300 font-semibold">3 items available</span>
              <h3 class="font-bold text-lg sm:text-xl">Fashion</h3>
            </div>
          </a>

          <!-- Accessories Category Card -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'Accessories' }"
            class="group relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
              alt="Accessories Category"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="text-xs text-indigo-300 font-semibold">3 items available</span>
              <h3 class="font-bold text-lg sm:text-xl">Accessories</h3>
            </div>
          </a>

          <!-- Home & Living Category Card -->
          <a
            routerLink="/products"
            [queryParams]="{ category: 'Home & Living' }"
            class="group relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
              alt="Home & Living Category"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="text-xs text-indigo-300 font-semibold">2 items available</span>
              <h3 class="font-bold text-lg sm:text-xl">Home & Living</h3>
            </div>
          </a>
        </div>
      </section>

      <!-- FEATURED PRODUCTS SECTION -->
      <section class="py-14 sm:py-18 bg-slate-100/60 border-y border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <span>HANDPICKED FOR YOU</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p class="text-sm text-slate-500 mt-1">
                Discover our customer favorites with highest ratings and verified reviews.
              </p>
            </div>
            <a
              routerLink="/products"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-300 shadow-xs transition-colors"
            >
              <span>View Full Catalog</span>
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">arrow_forward</mat-icon>
            </a>
          </div>

          <!-- Featured Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of featuredProducts; track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          <!-- Centered Shop Now Banner Button -->
          <div class="mt-12 text-center">
            <a
              routerLink="/products"
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
            >
              <mat-icon>storefront</mat-icon>
              <span>Explore All Products</span>
            </a>
          </div>
        </div>
      </section>

      <!-- PROMOTIONAL DISCOUNT BANNER -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-8 sm:p-12 shadow-xl">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="relative z-10 max-w-2xl space-y-4">
            <span class="inline-block px-3 py-1 bg-yellow-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-md shadow-xs">
              Special Discount Code
            </span>
            <h3 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get an Extra 15% Off Your Entire Order!
            </h3>
            <p class="text-purple-100 text-sm sm:text-base leading-relaxed">
              Use promotional coupon code <strong class="bg-white/20 px-2 py-0.5 rounded font-mono text-yellow-300">EASYSALE</strong> at checkout to unlock instant extra savings across all categories.
            </p>
            <div class="pt-2 flex flex-wrap gap-3">
              <a
                routerLink="/products"
                class="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-bold text-sm shadow-md transition-colors"
              >
                Redeem Promo Now
              </a>
              <button
                type="button"
                (click)="copyCouponCode()"
                class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">{{ couponCopied() ? 'check' : 'content_copy' }}</mat-icon>
                <span>{{ couponCopied() ? 'Copied Code!' : 'Copy Code: EASYSALE' }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- NEWSLETTER SUBSCRIPTION SECTION -->
      <section class="bg-white border-t border-slate-200/80 py-14">
        <div class="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">mark_email_read</mat-icon>
          </div>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stay in the Loop
          </h3>
          <p class="text-sm text-slate-500 max-w-lg mx-auto">
            Subscribe to our weekly newsletter for exclusive VIP discounts, new arrivals, and special seasonal flash sales.
          </p>

          <div class="max-w-md mx-auto pt-2">
            @if (newsletterSubscribed()) {
              <div class="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center justify-center gap-2 animate-fadeIn">
                <mat-icon class="text-emerald-600">check_circle</mat-icon>
                <span>Thank you! You are now subscribed to ShopEasy offers.</span>
              </div>
            } @else {
              <form (submit)="onSubscribe($event, emailInput.value)" class="flex gap-2">
                <input
                  type="email"
                  #emailInput
                  required
                  placeholder="Enter your email address..."
                  class="flex-1 bg-slate-100 text-slate-800 placeholder-slate-400 text-sm rounded-xl px-4 py-3 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                />
                <button
                  type="submit"
                  class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            }
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomePage {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly featuredProducts: Product[] = this.productService.getFeaturedProducts();
  readonly couponCopied = signal(false);
  readonly newsletterSubscribed = signal(false);

  onSearch(query: string): void {
    const trimmed = query.trim();
    if (trimmed) {
      this.router.navigate(['/products'], { queryParams: { search: trimmed } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  copyCouponCode(): void {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('EASYSALE');
    }
    this.couponCopied.set(true);
    setTimeout(() => this.couponCopied.set(false), 2500);
  }

  onSubscribe(e: Event, email: string): void {
    e.preventDefault();
    if (email && email.includes('@')) {
      this.newsletterSubscribed.set(true);
    }
  }
}
