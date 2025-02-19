import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Customer } from '../types/database';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  createCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Customer>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ customers: data as Customer[] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  createCustomer: async (customer) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (error) throw error;
      
      const newCustomer = data as Customer;
      set(state => ({
        customers: [newCustomer, ...state.customers]
      }));
      
      return newCustomer;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCustomer: async (id, customer) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        customers: state.customers.map(c => 
          c.id === id ? { ...c, ...customer } : c
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        customers: state.customers.filter(c => c.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));