# AARVIX TRANSPORT — Product Requirements Document (PRD)

## 1. Executive Overview
AARVIX TRANSPORT is a high-reliability pan-India digital logistics, lorry booking, and fleet management platform connecting Shippers (SMEs, industrial enterprises, and retail consignors) with verified Transporters and independent commercial Drivers.

## 2. Core Stakeholders
1. **Shippers / Customers**:
   - Instant lorry booking and spot quote calculation.
   - Transparent, itemized pricing (Base fare, per-km rate, loading labor, toll estimates, GST).
   - Real-time digital tracking, milestone alerts, and verified proof of delivery (POD).
   - Corporate credit, GST invoicing, and trip history.

2. **Commercial Drivers**:
   - Mobile-first operating cockpit.
   - Turn-by-turn routing navigation links and clear pickup/delivery warehouse coordinates.
   - Secure digital POD capture (consignee OTP verification and camera sign-off).
   - Fast settlement tracking, trip expenses, and emergency SOS assistance.

3. **Transporters & Fleet Owners**:
   - Fleet inventory management (RC, National Permits, Fitness Certificates, Insurance).
   - Driver assignment to vehicles and trips.
   - Operating efficiency metrics, earnings reports, and vehicle maintenance status.

4. **Operations & Admin Personnel**:
   - Live pan-India operations control tower.
   - Document KYC approval workflows for drivers and transport firms.
   - Trip dispute mediation, SOS emergency dispatch, and pricing configuration.

## 3. Scope of Phases 1 to 4 (Current Foundation)
- Monorepo structure configured with npm workspaces (`@aarvix/shared`, `@aarvix/web`, `@aarvix/mobile`).
- Shared domain contracts, validation schemas (Zod), and vehicle catalog.
- High-end brand design system implementing Forest Green (`#0B3B24`), Restrained Gold (`#C59B27`), and Warm Neutral styling.
- 14 responsive public website pages.
- Matching mobile preview experience running on React Native / Expo.
- Zero simulated or fake payments/live GPS claims — honest platform statuses.
