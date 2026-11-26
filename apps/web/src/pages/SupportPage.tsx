import React, { useState } from 'react';
import { Phone, AlertTriangle, CheckCircle2, MessageSquare, LifeBuoy } from 'lucide-react';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { BRAND } from '@aarvix/shared';

export const SupportPage: React.FC = () => {
  const [ticketCategory, setTicketCategory] = useState('transit_delay');
  const [bookingNumber, setBookingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !phone.trim()) return;
    setSubmittedId(`ARVX-ESC-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="py-12 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="gold">Operations Escalation & Support Desk</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
          How Can Our Dispatch Operations Help You?
        </h1>
        <p className="text-sm text-neutral-600">
          Direct priority resolution for shippers, fleet managers, and highway drivers.
        </p>
      </div>

      {/* Emergency Highway SOS Banner */}
      <div className="bg-gradient-to-r from-forest-950 to-forest-900 border-2 border-gold-500/50 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-elevated">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-rose-600/30 text-rose-300 rounded-2xl border border-rose-500/40 shrink-0">
            <AlertTriangle className="w-8 h-8 text-gold-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              Highway Breakdown, Puncture or Accident SOS?
            </h3>
            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              If an active consignment faces mechanical immobilisation, emergency tire puncture, or highway
              hazard, call our immediate response dispatcher for rapid breakdown support.
            </p>
          </div>
        </div>
        <a
          href="tel:1800227849"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-neutral-900 font-extrabold text-sm shadow-md transition-all"
        >
          <Phone className="w-4 h-4" />
          Call SOS: {BRAND.supportPhone}
        </a>
      </div>

      {/* Support Ticket Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Card variant="default">
            <h2 className="text-base font-bold text-forest-950 mb-4 pb-3 border-b border-warm-200 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-forest-800" />
              Open Operations Support Ticket
            </h2>

            {submittedId ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950">
                  Escalation Logged Successfully
                </h3>
                <p className="text-xs text-emerald-800">
                  Reference: <strong>{submittedId}</strong>. A shift supervisor has been alerted and will
                  contact you on <strong>+91 {phone}</strong> within 15 minutes.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmittedId(null);
                    setDescription('');
                    setBookingNumber('');
                  }}
                  className="mt-2"
                >
                  Log Another Issue
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Select Issue Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-warm-300 rounded-lg text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="transit_delay">Transit Delay / Telematics Update</option>
                    <option value="billing_invoice">Billing, GST Invoice or Fare Dispute</option>
                    <option value="driver_vehicle">Driver Assistance or Vehicle RC Verification</option>
                    <option value="pod_issue">Proof of Delivery (POD) / OTP Handover Issue</option>
                    <option value="damage_shortage">Cargo Damage or Shortage Claim</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Booking / Consignment Number (Optional)"
                    placeholder="e.g. ARVX-2026-8921"
                    value={bookingNumber}
                    onChange={(e) => setBookingNumber(e.target.value)}
                  />
                  <Input
                    label="Contact Mobile Number"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Description of Issue
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your current concern or warehouse delay..."
                    className="w-full px-3.5 py-2.5 bg-white border border-warm-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                    required
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Submit Escalation Ticket
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="bordered" className="bg-warm-100">
            <h3 className="font-bold text-sm text-forest-950 mb-2 flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-forest-800" />
              SLA Resolution Targets
            </h3>
            <ul className="text-xs text-neutral-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                <span><strong>Highway SOS / Breakdown:</strong> Immediate response &lt; 5 mins</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                <span><strong>Active Transit Inquiries:</strong> Response within 15 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                <span><strong>Billing & GST Invoices:</strong> Resolution within 4 business hours</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                <span><strong>Dispute & Damage Claims:</strong> Inspection closed in 24 hours</span>
              </li>
            </ul>
          </Card>

          <Card variant="default">
            <h3 className="font-bold text-sm text-forest-950 mb-1">Direct Operational Email</h3>
            <p className="text-xs text-neutral-600 mb-3">
              For corporate contractual correspondence or audited billing reconciliations:
            </p>
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="text-xs font-bold text-forest-800 hover:underline block"
            >
              {BRAND.supportEmail}
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};
