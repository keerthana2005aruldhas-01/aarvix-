import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, Building2, Users, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  transporterRegistrationSchema,
  driverRegistrationSchema,
  phoneSchema,
} from '@aarvix/shared';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

type TransporterData = z.infer<typeof transporterRegistrationSchema>;
type DriverData = z.infer<typeof driverRegistrationSchema>;

const customerSchema = z.object({
  fullName: z.string().min(3, 'Name is required'),
  phone: phoneSchema,
  companyName: z.string().min(2, 'Company or trade name required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  gstin: z.string().optional(),
});

type CustomerData = z.infer<typeof customerSchema>;

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';
  const [role, setRole] = useState<'customer' | 'transporter' | 'driver'>(
    initialRole as 'customer' | 'transporter' | 'driver'
  );
  const [registeredSuccess, setRegisteredSuccess] = useState<string | null>(null);

  // Forms
  const customerForm = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
  });

  const transporterForm = useForm<TransporterData>({
    resolver: zodResolver(transporterRegistrationSchema),
  });

  const driverForm = useForm<DriverData>({
    resolver: zodResolver(driverRegistrationSchema),
  });

  const handleCustomerSubmit = async (_data: CustomerData) => {
    await new Promise((res) => setTimeout(res, 600));
    setRegisteredSuccess(`ARVX-CUST-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const handleTransporterSubmit = async (_data: TransporterData) => {
    await new Promise((res) => setTimeout(res, 600));
    setRegisteredSuccess(`ARVX-FLEET-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const handleDriverSubmit = async (_data: DriverData) => {
    await new Promise((res) => setTimeout(res, 600));
    setRegisteredSuccess(`ARVX-DRV-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="gold">Join the Verified Network</Badge>
        <h1 className="text-3xl font-black text-forest-950">AARVIX Registration Portal</h1>
        <p className="text-xs text-neutral-600">
          Create your verified profile as a Shipper, Fleet Owner, or Commercial Driver Partner.
        </p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-warm-200/80 rounded-2xl border border-warm-300">
        {[
          { id: 'customer', label: 'Shipper / Business', icon: Building2 },
          { id: 'transporter', label: 'Fleet Owner', icon: Truck },
          { id: 'driver', label: 'Driver Partner', icon: Users },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setRole(item.id as 'customer' | 'transporter' | 'driver');
              setRegisteredSuccess(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold transition-all ${
              role === item.id
                ? 'bg-forest-800 text-white shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <Card variant="default" className="p-6 sm:p-8 shadow-elevated">
        {registeredSuccess ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-emerald-950">
              Registration Application Submitted!
            </h2>
            <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
              Your account reference ID is <strong>{registeredSuccess}</strong>. Our compliance audit
              team will verify your credentials and send a login PIN via SMS.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Link to="/login">
                <Button variant="primary" size="md">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Customer / Shipper Form */}
            {role === 'customer' && (
              <form
                onSubmit={customerForm.handleSubmit(handleCustomerSubmit)}
                className="space-y-4"
              >
                <div className="pb-2 border-b border-warm-200">
                  <h3 className="font-bold text-sm text-forest-950">Business / Consignor Details</h3>
                  <p className="text-[11px] text-neutral-500">
                    Register to calculate instant freight, schedule full truck loads, and track dispatches.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Contact person name"
                    {...customerForm.register('fullName')}
                    error={customerForm.formState.errors.fullName?.message}
                    required
                  />
                  <Input
                    label="Mobile Number (for OTP)"
                    placeholder="10-digit number"
                    {...customerForm.register('phone')}
                    error={customerForm.formState.errors.phone?.message}
                    required
                  />
                </div>

                <Input
                  label="Company / Enterprise Name"
                  placeholder="e.g. Acme Industrial Corp Pvt Ltd"
                  {...customerForm.register('companyName')}
                  error={customerForm.formState.errors.companyName?.message}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="e.g. Bengaluru"
                    {...customerForm.register('city')}
                    error={customerForm.formState.errors.city?.message}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="e.g. Karnataka"
                    {...customerForm.register('state')}
                    error={customerForm.formState.errors.state?.message}
                    required
                  />
                </div>

                <Input
                  label="GSTIN (Optional for unregistered MSMEs)"
                  placeholder="22AAAAA0000A1Z5"
                  {...customerForm.register('gstin')}
                  error={customerForm.formState.errors.gstin?.message}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  isLoading={customerForm.formState.isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4 text-gold-400" />}
                >
                  Create Shipper Account
                </Button>
              </form>
            )}

            {/* Transporter / Fleet Owner Form */}
            {role === 'transporter' && (
              <form
                onSubmit={transporterForm.handleSubmit(handleTransporterSubmit)}
                className="space-y-4"
              >
                <div className="pb-2 border-b border-warm-200">
                  <h3 className="font-bold text-sm text-forest-950">Transport Company Onboarding</h3>
                  <p className="text-[11px] text-neutral-500">
                    Connect your fleet to corporate shippers and eliminate empty return trips.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Transport Company Name"
                    placeholder="e.g. Balaji Roadways"
                    {...transporterForm.register('companyName')}
                    error={transporterForm.formState.errors.companyName?.message}
                    required
                  />
                  <Input
                    label="Contact Person"
                    placeholder="Fleet manager name"
                    {...transporterForm.register('contactPerson')}
                    error={transporterForm.formState.errors.contactPerson?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Contact Mobile"
                    placeholder="10-digit number"
                    {...transporterForm.register('phone')}
                    error={transporterForm.formState.errors.phone?.message}
                    required
                  />
                  <Input
                    label="Business Email"
                    type="email"
                    placeholder="fleet@company.com"
                    {...transporterForm.register('email')}
                    error={transporterForm.formState.errors.email?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Operating City"
                    placeholder="Hub city"
                    {...transporterForm.register('city')}
                    error={transporterForm.formState.errors.city?.message}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="Base state"
                    {...transporterForm.register('state')}
                    error={transporterForm.formState.errors.state?.message}
                    required
                  />
                  <Input
                    label="Total Fleet Size"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    {...transporterForm.register('fleetSize', { valueAsNumber: true })}
                    error={transporterForm.formState.errors.fleetSize?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business PAN Number"
                    placeholder="ABCDE1234F"
                    {...transporterForm.register('panNumber')}
                    error={transporterForm.formState.errors.panNumber?.message}
                    required
                  />
                  <Input
                    label="Company GSTIN (If Registered)"
                    placeholder="22AAAAA0000A1Z5"
                    {...transporterForm.register('gstin')}
                    error={transporterForm.formState.errors.gstin?.message}
                  />
                </div>

                <div className="p-3 bg-warm-100 rounded-xl text-xs text-neutral-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest-800 shrink-0 mt-0.5" />
                  <span>
                    Individual truck RC books and driver documents will be uploaded after portal setup.
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  isLoading={transporterForm.formState.isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4 text-gold-400" />}
                >
                  Submit Fleet Application
                </Button>
              </form>
            )}

            {/* Commercial Driver Partner Form */}
            {role === 'driver' && (
              <form onSubmit={driverForm.handleSubmit(handleDriverSubmit)} className="space-y-4">
                <div className="pb-2 border-b border-warm-200">
                  <h3 className="font-bold text-sm text-forest-950">Commercial Driver Enrollment</h3>
                  <p className="text-[11px] text-neutral-500">
                    Drive with respect and guaranteed weekly payouts on audited routes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name (as per DL)"
                    placeholder="Driver full name"
                    {...driverForm.register('fullName')}
                    error={driverForm.formState.errors.fullName?.message}
                    required
                  />
                  <Input
                    label="Mobile Number"
                    placeholder="10-digit number"
                    {...driverForm.register('phone')}
                    error={driverForm.formState.errors.phone?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Commercial Driving Licence No."
                    placeholder="e.g. KA0120150001234"
                    {...driverForm.register('licenceNumber')}
                    error={driverForm.formState.errors.licenceNumber?.message}
                    required
                  />
                  <Input
                    label="Commercial Driving Experience (Years)"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    {...driverForm.register('experienceYears', { valueAsNumber: true })}
                    error={driverForm.formState.errors.experienceYears?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Base City"
                    placeholder="e.g. Bengaluru"
                    {...driverForm.register('city')}
                    error={driverForm.formState.errors.city?.message}
                    required
                  />
                  <Input
                    label="Base State"
                    placeholder="e.g. Karnataka"
                    {...driverForm.register('state')}
                    error={driverForm.formState.errors.state?.message}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  isLoading={driverForm.formState.isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4 text-gold-400" />}
                >
                  Submit Driver Registration
                </Button>
              </form>
            )}
          </>
        )}
      </Card>
    </div>
  );
};
