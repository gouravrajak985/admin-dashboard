import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/database';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: data as Product[] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      
      const newProduct = data as Product;
      set(state => ({
        products: [newProduct, ...state.products]
      }));
      
      return newProduct;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...product } : p
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));