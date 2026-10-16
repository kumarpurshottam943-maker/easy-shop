import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule, CurrencyPipe],
  template: `
    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white text-xs font-medium py-2 px-4">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center bg-white/20 text-white rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            FLASH SALE
          </span>
          <span>⚡ Big Sale – Up to 50% Off Select Items! Use code <strong class="underline decoration-yellow-300 font-bold text-yellow-200">EASYSALE</strong></span>
        </div>
        <div class="hidden sm:flex items-center gap-4 text-xs text-white/90">
          <span class="flex items-center gap-1">
            <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">local_shipping</mat-icon>
            Free Delivery over $75
          </span>
          <span class="text-white/40">|</span>
          <span class="flex items-center gap-1">
            <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">headset_mic</mat-icon>
            24/7 Live Support
          </span>
        </div>
      </div>
    </div>

    <!-- Main Header Navbar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18 gap-4">

          <!-- Brand Logo -->
          <a routerLink="/" class="flex items-center gap-2.5 group focus:outline-hidden">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">shopping_bag</mat-icon>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
                ShopEasy
              </span>
              <span class="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Online Store
              </span>
            </div>
          </a>

          <!-- Search Bar (Desktop / Tablet) -->
          <div class="hidden md:flex flex-1 max-w-lg mx-6">
            <div class="relative w-full">
              <input
                type="text"
                #searchInput
                [value]="searchQuery()"
                (input)="searchQuery.set(searchInput.value)"
                (keydown.enter)="executeSearch()"
                placeholder="Search products by name, brand, category..."
                class="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-full pl-11 pr-24 py-2.5 border border-transparent focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-hidden transition-all shadow-inner"
              />
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">search</mat-icon>
              </div>
              <button
                type="button"
                (click)="executeSearch()"
                class="absolute inset-y-1 right-1 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </div>

          <!-- Navigation Links & Cart Actions -->
          <div class="flex items-center gap-2 sm:gap-4">
            <nav class="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
              <a
                routerLink="/"
                routerLinkActive="text-indigo-600 font-semibold bg-indigo-50/80"
                [routerLinkActiveOptions]="{ exact: true }"
                class="px-3.5 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">home</mat-icon>
                <span>Home</span>
              </a>
              <a
                routerLink="/products"
                routerLinkActive="text-indigo-600 font-semibold bg-indigo-50/80"
                class="px-3.5 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">grid_view</mat-icon>
                <span>All Products</span>
              </a>
            </nav>

            <!-- Cart Button with Live Badge -->
            <a
              routerLink="/cart"
              routerLinkActive="ring-2 ring-indigo-500 bg-indigo-50"
              class="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium text-sm transition-all group"
              aria-label="View Shopping Cart"
            >
              <div class="relative flex items-center">
                <mat-icon class="!text-[22px] !w-[22px] !h-[22px] text-indigo-600 group-hover:scale-110 transition-transform">
                  shopping_cart
                </mat-icon>
                @if (cartCount() > 0) {
                  <span class="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-md shadow-pink-500/30 animate-pulse">
                    {{ cartCount() }}
                  </span>
                }
              </div>
              <span class="hidden sm:inline font-semibold">Cart</span>
              @if (cartSubtotal() > 0) {
                <span class="hidden sm:inline text-xs text-slate-500 font-normal">
                  ({{ cartSubtotal() | currency }})
                </span>
              }
            </a>

            <!-- Mobile Menu Toggle Button -->
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="lg:hidden p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">
                {{ mobileMenuOpen() ? 'close' : 'menu' }}
              </mat-icon>
            </button>
          </div>
        </div>

        <!-- Mobile Search Bar (under header on small screens) -->
        <div class="md:hidden pb-3 pt-1">
          <div class="relative w-full">
            <input
              type="text"
              #mobileSearchInput
              [value]="searchQuery()"
              (input)="searchQuery.set(mobileSearchInput.value)"
              (keydown.enter)="executeSearch()"
              placeholder="Search products..."
              class="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-sm rounded-xl pl-10 pr-20 py-2 border border-slate-200 focus:outline-hidden focus:border-indigo-400"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">search</mat-icon>
            </div>
            <button
              type="button"
              (click)="executeSearch()"
              class="absolute inset-y-1 right-1 px-3 bg-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Drawer / Dropdown -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <a
            routerLink="/"
            (click)="closeMobileMenu()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
          >
            <mat-icon class="text-indigo-600">home</mat-icon>
            <span>Home</span>
          </a>
          <a
            routerLink="/products"
            (click)="closeMobileMenu()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
          >
            <mat-icon class="text-indigo-600">grid_view</mat-icon>
            <span>All Products</span>
          </a>
          <a
            routerLink="/cart"
            (click)="closeMobileMenu()"
            class="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
          >
            <div class="flex items-center gap-3">
              <mat-icon class="text-indigo-600">shopping_cart</mat-icon>
              <span>Shopping Cart</span>
            </div>
            @if (cartCount() > 0) {
              <span class="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {{ cartCount() }} items
              </span>
            }
          </a>

          <div class="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
            <span class="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Quick Categories:</span>
            <div class="flex flex-wrap gap-1.5 pt-1">
              <a
                routerLink="/products"
                [queryParams]="{ category: 'Electronics' }"
                (click)="closeMobileMenu()"
                class="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
              >
                Electronics
              </a>
              <a
                routerLink="/products"
                [queryParams]="{ category: 'Fashion' }"
                (click)="closeMobileMenu()"
                class="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
              >
                Fashion
              </a>
              <a
                routerLink="/products"
                [queryParams]="{ category: 'Accessories' }"
                (click)="closeMobileMenu()"
                class="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
              >
                Accessories
              </a>
              <a
                routerLink="/products"
                [queryParams]="{ category: 'Home & Living' }"
                (click)="closeMobileMenu()"
                class="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
              >
                Home & Living
              </a>
            </div>
          </div>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  readonly searchQuery = signal('');
  readonly mobileMenuOpen = signal(false);

  readonly cartCount = this.cartService.totalItemsCount;
  readonly cartSubtotal = this.cartService.subtotal;

  executeSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/products']);
    }
    this.mobileMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
