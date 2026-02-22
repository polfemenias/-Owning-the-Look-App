
export type AppView = 'landing' | 'crop' | 'analyzing' | 'results';

export interface FashionItem {
  category: string;
  title: string;
  color: string;
  material: string;
  query: string;
  id: string;
  image?: string;
}

export interface AnalysisResult {
  mainItem: FashionItem;
  detectedItems: FashionItem[];
}

export interface ProductMatch {
  id: string;
  title: string;
  store: string;
  price: number | string;
  oldPrice?: number;
  imageUrl: string;
  affiliateUrl?: string; // Nuevo: URL para redireccionar a la tienda
  isBestMatch?: boolean;
  isOnSale?: boolean;
}
