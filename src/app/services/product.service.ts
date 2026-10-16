import { Injectable, signal } from '@angular/core';
import { Product, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsData: Product[] = [
    {
      id: 1,
      name: 'Sony WH-1000XM5 Wireless Headphones',
      category: 'Electronics',
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      ratingCount: 1420,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Industry-leading noise canceling with two processors and eight microphones for unprecedented noise cancellation. Super comfortable and lightweight design with soft fit leather.',
      features: [
        'Active Noise Cancellation with Auto NC Optimizer',
        'Up to 30-hour battery life with quick charging (3 min for 3 hours)',
        'Crystal clear hands-free calling with 4 beamforming microphones',
        'Multipoint connection allows switching between two devices instantly'
      ],
      inStock: true,
      isFeatured: true,
      stockCount: 24,
      tag: 'Best Seller'
    },
    {
      id: 2,
      name: 'Apple Watch Ultra Sport Edition',
      category: 'Electronics',
      price: 449.00,
      originalPrice: 499.00,
      rating: 4.9,
      ratingCount: 885,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'The most rugged and capable watch ever. Featuring a robust titanium case, precision dual-frequency GPS, up to 36 hours of battery life, and high-performance bands.',
      features: [
        '49mm aerospace-grade titanium case',
        'Always-On Retina display up to 2000 nits brightness',
        'Precision dual-frequency GPS (L1 and L5)',
        'Water resistant up to 100 meters with depth gauge'
      ],
      inStock: true,
      isFeatured: true,
      stockCount: 15,
      tag: 'Hot Deal'
    },
    {
      id: 3,
      name: 'Classic Urban Minimalist Sneakers',
      category: 'Fashion',
      price: 89.95,
      originalPrice: 120.00,
      rating: 4.6,
      ratingCount: 630,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Handcrafted premium leather sneakers engineered for supreme all-day comfort. Features an orthopedic memory foam insole and slip-resistant rubber outsole.',
      features: [
        'Genuine Italian top-grain leather upper',
        'Breathable organic cotton lining',
        'Removable ergonomic memory foam footbed',
        'Vulcanized non-slip rubber traction sole'
      ],
      inStock: true,
      isFeatured: true,
      stockCount: 42,
      tag: 'Trending'
    },
    {
      id: 4,
      name: 'Modern Vintage Denim Trucker Jacket',
      category: 'Fashion',
      price: 74.50,
      originalPrice: 99.00,
      rating: 4.7,
      ratingCount: 310,
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'A timeless silhouette updated with comfortable stretch denim. Designed with pointed collar, chest flap pockets, and custom antique brass hardware.',
      features: [
        '100% sustainable heavyweight ring-spun denim',
        'Classic button-front placket and side welt pockets',
        'Pre-washed for soft, broken-in vintage feel',
        'Machine washable with durable double-needle stitching'
      ],
      inStock: true,
      isFeatured: false,
      stockCount: 18
    },
    {
      id: 5,
      name: 'Waterproof Commuter Laptop Backpack',
      category: 'Accessories',
      price: 59.99,
      originalPrice: 85.00,
      rating: 4.8,
      ratingCount: 940,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Sleek, aerodynamic everyday commuter backpack with dedicated padded sleeve fitting up to 16-inch laptops, hidden anti-theft pocket, and USB charging pass-through.',
      features: [
        'Weatherproof 900D ballistic nylon fabric',
        'Dedicated 16" fleece-lined laptop & tablet compartment',
        'Ergonomic breathable mesh back panel and contoured straps',
        'Luggage trolley strap and exterior quick-access key clip'
      ],
      inStock: true,
      isFeatured: true,
      stockCount: 35,
      tag: 'Popular'
    },
    {
      id: 6,
      name: 'Polarized Aviator Sunglasses Gold/Black',
      category: 'Accessories',
      price: 45.00,
      originalPrice: 65.00,
      rating: 4.5,
      ratingCount: 420,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Signature aviator styling with lightweight metal alloy frame and Category 3 UV400 polarized scratch-resistant lenses for exceptional clarity and glare reduction.',
      features: [
        '100% UV400 protection against UVA/UVB rays',
        'Reinforced spring hinges for custom flexible fit',
        'Adjustable skin-friendly silicone nose pads',
        'Includes hard protective case and microfiber cloth'
      ],
      inStock: true,
      isFeatured: false,
      stockCount: 50
    },
    {
      id: 7,
      name: 'Logitech MX Mechanical Wireless Keyboard',
      category: 'Electronics',
      price: 139.99,
      originalPrice: 169.99,
      rating: 4.9,
      ratingCount: 710,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Low-profile mechanical switches deliver next-level typing feel. Smart backlighting automatically illuminates when hands approach and adjusts to ambient lighting.',
      features: [
        'Tactile quiet low-profile mechanical key switches',
        'Multi-device pairing via Bluetooth Low Energy & Logi Bolt',
        'USB-C fast charging lasts up to 15 days or 10 months without backlight',
        'Compatible with macOS, Windows, Linux, iOS, and Android'
      ],
      inStock: true,
      isFeatured: true,
      stockCount: 19,
      tag: 'Top Pick'
    },
    {
      id: 8,
      name: 'Portable Bluetooth 360 Surround Speaker',
      category: 'Electronics',
      price: 79.99,
      originalPrice: 119.99,
      rating: 4.6,
      ratingCount: 520,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Deep, punchy 360-degree bass with crystal-clear highs. IPX7 waterproof rating ensures you can enjoy music pool-side, at the beach, or on hiking adventures.',
      features: [
        'IPX7 waterproof and dustproof submersible rating',
        'Up to 16 hours of playtime per charge',
        'PartyConnect pairs with up to 100 compatible speakers',
        'Integrated microphone for clear speakerphone calls'
      ],
      inStock: true,
      isFeatured: false,
      stockCount: 30
    },
    {
      id: 9,
      name: 'Scandinavian Ceramic Minimalist Table Lamp',
      category: 'Home & Living',
      price: 64.00,
      originalPrice: 89.00,
      rating: 4.7,
      ratingCount: 280,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Hand-thrown matte ceramic base paired with an unbleached linen drum shade. Emanates a warm, ambient glow ideal for bedside nightstands or modern living spaces.',
      features: [
        'Authentic textured stoneware ceramic base',
        'Natural unbleached textured linen shade',
        'Includes dimmable warm 2700K LED filament bulb',
        'Braided fabric power cord with inline rotary switch'
      ],
      inStock: true,
      isFeatured: false,
      stockCount: 22
    },
    {
      id: 10,
      name: 'Premium Stainless Steel Thermal Tumbler',
      category: 'Home & Living',
      price: 28.50,
      originalPrice: 38.00,
      rating: 4.8,
      ratingCount: 1120,
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Double-wall vacuum insulation keeps cold beverages iced for up to 24 hours and piping hot for 12 hours. Sweat-free powder coat exterior with leakproof lid.',
      features: [
        '18/8 food-grade pro stainless steel construction',
        'BPA-free and toxin-free splash resistant magnetic slider lid',
        'Fits standard car cup holders and gym machines',
        'Dishwasher safe for effortless everyday cleaning'
      ],
      inStock: true,
      isFeatured: false,
      stockCount: 65
    },
    {
      id: 11,
      name: 'Luxury Chronograph Sapphire Men Watch',
      category: 'Accessories',
      price: 189.00,
      originalPrice: 260.00,
      rating: 4.9,
      ratingCount: 380,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Precision Japanese quartz chronograph movement housed in surgical-grade 316L stainless steel. Features a scratch-proof sapphire crystal glass and calendar display.',
      features: [
        'Scratch-resistant genuine sapphire crystal glass',
        '5 ATM / 50m water resistance rating',
        'Italian genuine calfskin leather strap with quick release',
        'Luminescent hands and hour markers'
      ],
      inStock: true,
      isFeatured: true,
      stockCount: 12,
      tag: 'Luxury'
    },
    {
      id: 12,
      name: 'Organic Cotton Oversized Cozy Knit Hoodie',
      category: 'Fashion',
      price: 58.00,
      originalPrice: 79.00,
      rating: 4.7,
      ratingCount: 560,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Ultra-plush French terry fleece crafted from 100% GOTS-certified organic cotton. Relaxed dropped-shoulder silhouette with kangaroo pouch pocket.',
      features: [
        '450 GSM ultra-heavyweight brushed French terry cotton',
        'Double-layered drawstring hood with metal eyelets',
        'Ribbed cuffs and waistband with elastane for shape retention',
        'Garment dyed for rich color depth and super-soft feel'
      ],
      inStock: true,
      isFeatured: false,
      stockCount: 28
    }
  ];

  private readonly products = signal<Product[]>(this.productsData);

  getProducts(): Product[] {
    return this.products();
  }

  getProductById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getFeaturedProducts(): Product[] {
    return this.products().filter(p => p.isFeatured);
  }

  getCategories(): Category[] {
    return ['All', 'Electronics', 'Fashion', 'Accessories', 'Home & Living'];
  }
}
