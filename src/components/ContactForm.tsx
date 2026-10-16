import React, { useState } from 'react';
import { SITE_CONFIG } from '../config/site';
import { Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  message: string;
  honeypot: string; // Anti-bot honeypot
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'unconnected' | 'error'>('idle');

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Inquiry details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot detection
    if (formData.honeypot) {
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Check if backend endpoint configured
    if (!SITE_CONFIG.contactFormEndpoint) {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('unconnected');
      }, 600);
      return;
    }

    try {
      const response = await fetch(SITE_CONFIG.contactFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '', honeypot: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-24 px-6 md:px-12 bg-[#061D12]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans-luxury text-xs tracking-[0.3em] text-[#E3C27E] uppercase mb-3">
            Bespoke Commissions & Inquiries
          </p>
          <h2 className="font-serif-luxury text-3xl md:text-5xl font-normal text-[#F5EBE1]">
            Contact Our Atelier
          </h2>
          <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto mt-6" />
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#0B2B1B] border border-emerald-500/50 text-center flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
            <h3 className="font-serif-luxury text-xl text-[#F5EBE1]">Inquiry Received</h3>
            <p className="font-sans-luxury text-xs text-[#E3C27E]/90 mt-1">
              Thank you for reaching out. Our Atelier advisor will review your message promptly.
            </p>
          </div>
        )}

        {submitStatus === 'unconnected' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#0B2B1B] border border-[#D4AF37]/40 text-center flex flex-col items-center">
            <AlertTriangle className="w-8 h-8 text-[#E3C27E] mb-2" />
            <h3 className="font-serif-luxury text-xl text-[#F5EBE1]">Backend Endpoint Pending</h3>
            <p className="font-sans-luxury text-xs text-[#E3C27E]/90 mt-1 max-w-md">
              Form backend endpoint is not connected yet. Please configure your contact API URL in site settings.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-8 p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-center">
            <p className="font-sans-luxury text-xs text-red-300">
              An error occurred while dispatching your request. Please try again later.
            </p>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Honeypot field for anti-spam */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website_url"
              tabIndex={-1}
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="name" className="block font-sans-luxury text-xs tracking-widest text-[#E3C27E] uppercase mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Lady Genevieve Vane"
              className={`w-full bg-[#0B2B1B] border ${
                errors.name ? 'border-red-500' : 'border-[#133D28] focus:border-[#D4AF37]'
              } text-[#F5EBE1] text-sm rounded-xl p-4 focus:outline-none transition-colors placeholder:text-[#F5EBE1]/30`}
            />
            {errors.name && <p className="font-sans-luxury text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block font-sans-luxury text-xs tracking-widest text-[#E3C27E] uppercase mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. genevieve@vane-estate.com"
              className={`w-full bg-[#0B2B1B] border ${
                errors.email ? 'border-red-500' : 'border-[#133D28] focus:border-[#D4AF37]'
              } text-[#F5EBE1] text-sm rounded-xl p-4 focus:outline-none transition-colors placeholder:text-[#F5EBE1]/30`}
            />
            {errors.email && <p className="font-sans-luxury text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block font-sans-luxury text-xs tracking-widest text-[#E3C27E] uppercase mb-2">
              Inquiry Details *
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your requested piece, gold specifications, or commission requirements..."
              className={`w-full bg-[#0B2B1B] border ${
                errors.message ? 'border-red-500' : 'border-[#133D28] focus:border-[#D4AF37]'
              } text-[#F5EBE1] text-sm rounded-xl p-4 focus:outline-none transition-colors placeholder:text-[#F5EBE1]/30 resize-none`}
            />
            {errors.message && <p className="font-sans-luxury text-xs text-red-400 mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-[#D4AF37] text-[#061D12] font-sans-luxury text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#F3E5AB] transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SENDING INQUIRY...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>SUBMIT INQUIRY TO ATELIER</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
