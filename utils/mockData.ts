
import { FashionItem, ProductMatch } from '../types';

/**
 * MOCK GENERATOR DISABLED
 * As requested, we no longer use simulation data.
 */
export function generateMockMatches(item: FashionItem): ProductMatch[] {
  console.log("Mock data requested but disabled for item:", item.title);
  return [];
}
