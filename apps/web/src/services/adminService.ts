import { BookingRecord, BookingStatus } from '@aarvix/shared';
import { bookingService } from './bookingService.js';

export interface PendingVehicleRecord {
  id: string;
  regNumber: string;
  vehicleType: string;
  tonnage: number;
  ownerName: string;
  ownerPhone: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  assignedVehicleId?: string; // Generated on approval (e.g. ARVX-V-1042)
  assignedDriverId?: string;
  assignedDriverName?: string;
  documents: {
    rcNumber: string;
    rcValid: boolean;
    insurancePolicy: string;
    insuranceExpiryDays: number;
    fitnessCert: string;
    fitnessValid: boolean;
    permitType: 'National Goods Permit (All-India)' | 'State Carriage Permit';
    permitValid: boolean;
  };
}

export interface DriverVerificationRecord {
  id: string;
  fullName: string;
  phone: string;
  licenceNumber: string;
  licenceType: 'Heavy Goods Vehicle (HGV)' | 'Medium Goods Vehicle (MGV)' | 'Light Commercial (LCV)';
  experienceYears: number;
  status: 'pending' | 'approved' | 'rejected';
  assignedVehicleReg?: string;
  documents: {
    dlVerified: boolean;
    aadhaarVerified: boolean;
    policeVerificationValid: boolean;
  };
}

export interface EmergencySosAlert {
  id: string;
  driverName: string;
  driverPhone: string;
  vehicleReg: string;
  bookingNumber: string;
  type: 'tyre_puncture' | 'engine_breakdown' | 'minor_accident' | 'medical';
  locationDesc: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  status: 'active' | 'assistance_dispatched' | 'resolved';
  dispatchedService?: string;
}

export interface CustomerComplaintRecord {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  category: 'transit_delay' | 'driver_behavior' | 'billing_dispute' | 'cargo_damage';
  description: string;
  status: 'open' | 'investigating' | 'refund_processed' | 'resolved';
  refundAmount?: number;
  createdAt: string;
}

const VEHICLES_STORAGE_KEY = 'aarvix_admin_vehicles_dev';
const DRIVERS_STORAGE_KEY = 'aarvix_admin_drivers_dev';
const SOS_STORAGE_KEY = 'aarvix_admin_sos_dev';
const COMPLAINTS_STORAGE_KEY = 'aarvix_admin_complaints_dev';

const DEFAULT_PENDING_VEHICLES: PendingVehicleRecord[] = [
  {
    id: 'veh_sub_01',
    regNumber: 'KA 04 MJ 1902',
    vehicleType: '32 Ft Multi Axle Container (15T)',
    tonnage: 15.0,
    ownerName: 'Balaji Freight Carriers',
    ownerPhone: '9845012345',
    submissionDate: '23 Oct 2026, 09:30',
    status: 'pending',
    documents: {
      rcNumber: 'KA04/2022/0081920',
      rcValid: true,
      insurancePolicy: 'ICICI-LOMB-992140',
      insuranceExpiryDays: 142,
      fitnessCert: 'KA04-FC-2026-90',
      fitnessValid: true,
      permitType: 'National Goods Permit (All-India)',
      permitValid: true,
    },
  },
  {
    id: 'veh_sub_02',
    regNumber: 'MH 12 RN 4401',
    vehicleType: 'Tata 407 Light Commercial (2.5T)',
    tonnage: 2.5,
    ownerName: 'Sahyadri Logistics LLP',
    ownerPhone: '9822098765',
    submissionDate: '23 Oct 2026, 10:15',
    status: 'pending',
    documents: {
      rcNumber: 'MH12/2021/0044199',
      rcValid: true,
      insurancePolicy: 'NEW-IND-881924',
      insuranceExpiryDays: 98,
      fitnessCert: 'MH12-FC-2026-14',
      fitnessValid: true,
      permitType: 'National Goods Permit (All-India)',
      permitValid: true,
    },
  },
  {
    id: 'veh_sub_03',
    regNumber: 'TN 09 CK 7712',
    vehicleType: '17 Ft Eicher Pro High-Side (6T)',
    tonnage: 6.0,
    ownerName: 'Chennai Prime Haulage',
    ownerPhone: '9841054321',
    submissionDate: '22 Oct 2026, 17:00',
    status: 'approved',
    assignedVehicleId: 'ARVX-V-1042',
    assignedDriverId: 'drv_01',
    assignedDriverName: 'Murugan S. (KA01-DL-882)',
    documents: {
      rcNumber: 'TN09/2020/0019283',
      rcValid: true,
      insurancePolicy: 'TATA-AIG-119280',
      insuranceExpiryDays: 210,
      fitnessCert: 'TN09-FC-2026-03',
      fitnessValid: true,
      permitType: 'National Goods Permit (All-India)',
      permitValid: true,
    },
  },
];

