import React from 'react';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2">
        <Badge variant="forest">Legal Terms of Carriage</Badge>
        <h1 className="text-3xl font-black text-forest-950">Terms & Conditions</h1>
        <p className="text-xs text-neutral-500">Last updated: October 2026 • Compliant with Carriage by Road Act, 2007</p>
      </div>

      <Card variant="default" className="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">1. Operating Status as Goods Transport Agency (GTA)</h2>
          <p>
            AARVIX TRANSPORT operates as a certified Goods Transport Agency (GTA) providing consignment
            booking, fleet arrangement, tracking, and consignment note issuance under the Carriage
            by Road Act, 2007 and applicable GST rules.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">2. Shipper Consignment Declarations & Prohibited Goods</h2>
          <p>
            The shipper represents and warrants that all consignment descriptions, weight declarations,
            and cargo classifications provided during booking are accurate. Carriage of explosive,
            radioactive, illegal contraband, wildlife products, or uncertified hazardous chemical
            materials is strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">3. E-Way Bill & Statutory Tax Compliance</h2>
          <p>
            For any consignment valued in excess of statutory GST thresholds (INR 50,000 or state-specific
            mandates), the consignor is legally obligated to generate and provide a valid E-Way Bill
            prior to vehicle departure. Any penalty, seizure, or delay caused by defective or missing
            tax documentation shall be the sole responsibility of the shipper.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">4. Loading, Unloading & Detention Time Allowances</h2>
          <p>
            Standard freight rates include complimentary loading/unloading time allowances: 2 hours
            for LCV mini-trucks, 4 hours for intermediate trucks, and 6 hours for 32ft multi-axle
            containers. Detention exceeding these allowances is subject to standardized hourly retention
            charges as detailed in our tariff schedule.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">5. Proof of Delivery (POD) & Dispute Resolution</h2>
          <p>
            Handover of cargo is validated via consignee numeric OTP and photographic delivery proof.
            Any claim of shortage or physical package damage must be recorded on the digital POD at
            the time of receiving and reported within 24 hours to our operations desk.
          </p>
        </div>
      </Card>
    </div>
  );
};
