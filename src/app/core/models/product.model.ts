export interface Product {
  id: string;
  space_id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  location: string;
  purchase_value: number;
  purchase_date?: string;
  serial_number?: string;
  warranty_type?: string;
  warranty_expiry?: string;
  extended_warranty_expiry?: string;
  warranty_status?: 'active' | 'expiring_soon' | 'expired' | 'no_warranty';
  status?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterProductRequest {
  space_id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  location: string;
  purchase_value: number;
  purchase_date?: string;
  serial_number?: string;
  warranty_type?: string;
  warranty_expiry?: string;
  extended_warranty_expiry?: string;
}

export interface UpdateProductRequest {
  name?: string;
  category?: string;
  brand?: string;
  model?: string;
  location?: string;
  purchase_value?: number;
  purchase_date?: string;
  serial_number?: string;
  warranty_type?: string;
  warranty_expiry?: string;
  extended_warranty_expiry?: string;
}

export interface ProductSearchParams {
  space_id: string;
  term?: string;
  category?: string;
  warranty_status?: string;
  min_value?: number;
  max_value?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ProductSearchResponse {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
}

export const PRODUCT_CATEGORIES = [
  'Eletrodoméstico',
  'Eletrônico',
  'Móvel',
  'Ferramenta',
  'Veículo',
  'Equipamento',
  'Outro',
];

export const WARRANTY_TYPES = [
  'Fabricante',
  'Loja',
  'Estendida',
  'Nenhuma',
];
