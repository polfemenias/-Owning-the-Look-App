
import { FashionItem, ProductMatch } from '../types';
import { STORES } from '../constants';

export function generateMockMatches(item: FashionItem): ProductMatch[] {
  const matches: ProductMatch[] = [];
  const count = 7 + Math.floor(Math.random() * 5); // 7 to 11 results
  
  // Use category seeds for consistent-ish imagery
  const categorySeeds: Record<string, string> = {
    'Tops': 'sweater',
    'Bottoms': 'jeans',
    'Accessories': 'bag',
    'Footwear': 'shoes',
    'Outerwear': 'coat'
  };

  const seed = categorySeeds[item.category] || 'clothing';

  for (let i = 0; i < count; i++) {
    const isSale = Math.random() > 0.7;
    const originalPrice = 50 + Math.random() * 400;
    const salePrice = isSale ? originalPrice * (0.6 + Math.random() * 0.3) : originalPrice;
    
    matches.push({
      id: `${item.id}-match-${i}`,
      title: i === 0 ? item.title : `${item.color} ${item.title.split(' ').pop() || 'Item'}`,
      store: STORES[Math.floor(Math.random() * STORES.length)],
      price: salePrice,
      oldPrice: isSale ? originalPrice : undefined,
      imageUrl: `https://picsum.photos/seed/${item.id}-${i}/400/550`,
      isBestMatch: i === 0,
      isOnSale: isSale
    });
  }

  return matches;
}
