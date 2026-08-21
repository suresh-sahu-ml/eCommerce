import { axiosInstance } from "./axiosInstance";
import { Product } from "../types";

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  search?: string;
}

export interface FetchProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

const catalogApi = {
  async fetchProducts(params: FetchProductsParams): Promise<FetchProductsResponse> {
    const response = await axiosInstance.get<FetchProductsResponse>(
      "/products",
      { params }
    );
    return response.data;
  },

  async fetchProductById(id: string): Promise<Product> {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  async fetchProductsByBrand(brand: string): Promise<Product[]> {
    const response = await axiosInstance.get<Product[]>(
      "/products",
      {
        params: { brand },
      }
    );
    return response.data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await axiosInstance.get<Product[]>(
      "/products/search",
      {
        params: { q: query },
      }
    );
    return response.data;
  },
};

export default catalogApi;
