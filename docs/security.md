# AARVIX TRANSPORT — Security Architecture & Data Protection

## 1. Zero Trust Principles
- **Authentication**: Firebase Authentication with SMS phone OTP verification for drivers and customers. Admin privileges can never be self-assigned; verified via custom claims set exclusively by trusted cloud functions.
- **Authorization**: Granular Firestore Security Rules enforcing data isolation between competitors, shippers, and drivers.
- **Client Restrictions**: The client app never computes final settlement amounts, never directly marks a payment as successful, and cannot overwrite vehicle verification statuses.

## 2. PII and Financial Protection
- **No Card Storage**: Payments processed via PCI-DSS compliant Indian gateways (Razorpay/Cashfree). Frontend receives only order tokens.
- **KYC Document Isolation**: Driving licences, RC books, and Aadhaar cards are stored in private Cloud Storage buckets with restricted read access.
- **Delivery Verification**: Two-factor proof of delivery requiring customer-side 4-digit numeric OTP alongside geo-tagged photographic consignment delivery proof.

## 3. Location & Tracking Privacy
- GPS tracking is enabled strictly when a driver is on an active accepted trip (`heading_to_pickup`, `loading`, `in_transit`, `at_destination`).
- When a driver is offline or between trips, location telemetry is completely suspended.
