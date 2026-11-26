import React from 'react';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

export const CancellationRefundPage: React.FC = () => {
  return (
    <div className="py-12 space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2">
        <Badge variant="gold">Fair Commercial Terms</Badge>
        <h1 className="text-3xl font-black text-forest-950">Cancellation & Refund Policy</h1>
        <p className="text-xs text-neutral-500">Transparent cancellation schedules and refund turnaround SLAs</p>
      </div>

      <Card variant="default" className="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">1. Cancellation by Consignor / Customer</h2>
          <p>
            - <strong>Before Driver Assignment:</strong> 100% full refund with zero deduction.
            <br />
            - <strong>After Assignment but Before En-Route:</strong> Free cancellation up to 30 minutes from booking.
            <br />
            - <strong>After Lorry Arrival at Loading Dock (Dry Run):</strong> Standardized dry-run reimbursement fee (₹500 for mini-trucks; ₹1,500 for intermediate trucks; ₹3,000 for heavy trailers) to compensate the driver for fuel and transit expenses.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">2. Cancellation by Transporter or Driver</h2>
          <p>
            If an assigned transporter or driver cancels an accepted booking due to unexpected mechanical
            failure, our automated dispatch system immediately reallocates an eligible replacement
            vehicle within 45 minutes at no extra charge. If no alternative vehicle is accepted by the
            shipper, a 100% full refund is issued instantly.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">3. Refund Processing Timelines</h2>
          <p>
            All approved refunds are credited back to the original source payment instrument (UPI,
            net-banking, corporate credit card) within 3 to 5 banking business days through our
            audited payment gateway integration.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-forest-950 mb-2">4. Disputed Consignments & Claims</h2>
          <p>
            In the event of a damaged consignment claim, the dedicated dispute mediation desk reviews
            loading photographs against the digital POD timestamp before finalizing any settlement
            deductions.
          </p>
        </div>
      </Card>
    </div>
  );
};
