
import React, { useState, createContext, useCallback } from 'react';
import type { Product, CartItem, Language, View, ShippingInfo, SavedAddress } from './types';
import { products as initialProducts } from './data/products';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import Chatbot from './components/Chatbot';
import VideoBanner from './components/VideoBanner';
import HomeView from './components/HomeView';
import ShippingView from './components/ShippingView';
import PaymentView from './components/PaymentView';
import LoginView from './components/LoginView';
import ProfileView from './components/ProfileView';
import ManageAddressView from './components/ManageAddressView';

interface AppContextType {
  view: View;
  setView: (view: View) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isOrderJustPlaced: boolean;
  setIsOrderJustPlaced: (isPlaced: boolean) => void;
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  savedAddresses: SavedAddress[];
  addSavedAddress: (address: SavedAddress) => void;
  removeSavedAddress: (label: string) => void;
}

export const AppContext = createContext<AppContextType>(null!);

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderJustPlaced, setIsOrderJustPlaced] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
      // Mock data for demonstration
      { label: 'home', name: 'Demo User', email: 'home@example.com', address: '123 Home St, Bangalore' },
      { label: 'office', name: 'Demo User', email: 'work@example.com', address: '456 Office Ave, Bangalore' },
      { label: 'college', name: 'Demo User', email: 'college@example.com', address: '789 College Rd, Bangalore' },
  ]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = (email: string, pass: string) => {
    // Dummy login for demonstration
    setIsAuthenticated(true);
    setView('profile');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setView('home');
  };

  const addSavedAddress = (address: SavedAddress) => {
    // If an address with the same label exists, replace it. Otherwise, add it.
    setSavedAddresses(prev => {
      const existingIndex = prev.findIndex(a => a.label.toLowerCase() === address.label.toLowerCase());
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = address;
        return updated;
      }
      return [...prev, address];
    });
  };

  const removeSavedAddress = (label: string) => {
    setSavedAddresses(prev => prev.filter(a => a.label.toLowerCase() !== label.toLowerCase()));
  };
  
  const handleSetView = (newView: View) => {
    window.scrollTo(0, 0);
    setView(newView);
  }

  const renderView = () => {
    // Protected Routes
    const protectedViews: View[] = ['profile', 'manage-address'];
    if (protectedViews.includes(view) && !isAuthenticated) {
      return <LoginView />;
    }

    switch (view) {
      case 'home': return <HomeView />;
      case 'products': return <ProductList />;
      case 'product-detail': return <ProductDetail />;
      case 'cart': return <CartView />;
      case 'shipping': return <ShippingView />;
      case 'payment': return <PaymentView />;
      case 'checkout': return <CheckoutView />;
      case 'login': return <LoginView />;
      case 'profile': return <ProfileView />;
      case 'manage-address': return <ManageAddressView />;
      default: return <HomeView />;
    }
  };

  const contextValue: AppContextType = {
    view,
    setView: handleSetView,
    language,
    setLanguage,
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    selectedProduct,
    setSelectedProduct,
    isOrderJustPlaced,
    setIsOrderJustPlaced,
    shippingInfo,
    setShippingInfo,
    activeCategory,
    setActiveCategory,
    isAuthenticated,
    login,
    logout,
    savedAddresses,
    addSavedAddress,
    removeSavedAddress,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <VideoBanner />
        <main className="flex-grow">
          {renderView()}
        </main>
        <footer className="bg-gray-800 text-gray-400 py-4 text-center">
            <p>&copy; {new Date().getFullYear()} Artisans Connect. All rights reserved.</p>
        </footer>
        <Chatbot />
      </div>
    </AppContext.Provider>
  );
};

export default App;