
export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  [key: string]: string;
}

export interface LocaleContent {
  [key:string]: Translations;
}

export interface Product {
  id: number;
  name: { [key in Language]: string };
  description: { [key in Language]: string };
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingInfo {
  email: string;
  name: string;
  address: string;
}

export interface SavedAddress extends ShippingInfo {
  label: string;
}

export type View = 'home' | 'products' | 'product-detail' | 'cart' | 'shipping' | 'payment' | 'checkout' | 'login' | 'profile' | 'manage-address';