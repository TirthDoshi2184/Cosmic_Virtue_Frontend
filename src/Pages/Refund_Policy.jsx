import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw, CreditCard, Truck, ShieldCheck,
  Mail, ChevronRight, Shield, ArrowRight, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sections = [
  {
    id: 'orders',
    icon: CreditCard,
    number: '01',
    label: 'Ordering',
    title: 'Orders & Payments',
    content: [
      'By placing an order on our website, you are making an offer to purchase the selected products. All orders are subject to acceptance and availability.',
    ],
    cards: [
      { emoji: '✅', label: 'Order Confirmation', desc: 'You will receive an email confirmation once your order is successfully placed. This does not guarantee acceptance.' },
      { emoji: '💳', label: 'Payment Methods', desc: 'We accept UPI, credit/debit cards, net banking, and other available payment gateways. All transactions are secured.' },
      { emoji: '📋', label: 'Pricing', desc: 'All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.' },
      { emoji: '🚫', label: 'Cancellation', desc: 'Orders may be cancelled within 24 hours of placement. Once dispatched, orders cannot be cancelled.' },
    ],
    highlight: {
      label: 'Important',
      text: 'Cosmic Virtue reserves the right to cancel or refuse any order at our discretion, including cases of suspected fraud, payment failure, or product unavailability. A full refund will be issued in such cases.',
    },
  },
  {
    id: 'shipping',
    icon: Truck,
    number: '02',
    label: 'Delivery',
    title: 'Shipping & Delivery',
    content: [
      'We aim to deliver your Cosmic Virtue products safely and on time. Please review our shipping terms carefully before placing an order.',
    ],
    cards: [
      { emoji: '📦', label: 'Processing Time', desc: 'Orders are processed within 1–3 business days after payment confirmation, excluding Sundays and public holidays.' },
      { emoji: '🚚', label: 'Delivery Timeline', desc: 'Standard delivery takes 5–7 business days. Express delivery options may be available at checkout.' },
      { emoji: '🆓', label: 'Free Shipping', desc: 'Free shipping is offered on orders above ₹999 within India. Orders below this threshold attract a flat shipping fee.' },
      { emoji: '🌍', label: 'International Orders', desc: 'We currently ship within India only. International shipping may be available upon request — contact us for details.' },
    ],
    footer: 'Cosmic Virtue is not responsible for delays caused by courier partners, natural events, or circumstances beyond our control. Tracking information will be shared once your order is dispatched.',
  },
  {
    id: 'returns',
    icon: RotateCcw,
    number: '03',
    label: 'Returns',
    title: 'Returns & Refunds',
    content: [
      'Your satisfaction is our priority. We accept returns under the following conditions:',
    ],
    cards: [
      { emoji: '📅', label: 'Return Window', desc: 'Returns are accepted within 7 days of delivery for damaged or defective products only.' },
      { emoji: '📸', label: 'Proof Required', desc: 'Please share unboxing photos or videos as evidence of damage at the time of delivery.' },
      { emoji: '💰', label: 'Refund Process', desc: 'Approved refunds are processed within 5–7 business days to the original payment method.' },
      { emoji: '🚫', label: 'Non-Returnable Items', desc: 'Personalised, custom-labelled, or gift-wrapped products cannot be returned unless damaged or defective.' },
    ],
    highlight: {
      label: 'How to Raise a Return',
      text: 'To initiate a return, email us at cosmicvirtue07@gmail.com within 7 days of receiving your order with your order number and photos of the issue. Our team will respond within 48 hours.',
    },
  },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function DataCard({ emoji, label, desc }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl p-5 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300 group">
      <span className="text-2xl mt-0.5 flex-shrink-0">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>{label}</p>
        <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

const RefundPolicy = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('orders');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');
        body { background: linear-gradient(135deg, #fdf4ff 0%, #faf5ff 40%, #fce7f3 100%); background-attachment: fixed; }
        html { scroll-padding-top: 80px; }
        .toc-link { transition: all 0.2s ease; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-pink-400" />
            <span className="text-purple-500 text-xs uppercase tracking-[0.3em] font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Orders &amp; Returns
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400" />
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Refund &amp; <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Returns Policy</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
            We want every order to be a joyful experience. Please read our policies on orders, shipping, and returns so you know exactly what to expect.
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {['Effective: January 1, 2026', 'Returns within 7 days', 'Refunds in 5–7 business days'].map((m) => (
              <span
                key={m}
                className="bg-white border border-purple-100 text-gray-500 text-xs px-4 py-1.5 rounded-full shadow-sm"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Quick nav pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'orders', label: 'Orders' },
              { id: 'shipping', label: 'Shipping' },
              { id: 'returns', label: 'Returns' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="bg-white border border-purple-200 text-purple-600 text-xs px-4 py-1.5 rounded-full shadow-sm hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 font-medium"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-10 lg:gap-16 items-start">

          {/* ── STICKY TOC ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const active = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`toc-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-semibold border border-purple-200'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-purple-500' : 'text-gray-400'}`} />
                      <span className="truncate">{s.title}</span>
                      {active && <ChevronRight className="w-3 h-3 ml-auto text-purple-400" />}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Need help with a return?</p>
                <a
                  href="mailto:cosmicvirtue07@gmail.com"
                  className="flex items-center gap-2 text-purple-600 text-xs font-medium hover:text-purple-800 transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <Mail className="w-3.5 h-3.5" />
                  cosmicvirtue07@gmail.com
                </a>
              </div>
            </div>

            {/* Quick notice card */}
            <div className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <p className="text-xs font-semibold text-purple-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>Hassle-Free Returns</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                Damaged item? We'll make it right. Just email us within 7 days of delivery.
              </p>
            </div>

            {/* Refund timeline card */}
            <div className="mt-4 bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-purple-700 mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>Refund Timeline</p>
              <div className="space-y-3">
                {[
                  { step: '1', label: 'Raise request', sub: 'Within 7 days of delivery' },
                  { step: '2', label: 'Team review', sub: 'Within 48 hours' },
                  { step: '3', label: 'Refund issued', sub: '5–7 business days' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">{item.step}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>{item.label}</p>
                      <p className="text-[11px] text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── CONTENT SECTIONS ── */}
          <div className="flex-1 min-w-0 space-y-6">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <AnimatedSection key={section.id} delay={idx * 50}>
                  <div
                    id={section.id}
                    className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-4 px-7 py-6 border-b border-gray-50">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {section.label}
                        </p>
                        <h2
                          className="text-xl sm:text-2xl font-bold text-gray-900"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {section.title}
                        </h2>
                      </div>
                      <span
                        className="ml-auto text-3xl font-bold text-gray-100 select-none hidden sm:block"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {section.number}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="px-7 py-6 space-y-5">
                      {section.content.map((para, i) => (
                        <p
                          key={i}
                          className="text-gray-600 text-sm sm:text-base leading-relaxed"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                        >
                          {para}
                        </p>
                      ))}

                      {/* Cards */}
                      {section.cards && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {section.cards.map((card) => (
                            <DataCard key={card.label} {...card} />
                          ))}
                        </div>
                      )}

                      {/* Highlight */}
                      {section.highlight && (
                        <div className="flex items-start gap-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 mt-2">
                          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-purple-500 to-pink-500 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {section.highlight.label}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                              {section.highlight.text}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Footer text */}
                      {section.footer && (
                        <p
                          className="text-gray-500 text-sm leading-relaxed pt-1"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                        >
                          {section.footer}
                        </p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}

            {/* ── BOTTOM CTA ── */}
            <AnimatedSection delay={sections.length * 50}>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-10 shadow-xl shadow-purple-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Issue with your order?
                    </p>
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      We're here to help
                    </h3>
                    <p className="text-white/75 text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                      Reach out to our support team and we'll resolve your concern within 48 hours.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <a
                      href="mailto:cosmicvirtue07@gmail.com"
                      className="flex items-center gap-2 bg-white text-purple-700 px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-purple-50 transition-all duration-300 shadow-lg whitespace-nowrap"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <Mail className="w-4 h-4" />
                      Contact Support
                    </a>
                    <button
                      onClick={() => navigate('/products')}
                      className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-white/25 transition-all duration-300 whitespace-nowrap"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ── FOOTER LINKS ── */}
            <AnimatedSection delay={(sections.length + 1) * 50}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2">
                <p className="text-xs text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  © 2026 Cosmic Virtue. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/terms')}
                    className="text-xs text-purple-500 hover:text-purple-700 transition-colors"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Terms &amp; Conditions
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={() => navigate('/privacy')}
                    className="text-xs text-purple-500 hover:text-purple-700 transition-colors"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Privacy Policy
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-xs text-purple-500 hover:text-purple-700 transition-colors"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicy;