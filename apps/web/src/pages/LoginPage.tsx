import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Card } from '../components/ui/Card.js';
import { UserRole } from '@aarvix/shared';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('customer');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Enter the 4-digit verification code');
      return;
    }
    setError(null);
    setAuthSuccess(true);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      <Card variant="default" className="p-8 shadow-elevated">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-forest-800 text-gold-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-forest-700">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-forest-950">AARVIX Secure Sign In</h1>
          <p className="text-xs text-neutral-500">
            Access your consignments, assigned vehicles, or fleet operations
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            Select Your Account Persona:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-warm-100 rounded-xl border border-warm-200">
            {[
              { id: 'customer', label: 'Shipper' },
              { id: 'transporter', label: 'Fleet' },
              { id: 'driver', label: 'Driver' },
              { id: 'admin', label: 'Admin' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id as UserRole);
                  setAuthSuccess(false);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === r.id
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Development Notice */}
        <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Phase 4 Interactive Preview:</strong> Real Firebase Auth OTP integration hooks
            will be activated in Phase 5. You can test with any 10-digit number and code <strong>1234</strong>.
          </span>
        </div>

        {authSuccess ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950">
              Authenticated as {role.toUpperCase()}
            </h3>
            <p className="text-xs text-emerald-800">
              Welcome to the AARVIX Transport Platform. In Phase 5, this routes directly into your
              dedicated role workspace.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              {role === 'admin' ? (
                <Link to="/admin">
                  <Button variant="primary" size="sm" className="w-full">
                    Enter Company / Admin Control Center
                  </Button>
                </Link>
              ) : role === 'customer' ? (
                <Link to="/book">
                  <Button variant="primary" size="sm" className="w-full">
                    Go to Booking Wizard
                  </Button>
                </Link>
              ) : (
                <Link to="/admin">
                  <Button variant="primary" size="sm" className="w-full">
                    View Fleet & Dispatch Operations
                  </Button>
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setAuthSuccess(false);
                  setOtpSent(false);
                  setPhone('');
                  setOtp('');
                }}
                className="text-xs text-neutral-500 hover:underline"
              >
                Sign In with another persona
              </button>
            </div>
          </div>
        ) : !otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="Registered 10-Digit Mobile Number"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              leftIcon={<Phone className="w-4 h-4 text-forest-800" />}
              error={error || undefined}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4 text-gold-400" />}
            >
              Get Secure OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center pb-2">
              <span className="text-xs text-neutral-500">
                OTP sent to <strong className="text-neutral-800">+91 {phone}</strong>
              </span>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-xs text-forest-800 font-semibold block mx-auto mt-0.5 hover:underline"
              >
                Change Number
              </button>
            </div>

            <Input
              label="Enter 4-Digit OTP"
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              error={error || undefined}
              autoFocus
              required
            />

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full font-bold"
              rightIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Verify & Enter Portal
            </Button>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-warm-200 text-center text-xs text-neutral-500">
          New to AARVIX?{' '}
          <Link to="/register" className="font-bold text-forest-800 hover:underline">
            Register as Shipper or Fleet Owner
          </Link>
        </div>
      </Card>
    </div>
  );
};
