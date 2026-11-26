# AARVIX TRANSPORT — Database Schema & Data Modeling

Designed for Cloud Firestore with optimized query patterns, minimal document explosion, and transactional integrity.

## Primary Collections

### 1. `users`
- `uid`: string (Primary Key, matches Firebase Auth UID)
- `phone`: string (+91...)
- `role`: `'customer' | 'driver' | 'transporter' | 'admin'`
- `fullName`: string
- `email`: string | null
- `companyName`: string | null
- `gstin`: string | null
- `savedAddresses`: Array<{ label, address, city, state, pincode, lat, lng }>
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 2. `organizations` (Transporters & Fleet Companies)
- `id`: string
- `ownerUid`: string
- `companyName`: string
- `legalEntityName`: string
- `gstin`: string
- `panNumber`: string
- `fleetSize`: number
- `verificationStatus`: `'pending' | 'under_review' | 'verified' | 'rejected'`
- `contactPhone`: string
- `contactEmail`: string
- `headquarters`: { city, state, address }
- `createdAt`: Timestamp

### 3. `drivers`
- `id`: string (UID)
- `organizationId`: string | null (Null if independent owner-operator)
- `fullName`: string
- `phone`: string
- `licenceNumber`: string
- `licenceExpiry`: Timestamp
- `experienceYears`: number
- `isOnline`: boolean
- `activeTripId`: string | null
- `activeVehicleId`: string | null
- `rating`: number
- `totalCompletedTrips`: number
- `documents`: { dlUrl, aadhaarUrl, policeVerificationUrl }
- `verificationStatus`: `'pending' | 'under_review' | 'verified' | 'rejected'`
- `lastKnownLocation`: { lat, lng, updatedAt }

### 4. `vehicles`
- `id`: string
- `organizationId`: string
- `assignedDriverId`: string | null
- `registrationNumber`: string (e.g., KA01AB1234)
- `vehicleSpecId`: string (ref to `VEHICLE_CATALOG`)
- `tonnage`: number
- `bodyType`: `'open' | 'closed_container' | 'high_side' | 'flatbed' | 'tarpaulin'`
- `isApproved`: boolean
- `isAvailable`: boolean
- `insuranceExpiry`: Timestamp
- `fitnessExpiry`: Timestamp
- `nationalPermitExpiry`: Timestamp
- `createdAt`: Timestamp

### 5. `bookings`
- `id`: string
- `bookingNumber`: string (e.g. `ARVX-2026-8921`)
- `customerId`: string
- `transporterId`: string | null
- `driverId`: string | null
- `vehicleId`: string | null
- `status`: BookingStatus enum
- `pickup`: LocationPoint
- `destination`: LocationPoint
- `vehicleSpecId`: string
- `goodsCategory`: string
- `estimatedWeightKg`: number
- `fareBreakdown`: { distanceKm, baseFare, distanceFare, loadingUnloadingCharge, fuelSurcharge, gstAmount, totalFare }
- `paymentMethod`: `'cash_at_delivery' | 'online_advance' | 'enterprise_credit'`
- `paymentStatus`: `'pending' | 'partially_paid' | 'paid' | 'refunded'`
- `deliveryOtp`: string (hashed)
- `proofOfDeliveryUrl`: string | null
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 6. `trips` & `tripLocations`
- `tripId`: string
- `bookingId`: string
- `driverId`: string
- `vehicleId`: string
- `startTime`: Timestamp
- `endTime`: Timestamp | null
- `distanceTravelledKm`: number
- Locations logged to `/tripLocations` with batch writes (1-minute intervals during active transit only).