const DEFAULT_DRIVERS: DriverVerificationRecord[] = [
  {
    id: 'drv_01',
    fullName: 'Ramesh Kumar',
    phone: '9880192834',
    licenceNumber: 'KA01-20150009821',
    licenceType: 'Heavy Goods Vehicle (HGV)',
    experienceYears: 9,
    status: 'approved',
    assignedVehicleReg: 'KA 01 AB 8829',
    documents: {
      dlVerified: true,
      aadhaarVerified: true,
      policeVerificationValid: true,
    },
  },
  {
    id: 'drv_02',
    fullName: 'Suresh Patil',
    phone: '9823049182',
    licenceNumber: 'MH12-20180004910',
    licenceType: 'Heavy Goods Vehicle (HGV)',
    experienceYears: 6,
    status: 'pending',
    documents: {
      dlVerified: true,
      aadhaarVerified: true,
      policeVerificationValid: true,
    },
  },
  {
    id: 'drv_03',
    fullName: 'Anil Yadav',
    phone: '9811082736',
    licenceNumber: 'DL04-20190008819',
    licenceType: 'Medium Goods Vehicle (MGV)',
    experienceYears: 4,
    status: 'approved',
    assignedVehicleReg: 'TN 09 CK 7712',
    documents: {
      dlVerified: true,
      aadhaarVerified: true,
      policeVerificationValid: true,
    },
  },
];

const DEFAULT_SOS_ALERTS: EmergencySosAlert[] = [
  {
    id: 'SOS-2026-891',
    driverName: 'Ramesh Kumar',
    driverPhone: '+91 98801 92834',
    vehicleReg: 'KA 01 AB 8829',
    bookingNumber: 'ARVX-2026-8921',
    type: 'tyre_puncture',
    locationDesc: 'NH-44 Corridor, 4 km before Krishnagiri Toll Plaza',
    coordinates: { lat: 12.528, lng: 78.214 },
    timestamp: '23 Oct 2026, 11:20 AM',
    status: 'active',
  },
];

const DEFAULT_COMPLAINTS: CustomerComplaintRecord[] = [
  {
    id: 'CMP-1049',
    bookingNumber: 'ARVX-2026-8812',
    customerName: 'Anand Verma',
    customerPhone: '9876543210',
    category: 'transit_delay',
    description: 'Driver delayed by 45 mins at loading dock due to toll barrier congestion.',
    status: 'resolved',
    refundAmount: 500,
    createdAt: '22 Oct 2026',
  },
];

