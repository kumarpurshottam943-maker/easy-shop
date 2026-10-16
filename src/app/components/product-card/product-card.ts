import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, MatIconModule],
  template: `
    @let p = product();
    <div class="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full overflow-hidden">

      <!-- Badge Overlays -->
      <div class="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span class="px-2.5 py-1 bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-semibold rounded-full shadow-xs border border-slate-200/60">
          {{ p.category }}
        </span>

        @if (p.tag) {
          <span class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            {{ p.tag }}
          </span>
        } @else if (discountPercent() > 0) {
          <span class="px-2 py-0.5 bg-rose-500 text-white text-[11px] font-bold rounded-full shadow-xs">
            -{{ discountPercent() }}%
          </span>
        }
      </div>

      <!-- Image Area -->
      <a [routerLink]="['/product', p.id]" class="block relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          [src]="p.image"
          [alt]="p.name"
          referrerpolicy="no-referrer"
          loading="lazy"
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>

      <!-- Content Area -->
      <div class="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <!-- Rating -->
          <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <div class="flex items-center text-amber-400">
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">star</mat-icon>
            </div>
            <span class="font-bold text-slate-700">{{ p.rating }}</span>
            <span class="text-slate-400">({{ p.ratingCount }})</span>
          </div>

          <!-- Title -->
          <a [routerLink]="['/product', p.id]" class="block group/title">
            <h3 class="font-semibold text-slate-900 group-hover/title:text-indigo-600 line-clamp-2 text-sm sm:text-base leading-snug transition-colors">
              {{ p.name }}
            </h3>
          </a>

          <!-- Description snippet -->
          <p class="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {{ p.description }}
          </p>
        </div>

        <!-- Price & Action Button -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-lg sm:text-xl font-bold text-slate-900">
                {{ p.price | currency }}
              </span>
              @if (p.originalPrice) {
                <span class="text-xs text-slate-400 line-through">
                  {{ p.originalPrice | currency }}
                </span>
              }
            </div>
            <span class="text-[11px] text-emerald-600 font-medium">Free Shipping</span>
          </div>

          <button
            type="button"
            (click)="addToCart(p, $event)"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
            aria-label="Add to Cart"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">add_shopping_cart</mat-icon>
            <span class="hidden xs:inline">Add</span>
          </button>
        </div>

      </div>

    </div>
  `
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);

  readonly product = input.required<Product>();

  readonly discountPercent = computed(() => {
    const p = this.product();
    if (p.originalPrice && p.originalPrice > p.price) {
      return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    }
    return 0;
  });

  addToCart(p: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(p, 1);
  }
}
