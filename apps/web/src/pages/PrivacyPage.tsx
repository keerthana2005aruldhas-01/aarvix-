import React from 'react';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2">
        <Badge variant="forest">Information Security</Badge>
        <h1 className="text-3xl font-black text-forest-950">Privacy Policy</h1>
        <p className="text-xs text-neutral-500">Last updated: October 2026 • Compliant with Digital Personal Data Protection (DPDP) Act</p>
      </div>

      <Card variant="default" className="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">1. Data We Collect</h2>
          <p>
            We collect personal identification and business information necessary to execute transport
            services: Contact numbers, registered company names, warehouse pickup/delivery addresses,
            GSTIN, driver commercial driving licence numbers, and vehicle registration documents (RC).
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">2. GPS Location & Telematics Usage</h2>
          <p>
            Location data from driver mobile devices or vehicle telematics units is collected strictly
            during active operational assignments (from when the driver marks &quot;Heading to Pickup&quot; until
            final &quot;Delivered&quot; confirmation). Location tracking is never executed during off-duty or
            personal periods.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">3. Storage & Document Isolation</h2>
          <p>
            Sensitive documents, including driver identity proofs and vehicle fitness certificates,
            are held in encrypted Cloud Storage with role-restricted access. Customer financial credentials
            (bank account details or card numbers) are processed exclusively by PCI-DSS certified payment
            gateways and are never stored on AARVIX application servers.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">4. Data Sharing with Law Enforcement & Tax Authorities</h2>
          <p>
            Consignment waybills, e-way bill records, and transport manifests are maintained for statutory
            taxation and transit inspection periods in accordance with Indian GST and transport laws.
          </p>
        </div>
      </Card>
    </div>
  );
};
