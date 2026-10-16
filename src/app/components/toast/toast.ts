import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (toast(); as t) {
      <div class="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slideUp">
        <div class="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/60 flex items-start gap-3 backdrop-blur-md">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
               [class.bg-emerald-500]="t.type === 'success'"
               [class.bg-blue-500]="t.type === 'info'"
               [class.bg-amber-500]="t.type === 'warning'">
            <mat-icon class="!text-[20px] !w-[20px] !h-[20px] text-white">
              @if (t.type === 'success') { check }
              @else if (t.type === 'info') { info }
              @else { warning }
            </mat-icon>
          </div>

          <div class="flex-1 text-sm font-medium pt-0.5 leading-snug">
            {{ t.message }}
          </div>

          <button
            type="button"
            (click)="dismiss()"
            class="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss toast notification"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">close</mat-icon>
          </button>
        </div>
      </div>
    }
  `
})
export class ToastComponent {
  private readonly cartService = inject(CartService);
  readonly toast = this.cartService.toast;

  dismiss(): void {
    this.cartService.dismissToast();
  }
}
