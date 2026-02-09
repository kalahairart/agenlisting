
export interface Villa {
  id: string;
  name: string;
  image_url: string;
  google_drive_link?: string;
  description: string;
  location: string;
  price_monthly: number;
  price_yearly: number;
  agent_fee: number;
  status: VillaStatus;
  created_at?: string;
}

export enum VillaStatus {
  AVAILABLE = 'Available',
  RENTED = 'Rented',
  MAINTENANCE = 'Maintenance'
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Stats {
  totalVillas: number;
  totalPotentialCommission: number;
  availableCount: number;
  rentedCount: number;
}
