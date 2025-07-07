import { Product, ProductWithPrice } from '../types';
import products from '../data/products.json';
import { getGoldPrice } from './goldPrice';

export async function getAllProducts(): Promise<ProductWithPrice[]> {
  const goldPrice = await getGoldPrice();
  
  return products.map((product: Product) => {
    const price = calculatePrice(product, goldPrice);
    const rating = calculateRating(product.popularityScore);
    
    return {
      ...product,
      price,
      rating
    };
  });
}

export async function getFilteredProducts(minPrice?: number, maxPrice?: number, minRating?: number): Promise<ProductWithPrice[]> {
  const allProducts = await getAllProducts();
  
  return allProducts.filter(product => {
    const priceInRange = (!minPrice || product.price >= minPrice) && 
                        (!maxPrice || product.price <= maxPrice);
    const ratingInRange = !minRating || product.rating >= minRating;
    
    return priceInRange && ratingInRange;
  });
}

function calculatePrice(product: Product, goldPrice: number): number {
  const price = (product.popularityScore + 1) * product.weight * goldPrice;
  // Round to 2 decimal places
  return Math.round(price * 100) / 100;
}

function calculateRating(popularityScore: number): number {
  // Convert popularity score (0-1) to rating (0-5)
  const rating = popularityScore * 5;
  // Round to 1 decimal place
  return Math.round(rating * 10) / 10;
} 