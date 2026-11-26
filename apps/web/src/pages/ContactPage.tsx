import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageBackdrop } from '../components/ui/PageBackdrop.js';
import {
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  MapPin,
} from 'lucide-react';
import { BRAND, contactFormSchema } from '@aarvix/shared';
import { Input } from '../components/ui/Input.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactPage: React.FC = () => {
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      serviceInterest: 'ftl',
      message: '',
    },
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Existing ticket dispatch functionality
    await new Promise((res) => setTimeout(res, 800));
    const ticketId = `ARVX-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket(ticketId);
    reset();
  };

  return (
    <PageBackdrop>
      <div className="py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CONTACT HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="forest">
            24x7 Pan-India Dispatch Operations
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight">
            Connect With AARVIX Logistics Desk
          </h1>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Need an enterprise RFP quotation, scheduled fleet assignment, or
            emergency highway transit assistance? Our dispatch engineers are
            active 24x7.
          </p>
        </div>

        {/* CONTACT INFORMATION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* LOCATION */}
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-forest-50 flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-bold text-forest-950 text-sm">Location</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Outer Ring Road, Bellandur,
              <br />
              Bengaluru 560103
            </p>
          </div>

          {/* CONTACT */}
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-forest-50 flex items-center justify-center mx-auto">
              <Phone className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-bold text-forest-950 text-sm">Contact</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {BRAND.supportPhone}
              <br />
              24/7 Emergency Helpline
            </p>
          </div>

          {/* EMAIL */}
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-forest-50 flex items-center justify-center mx-auto">
              <Mail className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-bold text-forest-950 text-sm">Email</h3>
            <p className="text-xs text-neutral-500 leading-relaxed break-all">
              {BRAND.supportEmail}
              <br />
              Operations & RFP Inquiries
            </p>
          </div>

          {/* WORKING HOURS */}
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-6 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-forest-50 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-bold text-forest-950 text-sm">Visit Between</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              24 Hours a Day
              <br />
              365 Days a Year
            </p>
          </div>

        </div>

        {/* CONTACT FORM + LORRY IMAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* LEFT: EXISTING CONTACT FORM */}
          <div>
            <Card variant="default">
              <h2 className="text-lg font-bold text-forest-950 mb-4 pb-3 border-b border-warm-200">
                Submit Consignment Inquiry
              </h2>

              {submittedTicket ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />

                  <h3 className="text-base font-bold text-emerald-950">
                    Inquiry Dispatched to Regional Control Tower
                  </h3>

                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Your ticket reference is <strong>{submittedTicket}</strong>.
                    An AARVIX freight operations specialist will review your
                    lane parameters and contact you within 30 minutes.
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmittedTicket(null)}
                    className="mt-2"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter your name"
                      {...register('fullName')}
                      error={errors.fullName?.message}
                      required
                    />

                    <Input
                      label="Company / Enterprise Name"
                      placeholder="Optional company name"
                      {...register('companyName')}
                      error={errors.companyName?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@company.com"
                      {...register('email')}
                      error={errors.email?.message}
                      required
                    />

                    <Input
                      label="10-Digit Mobile Number"
                      placeholder="e.g. 9876543210"
                      {...register('phone')}
                      error={errors.phone?.message}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Service Interest
                    </label>

                    <select
                      {...register('serviceInterest')}
                      className="w-full px-3.5 py-2.5 bg-white border border-warm-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 font-medium"
                    >
                      <option value="ftl">Full Truck Load (FTL)</option>
                      <option value="ptl">Part Truck Load (PTL)</option>
                      <option value="dedicated">Dedicated Contract Fleet</option>
                      <option value="container">32ft Container Long-Haul</option>
                      <option value="odc">Over-Dimensional Cargo (ODC)</option>
                      <option value="transporter">Fleet Owner Onboarding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Consignment Route, Volume & Timeline Details
                    </label>

                    <textarea
                      rows={4}
                      placeholder="Provide origin, destination, cargo weight, and required dispatch schedule..."
                      {...register('message')}
                      className="w-full px-3.5 py-2.5 bg-white border border-warm-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600"
                    />

                    {errors.message && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4 text-gold-400" />}
                  >
                    Send Inquiry to Operations
                  </Button>

                </form>
              )}
            </Card>
          </div>

          {/* RIGHT: LORRY IMAGE */}
          <div className="min-h-[400px] lg:min-h-full">
            <img
              src="/images/contact-lorry (2).jpeg"
              alt="AARVIX Logistics cargo truck"
              className="block w-full h-full min-h-[400px] object-cover rounded-2xl shadow-elevated"
            />
          </div>
        </div>

        {/* REGIONAL OPERATIONS HUBS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-forest-950">
            Regional Operations Hubs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-white p-5 rounded-xl border border-warm-200">
              <div className="font-bold text-neutral-900 flex items-center gap-2 mb-2 text-sm">
                <Building2 className="w-4 h-4 text-forest-800" />
                Bengaluru Hub (HQ)
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Outer Ring Road, Bellandur, Bengaluru 560103
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-warm-200">
              <div className="font-bold text-neutral-900 flex items-center gap-2 mb-2 text-sm">
                <Building2 className="w-4 h-4 text-forest-800" />
                Mumbai Logistics Hub
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                JNPT Port Corridor, Navi Mumbai 400707
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-warm-200">
              <div className="font-bold text-neutral-900 flex items-center gap-2 mb-2 text-sm">
                <Building2 className="w-4 h-4 text-forest-800" />
                Delhi NCR Hub
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                NH-48 Industrial Corridor, Bilaspur, Gurugram 122413
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-warm-200">
              <div className="font-bold text-neutral-900 flex items-center gap-2 mb-2 text-sm">
                <Building2 className="w-4 h-4 text-forest-800" />
                Chennai Freight Terminal
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Sriperumbudur Industrial Corridor, Chennai 602105
              </p>
            </div>

          </div>
        </div>

      </div>
    </PageBackdrop>
  );
};