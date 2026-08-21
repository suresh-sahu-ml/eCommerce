import { useEffect, useState } from "react";
import catalogApi, { FetchProductsParams, FetchProductsResponse } from "../api/catalogApi";
import { Product } from "../types";

interface UseCatalogReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  refetch: (params: FetchProductsParams) => void;
}

export const useCatalog = (initialParams?: FetchProductsParams): UseCatalogReturn => {
  const [state, setState] = useState<Omit<UseCatalogReturn, 'refetch'>>({
    products: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 12,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await catalogApi.fetchProducts(
          initialParams || { page: 1, limit: 12 }
        );
        setState((prev) => ({
          ...prev,
          products: data.products,
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to fetch products",
          loading: false,
        }));
      }
    };

    fetchProducts();
  }, [initialParams]);

  const refetch = (params: FetchProductsParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    catalogApi.fetchProducts(params).then((data) => {
      setState((prev) => ({
        ...prev,
        products: data.products,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        loading: false,
      }));
    }).catch((error) => {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to fetch products",
        loading: false,
      }));
    });
  };

  return { ...state, refetch };
};

export const useProductById = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await catalogApi.fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  return { product, loading, error };
};
