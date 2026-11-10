/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Copy,
  Clock,
  Search,
  RefreshCw,
  Mail,
  ShieldCheck,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { ServiceItem } from './ServicesSection';
import { validateOrderInput, isValidEmail, isValidPhone } from '../utils/orderValidation';
import { OFFICIAL_BUSINESS_EMAIL } from '../utils/emailTemplate';

interface OrderSectionProps {
  services: ServiceItem[];
  preSelectedServiceId?: string;
  onClearPreSelected?: () => void;
}

interface OrderSuccessData {
  orderId: string;
  createdAt: string;
  fullName: string;
  serviceTitle: string;
  projectTitle: string;
  status: string;
  emailNotificationStatus: string;
  emailNotificationDetails?: string;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  services,
  preSelectedServiceId,
  onClearPreSelected,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'track'>('create');

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(preSelectedServiceId || 'web-development');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('₹50,000 - ₹1,00,000');
  const [preferredRequirements, setPreferredRequirements] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<OrderSuccessData | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Tracking state
  const [trackRef, setTrackRef] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Sync pre-selected service when user clicked "Order Now" on a service card
  useEffect(() => {
    if (preSelectedServiceId) {
      setServiceId(preSelectedServiceId);
      setActiveTab('create');
    }
  }, [preSelectedServiceId]);

  const budgetOptions = [
    '< ₹25,000',
    '₹25,000 - ₹50,000',
    '₹50,000 - ₹1,00,000',
    '₹1,00,000 - ₹2,50,000',
    '₹2,50,000 - ₹5,00,000',
    '₹5,00,000+',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate using pure logic validator
    const validation = validateOrderInput({
      fullName,
      email,
      phone,
      serviceId,
      projectTitle,
      projectDescription,
      budgetRange,
      preferredRequirements,
      additionalMessage,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.sanitized),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit order. Please try again.');
      }

      setSuccessOrder(data.order);
      // Reset form fields
      setFullName('');
      setEmail('');
      setPhone('');
      setProjectTitle('');
      setProjectDescription('');
      setPreferredRequirements('');
      setAdditionalMessage('');
      if (onClearPreSelected) onClearPreSelected();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setSubmitError(err.message || 'An error occurred while transmitting your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) return;

    setIsTracking(true);
    setTrackError(null);
    setTrackedOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(trackRef.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching order reference found.');
      }
      setTrackedOrder(data.order);
    } catch (err: any) {
      setTrackError(err.message || 'Unable to find order reference.');
    } finally {
      setIsTracking(false);
    }
  };

