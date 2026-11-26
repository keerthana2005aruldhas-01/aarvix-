export type UserRole = 'customer' | 'transporter' | 'driver' | 'admin';

export type VehicleCategory =
  | 'mini_truck'
  | 'light_commercial'
  | 'intermediate'
  | 'medium_heavy'
  | 'trailer_container'
  | 'heavy_hauler';

export type VehicleBodyType =
  | 'open'
  | 'closed_container'
  | 'high_side'
  | 'flatbed'
  | 'tarpaulin';

export type GoodsCategory =
  | 'fmcg_packaged'
  | 'industrial_machinery'
  | 'construction_materials'
  | 'agricultural_produce'
  | 'automotive_parts'
  | 'textiles'
  | 'electronics'
  | 'perishable_goods'
  | 'chemicals'
  | 'other';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'searching_driver'
  | 'driver_assigned'
  | 'heading_to_pickup'
  | 'loading'
  | 'in_transit'
  | 'at_destination'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface LocationPoint {
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  contactPerson?: string;
  contactPhone?: string;
}

export interface VehicleSpec {
  id: string;
  name: string;
  category: VehicleCategory;
  tonnage: number;
  payloadKg: number;
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
  };
  bodyType: VehicleBodyType;
  baseFare: number;
  baseKm: number;
  perKmRate: number;
  popularUses: string[];
  description: string;
}

export interface FareBreakdown {
  distanceKm: number;
  estimatedHours: number;
  baseFare: number;
  distanceFare: number;
  loadingUnloadingCharge: number;
  fuelSurcharge: number;
  subtotal: number;
  gstAmount: number;
  gstPercentage: number;
  tollEstimate: number;
  totalFare: number;
  isReverseChargeGST: boolean;
  discount?: number;
}

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  transporterId?: string;
  driverId?: string;
  vehicleId?: string;
  status: BookingStatus;
  pickup: LocationPoint;
  destination: LocationPoint;
  vehicleSpec: VehicleSpec;
  goodsCategory: GoodsCategory;
  estimatedWeightKg: number;
  cargoDimensions?: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
  };
  fareBreakdown: FareBreakdown;
  paymentMethod: 'cash_at_delivery' | 'online_advance' | 'enterprise_credit';
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  pickupTimeWindow?: string;
  deliveryOtp?: string;
  pickupOtp?: string;
  loadSizeId?: string;
  scheduledAt?: string;
  couponCode?: string;
  helpersCount?: number;
  distanceKm?: number;
  etaMinutes?: number;
  driver?: DriverInfo;
  rating?: number;
  tip?: number;
  cancelReason?: string;
}

export interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  trips: number;
  vehicleNumber: string;
}
