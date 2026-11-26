# AARVIX TRANSPORT — Testing Strategy

## 1. Multi-Tier Testing Pyramid
- **Unit Testing**:
  - Distance computation algorithms (Haversine + Indian circuit multiplier).
  - Deterministic fare calculation matrix (Base, km rates, helpers, GST).
  - State machine transition guards (invalid transitions throw errors).
- **Schema Validation**:
  - Zod schemas validating phone numbers, PAN, GSTIN, PIN codes, and consignment weights.
- **Component & Integration Testing**:
  - React Web: Responsive layout rendering, form input error states, interactive vehicle filters.
  - React Native Mobile: Touch target accessibility, safe area insets, cross-platform web/android rendering.
- **Security Rule Emulation**:
  - Firebase Emulator Suite test suite verifying unauthenticated users cannot read private consignments.

## 2. Verification Protocol for Each Phase
1. `npm run typecheck` across all workspaces.
2. `npm run build` validating production bundling without syntax or module resolution errors.
3. Interactive visual verification of responsive web breakpoints (Desktop 1440px, Tablet 768px, Mobile 375px).
