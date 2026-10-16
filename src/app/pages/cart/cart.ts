import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
        <a routerLink="/" class="hover:text-indigo-600 transition-colors">Home</a>
        <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">chevron_right</mat-icon>
        <span class="text-slate-800 font-semibold">Shopping Cart</span>
      </div>

      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            @if (cartItems().length > 0) {
              Review your items and proceed to secure checkout.
            } @else {
              Your cart is currently empty.
            }
          </p>
        </div>

        @if (cartItems().length > 0) {
          <button
            type="button"
            (click)="clearCart()"
            class="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">delete_sweep</mat-icon>
            <span>Clear Cart</span>
          </button>
        }
      </div>

      <!-- MAIN CART CONTENT -->
      @if (cartItems().length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- Left: Cart Items List (8 cols) -->
          <div class="lg:col-span-8 space-y-4">
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              @for (item of cartItems(); track item.product.id) {
                <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:bg-slate-50/50 transition-colors">

                  <!-- Thumbnail Image -->
                  <a [routerLink]="['/product', item.product.id]" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-inner group">
                    <img
                      [src]="item.product.image"
                      [alt]="item.product.name"
                      referrerpolicy="no-referrer"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>

                  <!-- Info & Details -->
                  <div class="flex-1 min-w-0 text-center sm:text-left space-y-1">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {{ item.product.category }}
                    </span>
                    <a [routerLink]="['/product', item.product.id]" class="block group/link">
                      <h3 class="font-bold text-slate-900 group-hover/link:text-indigo-600 text-sm sm:text-base leading-snug truncate transition-colors">
                        {{ item.product.name }}
                      </h3>
                    </a>
                    <div class="text-xs text-slate-400">
                      Unit Price: <span class="text-slate-700 font-semibold">{{ item.product.price | currency }}</span>
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-3">
                    <div class="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button
                        type="button"
                        (click)="decreaseQty(item.product.id, item.quantity)"
                        class="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">remove</mat-icon>
                      </button>
                      <span class="w-10 text-center font-bold text-slate-900 text-sm select-none">
                        {{ item.quantity }}
                      </span>
                      <button
                        type="button"
                        (click)="increaseQty(item.product.id, item.quantity, item.product.stockCount)"
                        class="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">add</mat-icon>
                      </button>
                    </div>

                    <!-- Line Total -->
                    <div class="w-24 text-right">
                      <span class="font-extrabold text-slate-900 text-base">
                        {{ (item.product.price * item.quantity) | currency }}
                      </span>
                    </div>

                    <!-- Delete button -->
                    <button
                      type="button"
                      (click)="removeItem(item.product.id)"
                      class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">delete_outline</mat-icon>
                    </button>
                  </div>

                </div>
              }
            </div>

            <!-- Free shipping indicator progress -->
            <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-4">
              <div class="flex items-center gap-2.5 text-xs text-indigo-900 font-medium">
                <mat-icon class="text-indigo-600 !text-[20px] !w-[20px] !h-[20px]">local_shipping</mat-icon>
                @if (subtotal() >= 75) {
                  <span>Congratulations! You qualified for <strong>FREE Express Shipping</strong>!</span>
                } @else {
                  <span>Add <strong>{{ (75 - subtotal()) | currency }}</strong> more to unlock FREE shipping!</span>
                }
              </div>
              <a routerLink="/products" class="text-xs font-bold text-indigo-700 hover:underline whitespace-nowrap">
                Continue Shopping &rarr;
              </a>
            </div>
          </div>

          <!-- Right: Order Summary (4 cols) -->
          <div class="lg:col-span-4 sticky top-24 space-y-6">
            <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h2 class="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <!-- Promo Code Input -->
              <div>
                <label for="couponCodeInput" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Promotional Coupon
                </label>
                @if (appliedCoupon(); as coupon) {
                  <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <div class="flex items-center gap-1.5">
                      <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                      <span>Code <strong>{{ coupon.code }}</strong> applied ({{ coupon.percent }}% off)</span>
                    </div>
                    <button
                      type="button"
                      (click)="removeCoupon()"
                      class="text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                } @else {
                  <div class="flex gap-2">
                    <input
                      id="couponCodeInput"
                      type="text"
                      #couponInput
                      placeholder="e.g. EASYSALE"
                      class="flex-1 bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm uppercase font-mono tracking-wider rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      (click)="applyCoupon(couponInput.value); couponInput.value = ''"
                      class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  @if (couponError()) {
                    <p class="text-[11px] text-rose-500 mt-1 font-medium">{{ couponError() }}</p>
                  }
                  <p class="text-[11px] text-slate-400 mt-1">
                    Tip: Use coupon <code class="text-indigo-600 font-bold bg-slate-100 px-1 rounded">EASYSALE</code> for 15% off!
                  </p>
                }
              </div>

              <!-- Price calculations -->
              <div class="space-y-3 pt-3 border-t border-slate-100 text-sm text-slate-600">
                <div class="flex items-center justify-between">
                  <span>Subtotal ({{ totalItems() }} items)</span>
                  <span class="font-semibold text-slate-900">{{ subtotal() | currency }}</span>
                </div>

                @if (discountAmount() > 0) {
                  <div class="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Discount Savings</span>
                    <span>-{{ discountAmount() | currency }}</span>
                  </div>
                }

                <div class="flex items-center justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    @if (shippingCost() === 0) {
                      <strong class="text-emerald-600 uppercase text-xs font-bold">Free</strong>
                    } @else {
                      <span class="font-semibold text-slate-900">{{ shippingCost() | currency }}</span>
                    }
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span class="font-semibold text-slate-900">{{ tax() | currency }}</span>
                </div>

                <div class="pt-3 border-t border-slate-200 flex items-baseline justify-between text-base sm:text-lg">
                  <span class="font-bold text-slate-900">Total Amount</span>
                  <span class="font-extrabold text-2xl text-indigo-700">{{ grandTotal() | currency }}</span>
                </div>
              </div>

              <!-- Checkout Button -->
              <button
                type="button"
                (click)="openCheckoutModal()"
                class="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 active:scale-98 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">lock</mat-icon>
                <span>Proceed to Checkout</span>
              </button>

              <div class="text-center">
                <a routerLink="/products" class="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                  &larr; Or continue browsing products
                </a>
              </div>

              <!-- Security reassurance -->
              <div class="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <mat-icon class="!text-[14px] !w-[14px] !h-[14px] text-emerald-500">security</mat-icon>
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
            </div>
          </div>

        </div>
      } @else {
        <!-- EMPTY CART STATE -->
        <div class="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-6">
          <div class="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <mat-icon class="!text-[48px] !w-[48px] !h-[48px]">shopping_cart</mat-icon>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Your shopping cart is empty
          </h2>
          <p class="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our top trending electronics, stylish apparel, and lifestyle accessories.
          </p>
          <a
            routerLink="/products"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-md shadow-indigo-600/25 transition-all"
          >
            <mat-icon>store</mat-icon>
            <span>Start Shopping Now</span>
          </a>
        </div>
      }

      <!-- CHECKOUT MODAL & ORDER CONFIRMATION -->
      @if (showCheckoutModal()) {
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-slideUp relative">

            @if (!orderPlaced()) {
              <!-- Step 1: Checkout Form -->
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">payment</mat-icon>
                  </div>
                  <h3 class="font-extrabold text-slate-900 text-lg">Checkout & Delivery</h3>
                </div>
                <button
                  type="button"
                  (click)="closeCheckoutModal()"
                  class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  aria-label="Close checkout modal"
                >
                  <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">close</mat-icon>
                </button>
              </div>

              <form (submit)="placeOrder($event, fullName.value)" class="space-y-4">
                <div>
                  <label for="fullNameInput" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    id="fullNameInput"
                    type="text"
                    #fullName
                    required
                    value="Alex Morgan"
                    placeholder="e.g. Alex Morgan"
                    class="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label for="emailAddrInput" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    id="emailAddrInput"
                    type="email"
                    #emailAddr
                    required
                    value="alex.morgan@example.com"
                    placeholder="e.g. alex@example.com"
                    class="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="addressLineInput" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Shipping Address *
                    </label>
                    <input
                      id="addressLineInput"
                      type="text"
                      #addressLine
                      required
                      value="742 Evergreen Terrace"
                      placeholder="Street address"
                      class="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label for="cityValInput" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City & Zip *
                    </label>
                    <input
                      id="cityValInput"
                      type="text"
                      #cityVal
                      required
                      value="Springfield, 97477"
                      placeholder="City, Zip"
                      class="w-full bg-slate-50 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <span class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </span>
                  <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2 p-3 rounded-xl border border-indigo-500 bg-indigo-50/50 cursor-pointer">
                      <input type="radio" name="payment" checked class="accent-indigo-600" />
                      <span class="text-xs font-semibold text-slate-800">Credit Card / Debit</span>
                    </label>
                    <label class="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input type="radio" name="payment" class="accent-indigo-600" />
                      <span class="text-xs font-semibold text-slate-800">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-sm">
                  <span class="font-bold text-slate-700">Total to Charge:</span>
                  <span class="font-extrabold text-xl text-indigo-700">{{ grandTotal() | currency }}</span>
                </div>

                <div class="pt-2 flex gap-3">
                  <button
                    type="button"
                    (click)="closeCheckoutModal()"
                    class="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </form>
            } @else {
              <!-- Step 2: Order Confirmed Screen -->
              <div class="text-center py-4 space-y-4">
                <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <mat-icon class="!text-[36px] !w-[36px] !h-[36px]">check_circle</mat-icon>
                </div>

                <h3 class="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Order Successfully Placed!
                </h3>

                <p class="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for shopping with <strong class="text-indigo-600">ShopEasy</strong>! We have received your order and sent a confirmation receipt to your email.
                </p>

                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Order Reference:</span>
                    <strong class="font-mono text-slate-900">#SE-{{ confirmedOrderId() }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Total Paid:</span>
                    <strong class="text-emerald-600 text-sm">{{ confirmedAmount() | currency }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Estimated Delivery:</span>
                    <strong class="text-slate-900">3 - 5 Business Days</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Status:</span>
                    <span class="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Processing</span>
                  </div>
                </div>

                <div class="pt-4 flex flex-col gap-2">
                  <a
                    routerLink="/products"
                    (click)="closeCheckoutModal()"
                    class="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors text-center cursor-pointer"
                  >
                    Continue Shopping
                  </a>
                  <button
                    type="button"
                    (click)="closeCheckoutModal()"
                    class="text-xs text-slate-500 hover:text-slate-700 py-1"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            }

          </div>
        </div>
      }

    </div>
  `
})
export class CartPage {
  private readonly cartService = inject(CartService);

  readonly cartItems = this.cartService.items;
  readonly appliedCoupon = this.cartService.appliedCoupon;
  readonly totalItems = this.cartService.totalItemsCount;
  readonly subtotal = this.cartService.subtotal;
  readonly shippingCost = this.cartService.shippingCost;
  readonly discountAmount = this.cartService.discountAmount;
  readonly tax = this.cartService.tax;
  readonly grandTotal = this.cartService.grandTotal;

  readonly couponError = signal<string>('');
  readonly showCheckoutModal = signal<boolean>(false);
  readonly orderPlaced = signal<boolean>(false);
  readonly confirmedOrderId = signal<string>('');
  readonly confirmedAmount = signal<number>(0);

  increaseQty(productId: number, currentQty: number, maxStock: number): void {
    if (currentQty < maxStock) {
      this.cartService.updateQuantity(productId, currentQty + 1);
    }
  }

  decreaseQty(productId: number, currentQty: number): void {
    if (currentQty > 1) {
      this.cartService.updateQuantity(productId, currentQty - 1);
    } else {
      this.cartService.removeFromCart(productId);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  applyCoupon(code: string): void {
    this.couponError.set('');
    const result = this.cartService.applyCoupon(code);
    if (!result.success) {
      this.couponError.set(result.message);
    }
  }

  removeCoupon(): void {
    this.cartService.removeCoupon();
    this.couponError.set('');
  }

  openCheckoutModal(): void {
    this.orderPlaced.set(false);
    this.showCheckoutModal.set(true);
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal.set(false);
  }

  readonly confirmedCustomerName = signal<string>('Alex Morgan');

  placeOrder(e: Event, name?: string): void {
    e.preventDefault();
    if (name?.trim()) {
      this.confirmedCustomerName.set(name.trim());
    }
    this.confirmedAmount.set(this.grandTotal());
    this.confirmedOrderId.set(Math.floor(100000 + Math.random() * 900000).toString());
    this.orderPlaced.set(true);
    // Clear cart once order is confirmed
    this.cartService.clearCart();
  }
}