export const adminService = {
  // --- Vehicles ---
  getVehicles(): PendingVehicleRecord[] {
    try {
      const data = localStorage.getItem(VEHICLES_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_PENDING_VEHICLES;
    } catch {
      return DEFAULT_PENDING_VEHICLES;
    }
  },

  approveVehicle(id: string, assignedDriverId?: string): PendingVehicleRecord {
    const list = this.getVehicles();
    const uniqueVehicleId = `ARVX-V-${Math.floor(1000 + Math.random() * 9000)}`;
    const drivers = this.getDrivers();
    const driver = drivers.find((d) => d.id === assignedDriverId) || drivers[0];

    const updated = list.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          status: 'approved' as const,
          assignedVehicleId: uniqueVehicleId,
          assignedDriverId: driver?.id,
          assignedDriverName: driver ? `${driver.fullName} (${driver.licenceNumber.slice(0, 10)})` : 'Assigned in dispatch pool',
        };
      }
      return v;
    });

    try {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated.find((v) => v.id === id)!;
  },

  rejectVehicle(id: string, reason: string): PendingVehicleRecord {
    const list = this.getVehicles();
    const updated = list.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          status: 'rejected' as const,
          rejectionReason: reason,
        };
      }
      return v;
    });

    try {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated.find((v) => v.id === id)!;
  },

  // --- Drivers ---
  getDrivers(): DriverVerificationRecord[] {
    try {
      const data = localStorage.getItem(DRIVERS_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_DRIVERS;
    } catch {
      return DEFAULT_DRIVERS;
    }
  },

  approveDriver(id: string): DriverVerificationRecord {
    const list = this.getDrivers();
    const updated = list.map((d) => (d.id === id ? { ...d, status: 'approved' as const } : d));
    try {
      localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated.find((d) => d.id === id)!;
  },

  // --- Bookings & Smart Driver Assignment ---
  getAllBookings(): BookingRecord[] {
    const local = bookingService.getStoredBookings();
    if (local.length > 0) return local;

    // Fallback default bookings
    return [
      {
        id: 'bkg_demo_01',
        bookingNumber: 'ARVX-2026-8921',
        customerId: 'cust_01',
        customerName: 'TVS Industrial Logistics',
        customerPhone: '9840192834',
        driverId: 'drv_01',
        vehicleId: 'ARVX-V-1042',
        status: 'in_transit' as BookingStatus,
        pickup: {
          address: 'Gate 4, Peenya Industrial Area',
          city: 'Bengaluru',
          state: 'Karnataka',
          lat: 12.9716,
          lng: 77.5946,
        },
        destination: {
          address: 'Dock 2, Ambattur Industrial Estate',
          city: 'Chennai',
          state: 'Tamil Nadu',
          lat: 13.0827,
          lng: 80.2707,
        },
        vehicleSpec: {
          id: 'eicher_14ft',
          name: '14 Ft Eicher Pro (4 Tonne)',
          category: 'intermediate',
          tonnage: 4.0,
          payloadKg: 4000,
          dimensions: { lengthFt: 14, widthFt: 6.5, heightFt: 6.5 },
          bodyType: 'closed_container',
          baseFare: 1800,
          baseKm: 15,
          perKmRate: 42,
          popularUses: ['FMCG', 'Consumer durables'],
          description: 'Closed container lorry',
        },
        goodsCategory: 'fmcg_packaged',
        estimatedWeightKg: 3200,
        fareBreakdown: {
          distanceKm: 346,
          estimatedHours: 8.5,
          baseFare: 1800,
          distanceFare: 13860,
          loadingUnloadingCharge: 0,
          fuelSurcharge: 940,
          subtotal: 16600,
          gstAmount: 830,
          gstPercentage: 5,
          tollEstimate: 760,
          totalFare: 18190,
          isReverseChargeGST: false,
        },
        paymentMethod: 'cash_at_delivery',
        paymentStatus: 'pending',
        createdAt: '23 Oct 2026, 08:30 AM',
        updatedAt: '23 Oct 2026, 11:15 AM',
        deliveryOtp: '7412',
      },
    ];
  },

  assignBooking(bookingId: string, driverId: string, vehicleId: string) {
    const list = this.getAllBookings();

    const updated = list.map((b) => {
      if (b.id === bookingId || b.bookingNumber === bookingId) {
        return {
          ...b,
          driverId,
          vehicleId,
          status: 'driver_assigned' as BookingStatus,
          customerName: b.customerName,
          updatedAt: new Date().toLocaleString(),
        };
      }
      return b;
    });

    try {
      localStorage.setItem('aarvix_booking_records_dev', JSON.stringify(updated));
    } catch {}
    return updated;
  },

  updateBookingStatus(bookingNumber: string, status: BookingStatus) {
    const list = this.getAllBookings();
    const updated = list.map((b) => (b.bookingNumber === bookingNumber ? { ...b, status } : b));
    try {
      localStorage.setItem('aarvix_booking_records_dev', JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // --- SOS Emergency Control Room ---
  getSosAlerts(): EmergencySosAlert[] {
    try {
      const data = localStorage.getItem(SOS_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_SOS_ALERTS;
    } catch {
      return DEFAULT_SOS_ALERTS;
    }
  },

  createSosAlert(alert: Omit<EmergencySosAlert, 'id' | 'timestamp' | 'status'>): EmergencySosAlert {
    const list = this.getSosAlerts();
    const newAlert: EmergencySosAlert = {
      ...alert,
      id: `SOS-2026-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleString(),
      status: 'active',
    };
    const updated = [newAlert, ...list];
    try {
      localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newAlert;
  },

  dispatchSosAssistance(alertId: string, serviceType: string) {
    const list = this.getSosAlerts();
    const updated = list.map((a) =>
      a.id === alertId ? { ...a, status: 'assistance_dispatched' as const, dispatchedService: serviceType } : a
    );
    try {
      localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  resolveSosAlert(alertId: string) {
    const list = this.getSosAlerts();
    const updated = list.map((a) => (a.id === alertId ? { ...a, status: 'resolved' as const } : a));
    try {
      localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // --- Complaints ---
  getComplaints(): CustomerComplaintRecord[] {
    try {
      const data = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_COMPLAINTS;
    } catch {
      return DEFAULT_COMPLAINTS;
    }
  },

  resolveComplaint(id: string) {
    const list = this.getComplaints();
    const updated = list.map((c) => (c.id === id ? { ...c, status: 'resolved' as const } : c));
    try {
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  },
};
