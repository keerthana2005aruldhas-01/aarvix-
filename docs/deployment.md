# AARVIX TRANSPORT — Deployment & Release Manual

## 1. Web Application Deployment
- **Hosting**: Firebase Hosting or Vercel / Cloudflare Pages.
- **Build Target**: Vite production bundle (`npm run build:web` outputs to `apps/web/dist`).
- **Domain & SSL**:
  - Configure Custom Domain `aarvix-logistics.in` or `aarvixtransport.com`.
  - Automated SSL via Let's Encrypt / Cloudflare Edge Certificates.
  - Setup canonical redirects (HTTP -> HTTPS and non-www -> www).
- **SEO & Indexing**:
  - Static `robots.txt` and dynamic `sitemap.xml` generated at build.
  - OpenGraph / Twitter cards for social sharing.
  - Google Search Console domain property verification via DNS TXT record.

## 2. Mobile App Deployment (Android & iOS)
- **Framework**: Expo Application Services (EAS Build).
- **Android APK & AAB**:
  - `eas build --platform android --profile preview` (generates testable APK).
  - `eas build --platform android --profile production` (generates signed Android App Bundle `.aab` for Google Play Console).
- **iOS IPA**:
  - Requires Apple Developer Program enrollment ($99/yr).
  - `eas build --platform ios --profile production` executed on EAS cloud builder or macOS with Xcode.
- **Store Listings**:
  - App Name: AARVIX Transport — Lorry Booking & Logistics.
  - Categories: Logistics, Business, Productivity.
