export interface Product {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: ProductPrice;
  category: ProductCategory;
  issueDate: string;
  stock: number;
  rating: number;
  brand: string;
  warranty: number;
  images: string[];
}

export interface ProductPrice {
  current: number;
  currency: string;
  beforeDiscount: number;
  discountPercentage: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  image: string;
}

export interface ProductDetails extends Product {
  ratings: Rating[];
}

export interface Rating {
  userId: string;
  value: number;
  createdAt: string;
}
