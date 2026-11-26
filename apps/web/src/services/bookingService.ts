import {
  BookingRecord,
  BookingStatus,
  DriverInfo,
  FareBreakdown,
  GoodsCategory,
  LocationPoint,
  VehicleSpec,
} from '@aarvix/shared';

export interface BookingSubmissionData {
  pickup: LocationPoint;
  destination: LocationPoint;
  vehicleSpec: VehicleSpec;
  goodsCategory: GoodsCategory;
  estimatedWeightKg: number;
  cargoDimensions?: { lengthFt: number; widthFt: number; heightFt: number };
  loadSizeId?: string;
  specialInstructions?: string;
  helpersCount: number;
  fareBreakdown: FareBreakdown;
  paymentMethod: 'cash_at_delivery' | 'online_advance' | 'enterprise_credit';
  customerName: string;
  customerPhone: string;
  scheduledAt?: string;
  couponCode?: string;
  distanceKm: number;
  etaMinutes: number;
}

const STORAGE_KEY = 'aarvix_booking_records_dev';
const PROFILE_KEY = 'aarvix_contact_profile';

export const TERMINAL_STATUSES: BookingStatus[] = ['delivered', 'completed', 'cancelled'];

/**
 * Development-only booking storage (browser localStorage).
 * Replace the bodies of these methods with real API / Firestore calls when the
 * backend is ready - the page code only talks to this service.
 */
export const bookingService = {
  isDevelopmentAdapter: true,

  generateBookingNumber(): string {
    return `ARVX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  },

  async submitBooking(data: BookingSubmissionData): Promise<BookingRecord> {
    await new Promise((r) => setTimeout(r, 500));
    const now = new Date().toISOString();
    const record: BookingRecord = {
      id: `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      bookingNumber: this.generateBookingNumber(),
      customerId: 'cust_dev_01',
      customerName: data.customerName || 'Customer',
      customerPhone: data.customerPhone,
      status: 'searching_driver',
      pickup: data.pickup,
      destination: data.destination,
      vehicleSpec: data.vehicleSpec,
      goodsCategory: data.goodsCategory,
      estimatedWeightKg: data.estimatedWeightKg,
      cargoDimensions: data.cargoDimensions,
      fareBreakdown: data.fareBreakdown,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'online_advance' ? 'partially_paid' : 'pending',
      createdAt: now,
      updatedAt: now,
      pickupTimeWindow: data.scheduledAt ? 'Scheduled' : 'As soon as a driver accepts',
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      pickupOtp: String(Math.floor(1000 + Math.random() * 9000)),
      loadSizeId: data.loadSizeId,
      scheduledAt: data.scheduledAt,
      couponCode: data.couponCode,
      helpersCount: data.helpersCount,
      distanceKm: data.distanceKm,
      etaMinutes: data.etaMinutes,
    };
    this.write([record, ...this.getStoredBookings()]);
    return record;
  },

  getStoredBookings(): BookingRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
    } catch {
      return [];
    }
  },

  getBookingById(idOrNumber: string): BookingRecord | null {
    return this.getStoredBookings().find((b) => b.id === idOrNumber || b.bookingNumber === idOrNumber) || null;
  },

  /** The most recent trip that is still running (used to resume after refresh) */
  getActiveBooking(): BookingRecord | null {
    return this.getStoredBookings().find((b) => !TERMINAL_STATUSES.includes(b.status)) || null;
  },

  updateBooking(id: string, patch: Partial<BookingRecord>): BookingRecord | null {
    let updated: BookingRecord | null = null;
    const all = this.getStoredBookings().map((b) => {
      if (b.id !== id) return b;
      updated = { ...b, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    });
    this.write(all);
    return updated;
  },

  assignDriver(id: string, driver: DriverInfo): BookingRecord | null {
    return this.updateBooking(id, { driver, status: 'driver_assigned' });
  },

  write(records: BookingRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      /* storage blocked */
    }
  },

  getProfile(): { name: string; phone: string } {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || '') as { name: string; phone: string };
    } catch {
      return { name: '', phone: '' };
    }
  },

  saveProfile(profile: { name: string; phone: string }) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  },
};
