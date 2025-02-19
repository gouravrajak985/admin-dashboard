/**
 * Order Store
 * 
 * Manages the global state for orders using Zustand.
 * Handles all order-related operations including:
 * - Fetching orders
 * - Creating new orders with items
 * - Updating order status
 * - Deleting orders
 * - Retrieving order items
 * 
 * Uses Supabase for data persistence and real-time updates.
 */
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types/database';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'user_id'>, items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]) => Promise<Order>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial state
  orders: [],
  isLoading: false,
  error: null,

  // Fetch all orders
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data as Order[] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new order with items
  createOrder: async (order, items) => {
    set({ isLoading: true, error: null });
    try {
      // Create the order first
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items with the new order ID
      const orderItems = items.map(item => ({
        ...item,
        order_id: newOrder.id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update local state with new order
      set(state => ({
        orders: [newOrder as Order, ...state.orders]
      }));

      return newOrder as Order;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update existing order
  updateOrder: async (id, order) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update(order)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        orders: state.orders.map(o => 
          o.id === id ? { ...o, ...order } : o
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        orders: state.orders.filter(o => o.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Get items for a specific order
  getOrderItems: async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return data as OrderItem[];
    } catch (error) {
      throw error;
    }
  }
}));