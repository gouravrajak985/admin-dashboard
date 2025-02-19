export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  status: 'Live' | 'Saved';
  sku?: string;
  image_url?: string;
  category?: string;
  brand?: string;
  dimensions?: string;
  weight?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  payment_status: 'Pending' | 'Paid' | 'Failed';
  payment_method: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded' | 'Completed' | 'Saved';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'discount_code' | 'coupon_codes';
  value: number;
  value_type: 'percentage' | 'fixed';
  min_purchase_amount?: number;
  usage_count: number;
  max_uses?: number;
  status: 'Active' | 'Expired' | 'Scheduled';
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}