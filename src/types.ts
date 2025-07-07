export interface Product {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
}

export interface ProductWithPrice extends Product {
  price: number;
  rating: number;
} 