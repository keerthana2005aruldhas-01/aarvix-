import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Wrench,
  Navigation,
  ArrowRight,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  adminService,
  PendingVehicleRecord,
  DriverVerificationRecord,
  EmergencySosAlert,
  CustomerComplaintRecord,
} from '../services/adminService.js';
import { BookingRecord, BookingStatus } from '@aarvix/shared';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

type AdminTab = 'vehicles' | 'drivers' | 'bookings' | 'trips' | 'sos' | 'complaints';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('vehicles');
  const [vehicles, setVehicles] = useState<PendingVehicleRecord[]>([]);
  const [drivers, setDrivers] = useState<DriverVerificationRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [sosAlerts, setSosAlerts] = useState<EmergencySosAlert[]>([]);
  const [complaints, setComplaints] = useState<CustomerComplaintRecord[]>([]);
  const [selectedVehicleForApproval, setSelectedVehicleForApproval] = useState<PendingVehicleRecord | null>(null);
  const [selectedDriverForAssignment, setSelectedDriverForAssignment] = useState<string>('drv_01');
  const [rejectModalVehicle, setRejectModalVehicle] = useState<PendingVehicleRecord | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [notice, setNotice] = useState<string | null>(null);

  // Load data
  const loadData = () => {
    setVehicles(adminService.getVehicles());
    setDrivers(adminService.getDrivers());
    setBookings(adminService.getAllBookings());
    setSosAlerts(adminService.getSosAlerts());
    setComplaints(adminService.getComplaints());
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingVehiclesCount = vehicles.filter((v) => v.status === 'pending').length;
  const activeSosCount = sosAlerts.filter((s) => s.status === 'active').length;
  const inTransitCount = bookings.filter((b) => b.status === 'in_transit').length;

  // Handle Approve Vehicle
  const handleApproveVehicle = (vehicle: PendingVehicleRecord) => {
    const updated = adminService.approveVehicle(vehicle.id, selectedDriverForAssignment);
    setNotice(`Vehicle ${updated.regNumber} approved! Generated Vehicle ID: ${updated.assignedVehicleId}`);
    setSelectedVehicleForApproval(null);
    loadData();
    setTimeout(() => setNotice(null), 6000);
  };

  // Handle Reject Vehicle
  const handleRejectVehicle = () => {
    if (!rejectModalVehicle) return;
    adminService.rejectVehicle(rejectModalVehicle.id, rejectReason || 'Incomplete or expired documentation');
    setNotice(`Vehicle ${rejectModalVehicle.regNumber} rejected.`);
    setRejectModalVehicle(null);
    setRejectReason('');
    loadData();
    setTimeout(() => setNotice(null), 5000);
  };

  // Handle Driver Approval
  const handleApproveDriver = (driverId: string) => {
    adminService.approveDriver(driverId);
    setNotice(`Driver approved and added to active roster.`);
    loadData();
    setTimeout(() => setNotice(null), 5000);
  };

  // Handle Trip Status Progression
  const handleAdvanceTrip = (bookingNumber: string, nextStatus: BookingStatus) => {
    adminService.updateBookingStatus(bookingNumber, nextStatus);
    setNotice(`Trip ${bookingNumber} status updated to: ${nextStatus.toUpperCase()}`);
    loadData();
    setTimeout(() => setNotice(null), 5000);
  };

  // Handle SOS Assistance Dispatch
  const handleDispatchSos = (alertId: string, serviceType: string) => {
    adminService.dispatchSosAssistance(alertId, serviceType);
    setNotice(`Assistance (${serviceType}) dispatched to driver! Emergency team notified.`);
    loadData();
    setTimeout(() => setNotice(null), 5000);
  };

  // Handle SOS Resolve
  const handleResolveSos = (alertId: string) => {
    adminService.resolveSosAlert(alertId);
    setNotice(`Emergency incident marked resolved.`);
    loadData();
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="py-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans space-y-8">
      {/* Top Operations Header */}
      <div className="bg-forest-950 text-white rounded-3xl p-6 sm:p-8 border border-forest-800 shadow-elevated relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-forest-800 rounded-lg text-gold-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
                Central Operations Tower (2FA Verified)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AARVIX Company / Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Real-time management of fleet onboarding, RC & document audits, smart dispatch, active trip
              telematics, and emergency highway SOS responses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="border-forest-700 text-neutral-200 hover:bg-forest-900"
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-gold-400" />}
            >
              Refresh Feed
            </Button>
            <Link to="/book">
              <Button variant="secondary" size="sm">
                + Create Booking
              </Button>
            </Link>
          </div>
        </div>

        {/* Global KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-forest-800/80 text-xs">
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <span className="text-neutral-400 block text-[10px] uppercase">Registered Fleet</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{vehicles.length} Lorries</span>
          </div>
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <span className="text-neutral-400 block text-[10px] uppercase">Pending Approval</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">
              {pendingVehiclesCount} Requests
            </span>
          </div>
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <span className="text-neutral-400 block text-[10px] uppercase">Active In-Transit</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{inTransitCount} Trips</span>
          </div>
          <div className="bg-forest-900/60 p-3 rounded-xl border border-forest-800">
            <span className="text-neutral-400 block text-[10px] uppercase">Verified Drivers</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{drivers.length} Drivers</span>
          </div>
          <div
            className={`p-3 rounded-xl border ${
              activeSosCount > 0
                ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                : 'bg-forest-900/60 border-forest-800 text-neutral-400'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold">Highway SOS Alerts</span>
            <span
              className={`text-lg font-black mt-0.5 block ${
                activeSosCount > 0 ? 'text-rose-400 animate-pulse' : 'text-neutral-300'
              }`}
            >
              {activeSosCount} Active
            </span>
          </div>
        </div>
      </div>

      {/* Floating Notice Bar if any action performed */}
      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Flashing SOS Banner if active alert */}
      {activeSosCount > 0 && (
        <div
          onClick={() => setActiveTab('sos')}
          className="p-4 bg-rose-600 text-white rounded-2xl flex items-center justify-between cursor-pointer hover:bg-rose-700 transition-colors shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
            </span>
            <div>
              <span className="font-black text-sm uppercase tracking-wider block">
                EMERGENCY HIGHWAY SOS ACTIVE ({activeSosCount})
              </span>
              <p className="text-xs text-rose-100">
                Driver Ramesh K. (KA 01 AB 8829) reported Tyre Puncture on NH-44 near Krishnagiri Toll. Click to open dispatch desk.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold underline shrink-0">Open Emergency Desk &rarr;</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-warm-200">
        {[
          { id: 'vehicles', label: 'Pending Vehicle Approvals', badge: pendingVehiclesCount },
          { id: 'drivers', label: 'Driver Verification', badge: drivers.filter((d) => d.status === 'pending').length },
          { id: 'bookings', label: 'Bookings & Dispatch', badge: bookings.length },
          { id: 'trips', label: 'Live Telematics & Delays', badge: inTransitCount },
          { id: 'sos', label: 'Emergency SOS Control', badge: activeSosCount, alert: activeSosCount > 0 },
          { id: 'complaints', label: 'Complaints & Ledger', badge: complaints.length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-warm-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  tab.alert
                    ? 'bg-rose-500 text-white animate-pulse'
                    : activeTab === tab.id
                    ? 'bg-gold-500 text-forest-950'
                    : 'bg-warm-200 text-neutral-800'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: PENDING VEHICLE APPROVAL */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-forest-950">Lorry Owner Registrations & Document Audits</h2>
              <p className="text-xs text-neutral-500">
                Review submitted RC, insurance policy, fitness certificate, and commercial permits. Approving creates a unique Vehicle ID.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-warm-100 rounded-lg text-neutral-700">
              Showing {vehicles.length} Submitted Vehicles
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {vehicles.map((v) => (
              <Card
                key={v.id}
                variant="default"
                className={`p-6 transition-all ${
                  v.status === 'pending'
                    ? 'border-amber-300 bg-amber-50/20 shadow-sm'
                    : v.status === 'approved'
                    ? 'border-emerald-200 bg-white'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Vehicle Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-forest-950 font-mono">
                        {v.regNumber}
                      </span>
                      <Badge
                        variant={
                          v.status === 'approved' ? 'forest' : v.status === 'pending' ? 'gold' : 'neutral'
                        }
                      >
                        {v.status === 'approved'
                          ? `Approved (${v.assignedVehicleId})`
                          : v.status === 'pending'
                          ? 'Pending Vehicle Approval'
                          : 'Rejected'}
                      </Badge>
                    </div>

                    <div className="text-xs text-neutral-700 space-y-0.5">
                      <div>
                        <strong>Model:</strong> {v.vehicleType} • {v.tonnage} Tonne Payload
                      </div>
                      <div>
                        <strong>Owner / Transporter:</strong> {v.ownerName} ({v.ownerPhone}) • Submitted: {v.submissionDate}
                      </div>
                      {v.assignedDriverName && (
                        <div className="text-forest-800 font-semibold">
                          <strong>Assigned Driver:</strong> {v.assignedDriverName}
                        </div>
                      )}
                      {v.rejectionReason && (
                        <div className="text-rose-700">
                          <strong>Rejection Reason:</strong> {v.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Audit Checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 lg:py-0 border-y lg:border-y-0 border-warm-200">
                    <div className="p-2.5 bg-white rounded-xl border border-warm-200 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">1. RC Certificate</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {v.documents.rcNumber.slice(0, 11)}...
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-warm-200 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">2. Insurance</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid ({v.documents.insuranceExpiryDays}d left)
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-warm-200 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">3. Fitness (FC)</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {v.documents.fitnessValid ? 'Audited FC' : 'Expired'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-warm-200 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-bold block">4. Goods Permit</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> National All-India
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {v.status === 'pending' ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedVehicleForApproval(v)}
                          leftIcon={<Check className="w-4 h-4 text-gold-400" />}
                        >
                          Approve [A]
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-700 border-rose-300 hover:bg-rose-50"
                          onClick={() => setRejectModalVehicle(v)}
                          leftIcon={<X className="w-4 h-4" />}
                        >
                          Reject [R]
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-neutral-400">Audit Processed</span>
                    )}
                  </div>
                </div>

                {/* Inline Driver Assignment Drawer when approving */}
                {selectedVehicleForApproval?.id === v.id && (
                  <div className="mt-4 pt-4 border-t border-amber-300 bg-amber-50/60 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-forest-950 uppercase">
                        Assign Verified Driver to {v.regNumber}
                      </span>
                      <button onClick={() => setSelectedVehicleForApproval(null)} className="text-neutral-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <select
                        value={selectedDriverForAssignment}
                        onChange={(e) => setSelectedDriverForAssignment(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 bg-white border border-warm-300 rounded-lg text-xs font-semibold"
                      >
                        {drivers
                          .filter((d) => d.status === 'approved')
                          .map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.fullName} ({d.licenceType} • {d.experienceYears}y exp)
                            </option>
                          ))}
                      </select>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveVehicle(v)}
                        rightIcon={<CheckCircle2 className="w-4 h-4 text-gold-400" />}
                      >
                        Confirm Approval & Generate Vehicle ID
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Reject Reason Modal */}
          {rejectModalVehicle && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-elevated">
                <h3 className="font-bold text-base text-rose-950">
                  Reject Vehicle: {rejectModalVehicle.regNumber}
                </h3>
                <p className="text-xs text-neutral-600">
                  Provide audit grounds for rejecting this lorry registration. The owner will be notified.
                </p>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Insurance policy expired, or Fitness certificate not legible."
                  className="w-full p-3 border border-warm-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setRejectModalVehicle(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-rose-700 hover:bg-rose-800"
                    onClick={handleRejectVehicle}
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DRIVER VERIFICATION */}
      {activeTab === 'drivers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-forest-950">Commercial Driver Document Audits</h2>
              <p className="text-xs text-neutral-500">
                Heavy Goods Vehicle (HGV) commercial licence validation, Aadhaar KYC, and background status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {drivers.map((d) => (
              <Card key={d.id} variant="default" className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-forest-950">{d.fullName}</h3>
                      <span className="text-xs text-neutral-500">{d.phone}</span>
                    </div>
                    <Badge variant={d.status === 'approved' ? 'forest' : 'gold'}>
                      {d.status === 'approved' ? 'Audited & Active' : 'Pending Verification'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs py-3 border-y border-warm-200">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Licence No:</span>
                      <span className="font-mono font-bold text-neutral-900">{d.licenceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Grade:</span>
                      <span className="font-semibold text-forest-800">{d.licenceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Experience:</span>
                      <span className="font-semibold text-neutral-900">{d.experienceYears} Years</span>
                    </div>
                    {d.assignedVehicleReg && (
                      <div className="flex justify-between text-gold-700 font-bold">
                        <span>Assigned Lorry:</span>
                        <span>{d.assignedVehicleReg}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DL Verified via Sarathi Portal
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aadhaar 2-Factor Verified
                    </div>
                  </div>
                </div>

                {d.status === 'pending' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleApproveDriver(d.id)}
                    leftIcon={<Check className="w-4 h-4 text-gold-400" />}
                  >
                    Approve Driver Roster
                  </Button>
                ) : (
                  <div className="text-center text-[11px] text-neutral-400 font-semibold py-1">
                    Ready for Load Matching
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS & SMART DISPATCH */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-forest-950">Consignment Dispatch Queue</h2>
              <p className="text-xs text-neutral-500">
                Incoming customer orders. Match and assign available verified lorries and commercial drivers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <Card key={b.bookingNumber} variant="default" className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-forest-950 text-base font-mono">
                        {b.bookingNumber}
                      </span>
                      <Badge variant="forest">
                        {b.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs text-neutral-400">Created: {b.createdAt}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Route</span>
                        <strong className="text-neutral-900">{b.pickup.city} → {b.destination.city}</strong> ({b.fareBreakdown.distanceKm} km)
                        <p className="text-neutral-500 text-[11px]">{b.pickup.address} to {b.destination.address}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Cargo & Vehicle</span>
                        <span className="font-bold text-neutral-900">{b.goodsCategory} • {b.estimatedWeightKg.toLocaleString()} kg</span>
                        <p className="text-neutral-500 text-[11px]">Required: {b.vehicleSpec.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase">Spot Tariff</span>
                      <span className="text-lg font-extrabold text-forest-900">
                        ₹{b.fareBreakdown.totalFare.toLocaleString()}
                      </span>
                    </div>

                    {b.status === 'confirmed' || b.status === 'searching_driver' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          adminService.assignBooking(b.bookingNumber, 'drv_01', 'ARVX-V-1042');
                          setNotice(`Assigned verified driver Ramesh K. & lorry ARVX-V-1042 to ${b.bookingNumber}!`);
                          loadData();
                        }}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5 text-gold-400" />}
                      >
                        Smart Assign Lorry & Driver
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        Assigned to Driver: Ramesh K.
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE TELEMATICS & DELAY TRACKING */}
      {activeTab === 'trips' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-forest-950">Active Trip Telematics & Delay Tracking</h2>
              <p className="text-xs text-neutral-500">
                Milestone monitoring across Indian national highway corridors.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {bookings
              .filter((b) => ['driver_assigned', 'heading_to_pickup', 'loading', 'in_transit', 'at_destination', 'delivered', 'completed'].includes(b.status))
              .map((trip) => (
                <Card key={trip.bookingNumber} variant="default" className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-200">
                    <div>
                      <span className="text-xs text-gold-700 font-bold uppercase tracking-wider">
                        Active Consignment
                      </span>
                      <h3 className="text-base font-black text-forest-950">
                        {trip.bookingNumber} • {trip.pickup.city} to {trip.destination.city}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-forest-900 uppercase">
                        {trip.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Milestones Progress Bar */}
                  <div className="grid grid-cols-4 gap-2 text-xs py-2">
                    {[
                      { label: 'Assigned', active: true },
                      { label: 'Loading Cargo', active: ['loading', 'in_transit', 'at_destination', 'delivered', 'completed'].includes(trip.status) },
                      { label: 'In Transit (NH-44)', active: ['in_transit', 'at_destination', 'delivered', 'completed'].includes(trip.status) },
                      { label: 'Delivered (OTP Sign-off)', active: ['delivered', 'completed'].includes(trip.status) },
                    ].map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-center font-bold border ${
                          m.active
                            ? 'bg-forest-800 text-gold-400 border-forest-700'
                            : 'bg-warm-100 text-neutral-400 border-warm-200'
                        }`}
                      >
                        {m.label}
                      </div>
                    ))}
                  </div>

                  {/* Trip Details & Advance Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 text-xs">
                    <div className="text-neutral-600 space-y-0.5">
                      <div><strong>Driver:</strong> Ramesh Kumar (+91 98801 92834) • Lorry: KA 01 AB 8829</div>
                      <div><strong>Delivery Verification OTP:</strong> <code className="font-bold text-forest-900">{trip.deliveryOtp || '4819'}</code></div>
                    </div>

                    <div className="flex items-center gap-2">
                      {trip.status === 'in_transit' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdvanceTrip(trip.bookingNumber, 'at_destination')}
                        >
                          Arrived at Destination Bay
                        </Button>
                      )}
                      {trip.status === 'at_destination' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAdvanceTrip(trip.bookingNumber, 'completed')}
                        >
                          Verify Consignee OTP & Close Trip
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: EMERGENCY SOS CONTROL TOWER */}
      {activeTab === 'sos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Emergency Highway SOS Control Tower
              </h2>
              <p className="text-xs text-neutral-500">
                Breakdown, tyre puncture, and highway accident alerts transmitted by commercial drivers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sosAlerts.map((sos) => (
              <Card
                key={sos.id}
                variant="default"
                className={`p-6 border-2 ${
                  sos.status === 'active'
                    ? 'border-rose-500 bg-rose-50/30 shadow-elevated'
                    : 'border-warm-200 bg-white'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                        <Wrench className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="font-black text-base text-rose-950 uppercase">
                          {sos.type.replace('_', ' ')} • {sos.id}
                        </h3>
                        <span className="text-xs text-neutral-500">Reported at {sos.timestamp}</span>
                      </div>
                      <Badge variant={sos.status === 'active' ? 'danger' : 'forest'}>
                        {sos.status === 'active' ? 'ACTION REQUIRED' : 'ASSISTANCE DISPATCHED'}
                      </Badge>
                    </div>

                    <div className="text-xs text-neutral-700 space-y-1 pt-1">
                      <div>
                        <strong>Driver:</strong> {sos.driverName} ({sos.driverPhone}) • <strong>Lorry:</strong> {sos.vehicleReg}
                      </div>
                      <div>
                        <strong>Trip Reference:</strong> {sos.bookingNumber}
                      </div>
                      <div className="text-rose-900 font-semibold flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-rose-600" />
                        <span><strong>Corridor Location:</strong> {sos.locationDesc} ({sos.coordinates.lat}° N, {sos.coordinates.lng}° E)</span>
                      </div>
                    </div>
                  </div>

                  {/* Coordination Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <a href={`tel:${sos.driverPhone.replace(/\D/g, '')}`}>
                      <Button variant="outline" size="sm" className="w-full" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                        Call Driver
                      </Button>
                    </a>
                    {sos.status === 'active' ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDispatchSos(sos.id, 'Mobile Puncture Van (Krishnagiri)')}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Dispatch Mechanic Van
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDispatchSos(sos.id, 'Heavy Towing Recovery')}
                          className="border-rose-400 text-rose-800 hover:bg-rose-50"
                        >
                          Dispatch Towing Crane
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleResolveSos(sos.id)}
                        className="bg-emerald-700 hover:bg-emerald-800"
                      >
                        Mark Incident Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMPLAINTS & LEDGER */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-forest-950">Customer Complaints & Settlement Ledger</h2>
              <p className="text-xs text-neutral-500">
                Transit delay disputes, consignor claims, and refund ledger.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {complaints.map((c) => (
              <Card key={c.id} variant="default" className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-forest-950">{c.id}</span>
                      <Badge variant={c.status === 'resolved' ? 'forest' : 'gold'}>
                        {c.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-neutral-400">Order: {c.bookingNumber}</span>
                    </div>
                    <p className="text-xs text-neutral-700">{c.description}</p>
                    <span className="text-[11px] text-neutral-500 block">
                      Customer: {c.customerName} ({c.customerPhone}) • Logged: {c.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {c.refundAmount && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                        Refund Settled: ₹{c.refundAmount}
                      </span>
                    )}
                    {c.status !== 'resolved' && (
                      <Button variant="outline" size="sm" onClick={() => adminService.resolveComplaint(c.id)}>
                        Resolve Complaint
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