  const handleCopyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <section id="order" className="relative py-28 bg-[#05070B] border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wider uppercase mb-3">
            <span>Customer Ordering System</span>
            <span aria-hidden="true">·</span>
            <span>Direct Submission</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Place an <span className="text-[#00E5FF]">Order</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Order your software, web, mobile, or AI solution directly with WGP Developer's. All orders generate a unique tracking reference and are forwarded to our official executive inbox.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="p-1 bg-[#0B0F19] rounded-xl border border-slate-800 inline-flex">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('create');
                  setSuccessOrder(null);
                }}
                className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-[#0066FF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Place New Order
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'track'
                    ? 'bg-[#0066FF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Track Existing Order
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Create Order */}
        {activeTab === 'create' && (
          <>
            {successOrder ? (
              /* Success Confirmation Card */
              <div className="glass-panel rounded-2xl p-8 sm:p-12 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,102,255,0.2)] animate-fade-in">
                <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[#00E5FF] mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Order Submitted Successfully!
                  </h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Thank you, <strong>{successOrder.fullName}</strong>. Your project specification has been securely registered in the WGP Developer's database.
                  </p>

                  {/* Unique Order Reference Box */}
                  <div className="w-full bg-[#070A12] border border-cyan-500/50 rounded-xl p-5 mb-6 text-left flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">
                        Unique Order Reference
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-[#00E5FF]">
                        {successOrder.orderId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyRef(successOrder.orderId)}
                      className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedRef ? 'Copied!' : 'Copy Ref'}</span>
                    </button>
                  </div>

                  {/* Order Details Summary */}
                  <div className="w-full bg-[#0B0F19] rounded-xl p-5 border border-slate-800 text-left space-y-2.5 text-xs text-slate-300 mb-6 font-mono">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Service:</span>
                      <span className="text-white font-semibold">{successOrder.serviceTitle}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Project:</span>
                      <span className="text-white">{successOrder.projectTitle}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-cyan-400 font-semibold">{successOrder.status}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500">Official Gmail Destination:</span>
                      <span className="text-slate-200">wgpdevelopers@gmail.com</span>
                    </div>
                  </div>

                  {/* Notification Delivery State */}
                  <div className="w-full text-xs text-slate-400 bg-slate-900/60 rounded-lg p-3.5 border border-slate-800 flex items-start gap-2.5 text-left mb-6">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      {successOrder.emailNotificationStatus === 'SENT' ? (
                        <span className="text-emerald-400 font-medium">
                          Order notification dispatched directly from website to official Gmail ({OFFICIAL_BUSINESS_EMAIL}).
                        </span>
                      ) : (
                        <span>
                          Order has been securely submitted directly through the website system under Reference <strong>{successOrder.orderId}</strong> and routed to <strong>{OFFICIAL_BUSINESS_EMAIL}</strong>.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setTrackRef(successOrder.orderId);
                        setActiveTab('track');
                        setSuccessOrder(null);
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Track Order Status
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuccessOrder(null)}
                      className="px-6 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Place Another Order
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Order Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="glass-panel rounded-2xl p-6 sm:p-10 border border-slate-800/90 shadow-2xl space-y-8"
              >
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200 text-sm">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Section 1: Customer Contact Details */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
                    <span>1. Customer Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Full Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full px-4 py-3 rounded-xl bg-[#070A12] border text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-slate-800 focus:border-[#00E5FF]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alex@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#070A12] border text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-slate-800 focus:border-[#00E5FF]'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Phone Number <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +1 555-0199"
                        className={`w-full px-4 py-3 rounded-xl bg-[#070A12] border text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                          errors.phone
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-slate-800 focus:border-[#00E5FF]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Service Selection & Scope */}
                <div className="pt-6 border-t border-slate-800/80">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#00E5FF]" />
                    <span>2. Project Specifications</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Service Selection */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Selected Service <span className="text-cyan-400">*</span>
                      </label>
                      <select
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-slate-800 text-white text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
                      >
                        {services.map((svc) => (
                          <option key={svc.id} value={svc.id} className="bg-[#0B0F19] text-white">
                            {svc.title} (From {svc.startingPrice})
                          </option>
                        ))}
                      </select>
                      {errors.serviceId && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.serviceId}</p>
                      )}
                    </div>

                    {/* Project Title */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Project Title <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Next-Gen 3D SaaS Portal"
                        className={`w-full px-4 py-3 rounded-xl bg-[#070A12] border text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                          errors.projectTitle
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-slate-800 focus:border-[#00E5FF]'
                        }`}
                      />
                      {errors.projectTitle && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.projectTitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Estimated Budget Range <span className="text-cyan-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setBudgetRange(opt)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                            budgetRange === opt
                              ? 'bg-[#0066FF] border-[#00E5FF] text-white shadow-sm'
                              : 'bg-[#070A12] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Project Description <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Detail your application vision, core capabilities, target audience, and business goals..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#070A12] border text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                        errors.projectDescription
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-slate-800 focus:border-[#00E5FF]'
                      }`}
                    />
                    {errors.projectDescription && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.projectDescription}</p>
                    )}
                  </div>

                  {/* Preferred Requirements */}
                  <div className="mb-5">
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Key Technical & Delivery Requirements <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={preferredRequirements}
                      onChange={(e) => setPreferredRequirements(e.target.value)}
                      placeholder="e.g. Expected timeline, preferred frameworks (React, Three.js, Python), third-party APIs"
                      className={`w-full px-4 py-3 rounded-xl bg-[#070A12] border text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                        errors.preferredRequirements
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-slate-800 focus:border-[#00E5FF]'
                      }`}
                    />
                    {errors.preferredRequirements && (
                      <p className="mt-1.5 text-xs text-red-400">{errors.preferredRequirements}</p>
                    )}
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Additional Message (Optional)
                    </label>
                    <input
                      type="text"
                      value={additionalMessage}
                      onChange={(e) => setAdditionalMessage(e.target.value)}
                      placeholder="Any additional notes or scheduling preferences"
                      className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Row */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Your order is stored securely and dispatched to <strong>wgpdevelopers@gmail.com</strong>.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0099FF] hover:from-[#0052CC] hover:to-[#0088FF] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_rgba(0,102,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Project Order</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* Tab 2: Track Existing Order */}
        {activeTab === 'track' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-slate-800/90 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              Track Your Order Status
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Enter your unique order reference ID (provided upon order creation, e.g. <code>WGP-20261105-XXXX</code>) to check review status.
            </p>

            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
              <input
                type="text"
                required
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Enter Order Reference (e.g. WGP-20261105-ABCD)"
                className="flex-1 px-4 py-3 rounded-xl bg-[#070A12] border border-slate-800 text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]"
              />
              <button
                type="submit"
                disabled={isTracking}
                className="px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isTracking ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Lookup Order</span>
              </button>
            </form>

            {trackError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {trackedOrder && (
              <div className="bg-[#070A12] border border-slate-800 rounded-xl p-6 space-y-4 font-mono text-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-xs">Reference ID:</span>
                  <span className="text-[#00E5FF] font-bold">{trackedOrder.orderId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-xs">Client:</span>
                  <span className="text-white">{trackedOrder.fullName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-xs">Service:</span>
                  <span className="text-slate-200">{trackedOrder.serviceTitle}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-xs">Project Title:</span>
                  <span className="text-white">{trackedOrder.projectTitle}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-xs">Order Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-[#00E5FF] border border-cyan-500/30 font-semibold text-xs">
                    {trackedOrder.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 text-xs">Submitted:</span>
                  <span className="text-slate-300 text-xs">{trackedOrder.createdAt}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
