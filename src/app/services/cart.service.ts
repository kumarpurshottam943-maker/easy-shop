import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product, CartItem } from '../models/product.model';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'shopeasy_cart_v1';
  private readonly COUPON_KEY = 'shopeasy_coupon_v1';

  // State signals
  private readonly itemsSignal = signal<CartItem[]>(this.loadInitialCart());
  private readonly appliedCouponSignal = signal<{ code: string; percent: number } | null>(this.loadInitialCoupon());
  private readonly toastSignal = signal<ToastMessage | null>(null);

  // Readonly exposures
  readonly items = this.itemsSignal.asReadonly();
  readonly appliedCoupon = this.appliedCouponSignal.asReadonly();
  readonly toast = this.toastSignal.asReadonly();

  // Computed totals
  readonly totalItemsCount = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });

  readonly shippingCost = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub >= 75 ? 0 : 5.99;
  });

  readonly discountAmount = computed(() => {
    const coupon = this.appliedCouponSignal();
    if (!coupon) return 0;
    return (this.subtotal() * coupon.percent) / 100;
  });

  readonly tax = computed(() => {
    const taxableAmount = Math.max(0, this.subtotal() - this.discountAmount());
    return taxableAmount * 0.08; // 8% sales tax
  });

  readonly grandTotal = computed(() => {
    if (this.subtotal() === 0) return 0;
    return Math.max(0, this.subtotal() - this.discountAmount() + this.shippingCost() + this.tax());
  });

  private loadInitialCart(): CartItem[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Could not read cart from localStorage', e);
      }
    }
    // Initial demo cart items so user experiences active shopping cart on first visit
    return [
      {
        product: {
          id: 1,
          name: 'Sony WH-1000XM5 Wireless Headphones',
          category: 'Electronics',
          price: 299.99,
          originalPrice: 399.99,
          rating: 4.8,
          ratingCount: 1420,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          description: 'Industry-leading noise canceling headphones.',
          features: ['Active Noise Cancellation', '30-hour battery life'],
          inStock: true,
          stockCount: 24
        },
        quantity: 1
      },
      {
        product: {
          id: 3,
          name: 'Classic Urban Minimalist Sneakers',
          category: 'Fashion',
          price: 89.95,
          originalPrice: 120.00,
          rating: 4.6,
          ratingCount: 630,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
          description: 'Handcrafted premium leather sneakers engineered for supreme all-day comfort.',
          features: ['Italian top-grain leather', 'Memory foam insole'],
          inStock: true,
          stockCount: 42
        },
        quantity: 1
      }
    ];
  }

  private loadInitialCoupon(): { code: string; percent: number } | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem(this.COUPON_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // ignore
      }
    }
    return null;
  }

  private persistCart(items: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Could not save cart to localStorage', e);
      }
    }
  }

  private persistCoupon(coupon: { code: string; percent: number } | null): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        if (coupon) {
          localStorage.setItem(this.COUPON_KEY, JSON.stringify(coupon));
        } else {
          localStorage.removeItem(this.COUPON_KEY);
        }
      } catch {
        // ignore
      }
    }
  }

  addToCart(product: Product, quantity = 1): void {
    const safeQty = Math.max(1, quantity);
    const current = this.itemsSignal();
    const existingIndex = current.findIndex(item => item.product.id === product.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = current.map((item, idx) => {
        if (idx === existingIndex) {
          const newQty = item.quantity + safeQty;
          return { ...item, quantity: newQty };
        }
        return item;
      });
    } else {
      updated = [...current, { product, quantity: safeQty }];
    }

    this.itemsSignal.set(updated);
    this.persistCart(updated);
    this.showToast(`"${product.name}" added to your cart!`, 'success');
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const current = this.itemsSignal();
    const updated = current.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.itemsSignal.set(updated);
    this.persistCart(updated);
  }

  removeFromCart(productId: number): void {
    const current = this.itemsSignal();
    const itemToRemove = current.find(i => i.product.id === productId);
    const updated = current.filter(item => item.product.id !== productId);

    this.itemsSignal.set(updated);
    this.persistCart(updated);

    if (itemToRemove) {
      this.showToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
    }
  }

  clearCart(): void {
    this.itemsSignal.set([]);
    this.persistCart([]);
    this.appliedCouponSignal.set(null);
    this.persistCoupon(null);
  }

  applyCoupon(code: string): { success: boolean; message: string } {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a valid coupon code.' };
    }

    if (cleanCode === 'EASYSALE' || cleanCode === 'DISCOUNT15') {
      const coupon = { code: cleanCode, percent: 15 };
      this.appliedCouponSignal.set(coupon);
      this.persistCoupon(coupon);
      this.showToast('Coupon EASYSALE applied: 15% discount!', 'success');
      return { success: true, message: '15% discount applied successfully!' };
    }

    if (cleanCode === 'SAVE20' || cleanCode === 'WELCOME20') {
      const coupon = { code: cleanCode, percent: 20 };
      this.appliedCouponSignal.set(coupon);
      this.persistCoupon(coupon);
      this.showToast('Promo code applied: 20% discount!', 'success');
      return { success: true, message: '20% discount applied successfully!' };
    }

    return { success: false, message: 'Invalid or expired coupon code. Try code "EASYSALE".' };
  }

  removeCoupon(): void {
    this.appliedCouponSignal.set(null);
    this.persistCoupon(null);
    this.showToast('Coupon code removed', 'info');
  }

  showToast(message: string, type: 'success' | 'info' | 'warning' = 'success'): void {
    const id = Date.now().toString();
    this.toastSignal.set({ id, message, type });

    setTimeout(() => {
      // Clear if still the same toast
      if (this.toastSignal()?.id === id) {
        this.toastSignal.set(null);
      }
    }, 3200);
  }

  dismissToast(): void {
    this.toastSignal.set(null);
  }
}
