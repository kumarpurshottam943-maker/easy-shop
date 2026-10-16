import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomePage),
    title: 'ShopEasy – Modern Online Shopping Store'
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.ProductsPage),
    title: 'ShopEasy – Browse All Products'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetailPage),
    title: 'ShopEasy – Product Details'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartPage),
    title: 'ShopEasy – Your Shopping Cart'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
