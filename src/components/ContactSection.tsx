/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, Shield, Clock } from 'lucide-react';
import { isValidEmail } from '../utils/orderValidation';
import { OFFICIAL_BUSINESS_EMAIL } from '../utils/emailTemplate';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !isValidEmail(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!subject.trim() || subject.trim().length < 3) {
      setError('Please specify an inquiry subject.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 bg-[#070A12] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wider uppercase mb-3">
                <span>Direct Communication</span>
                <span aria-hidden="true">·</span>
                <span>Official Channel</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
                Contact <span className="text-[#00E5FF]">Us</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Have an inquiry about a prospective project or technology collaboration? Reach out directly to our engineering leadership.
              </p>

              {/* Official Email Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 flex items-center justify-center text-[#00E5FF] shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                      Official Business Email
                    </div>
                    <a
                      href={`mailto:${OFFICIAL_BUSINESS_EMAIL}`}
                      className="text-base sm:text-lg font-bold text-white hover:text-[#00E5FF] transition-colors break-all"
                    >
                      {OFFICIAL_BUSINESS_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              {/* Assurance Items */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Prompt response within 24 business hours guaranteed.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Confidentiality assured under standard NDA on request.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
              {success ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[#00E5FF] mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                    Your inquiry has been dispatched to <strong>{OFFICIAL_BUSINESS_EMAIL}</strong>. Our team will review your message and reply promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-lg bg-[#0066FF] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#0052CC]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-2.5 text-red-200 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Your Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Subject <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Inquiring about Website or AI Development"
                      className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Your Message <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question or requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0099FF] hover:from-[#0052CC] hover:to-[#0088FF] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(0,102,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Message...' : 'Send Message to wgpdevelopers@gmail.com'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
