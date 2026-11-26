# AARVIX TRANSPORT — System Architecture

```mermaid
graph TD
    subgraph Client Apps
        Web[React + Vite Web App]
        Mobile[Expo React Native App]
    end

    subgraph Shared Monorepo Package
        Shared[@aarvix/shared: Types, Validation & Constants]
    end

    subgraph Backend Infrastructure
        FBAuth[Firebase Authentication]
        Firestore[Cloud Firestore DB]
        Functions[Cloud Functions Node.js/TS]
        Storage[Cloud Storage for POD & KYC]
    end

    subgraph External Gateways
        Maps[Routing & Geocoding Provider]
        SMS[OTP & Transactional SMS]
        Payment[Indian Payment Gateway - Razorpay/Cashfree]
    end

    Web --> Shared
    Mobile --> Shared
    Web --> FBAuth
    Web --> Firestore
    Mobile --> FBAuth
    Mobile --> Firestore
    Functions --> Firestore
    Functions --> Payment
    Functions --> SMS
    Functions --> Maps
```

## Key Architectural Principles
1. **Platform Segregation with Code Reusability**: UI components remain platform-idiomatic (Tailwind for Web; React Native StyleSheet for Mobile), while data models, validation rules, vehicle catalogs, and fare formulas reside in `@aarvix/shared`.
2. **Deterministic State Machine**: Trips follow strict validated status progressions (`draft` -> `estimate_ready` -> `confirmed` -> `searching_driver` -> `driver_assigned` -> `heading_to_pickup` -> `at_pickup` -> `loading` -> `in_transit` -> `at_destination` -> `delivered` -> `completed`).
3. **Atomic Assignment**: Prevents race conditions where multiple drivers attempt to accept a single consignment using Firestore transactions.
4. **Transparent Freight Pricing**: Distance matrices calculate base, per-km, loading labor, fuel surcharge, highway tolls, and 5% GST with reverse charge visibility.
