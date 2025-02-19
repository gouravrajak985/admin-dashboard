import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Discount } from '../types/database';

interface DiscountState {
  discounts: Discount[];
  isLoading: boolean;
  error: string | null;
  fetchDiscounts: () => Promise<void>;
  createDiscount: (discount: Omit<Discount, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Discount>;
  updateDiscount: (id: string, discount: Partial<Discount>) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
}

export const useDiscountStore = create<DiscountState>((set, get) => ({
  discounts: [],
  isLoading: false,
  error: null,

  fetchDiscounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ discounts: data as Discount[] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  createDiscount: async (discount) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('discounts')
        .insert([discount])
        .select()
        .single();

      if (error) throw error;
      
      const newDiscount = data as Discount;
      set(state => ({
        discounts: [newDiscount, ...state.discounts]
      }));
      
      return newDiscount;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateDiscount: async (id, discount) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('discounts')
        .update(discount)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        discounts: state.discounts.map(d => 
          d.id === id ? { ...d, ...discount } : d
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDiscount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        discounts: state.discounts.filter(d => d.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));