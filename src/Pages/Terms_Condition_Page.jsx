  import React, { useState, useEffect, useRef } from 'react';
  import {
    FileText, ShoppingBag, CreditCard, Truck, RotateCcw,
    AlertTriangle, Scale, Globe, Mail, ArrowRight, ChevronRight,
    Shield, Users, Ban, Star
  } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';

  const sections = [
    {
      id: 'acceptance',
      icon: FileText,
      number: '01',
      label: 'General',
      title: 'Acceptance of Terms',
      content: [
        'Welcome to Cosmic Virtue. By accessing or using our website at cosmicvirtues.com, placing an order, or engaging with any of our services, you agree to be bound by these Terms and Conditions.',
        'These Terms apply to all visitors, users, and customers of Cosmic Virtue. If you do not agree with any part of these terms, you may not access or use our services. We reserve the right to update or modify these Terms at any time without prior notice.',
      ],
    },
    {
      id: 'products',
      icon: ShoppingBag,
      number: '02',
      label: 'Products',
      title: 'Products & Descriptions',
      content: [
        'Cosmic Virtue offers a curated range of handcrafted products including bath salts, wax sachets, scented candles, and related wellness items. We take great care to represent our products accurately.',
      ],
      cards: [
        { emoji: '🧂', label: 'Bath Salts', desc: 'Handcrafted in natural flavours — Lavender, Orange, and Rosemary — using 100% natural ingredients.' },
        { emoji: '🕯️', label: 'Candles', desc: 'Pillar, Jar & 7 Chakra candles poured in small batches using premium soy wax, free from toxins.' },
        { emoji: '🌸', label: 'Wax Products', desc: 'Botanical wax sachets and pearl wax melts handmade with floral embeds and artisan craftsmanship.' },
        { emoji: '🎁', label: 'Gift Sets', desc: 'Curated gift hampers for birthdays, anniversaries, and festivals with optional custom branding.' },
      ],
      footer: 'Product colours and appearances may vary slightly due to the handcrafted nature of our items. We do not guarantee that product images on our website are an exact representation of the item you will receive.',
    },
    
    {
      id: 'intellectual-property',
      icon: Star,
      number: '06',
      label: 'IP Rights',
      title: 'Intellectual Property',
      content: [
        'All content on the Cosmic Virtue website — including but not limited to text, graphics, logos, product images, photographs, and branding — is the exclusive property of Cosmic Virtue and is protected under applicable intellectual property laws.',
        'You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any content from our website without our prior written permission. Unauthorised use of our intellectual property may result in legal action.',
      ],
    },
    {
      id: 'user-conduct',
      icon: Users,
      number: '07',
      label: 'Conduct',
      title: 'User Conduct',
      content: [
        'By using our website and services, you agree to engage with Cosmic Virtue in a lawful, respectful, and honest manner.',
      ],
      cards: [
        { emoji: '✔️', label: 'Acceptable Use', desc: 'Using our website for personal, non-commercial purposes and placing genuine orders for products.' },
        { emoji: '❌', label: 'Prohibited Actions', desc: 'Misrepresenting your identity, placing fraudulent orders, scraping content, or attempting to hack our systems.' },
        { emoji: '💬', label: 'Reviews & Feedback', desc: 'Submitting honest, relevant, and non-defamatory reviews. We reserve the right to remove inappropriate content.' },
        { emoji: '🔒', label: 'Account Security', desc: 'You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.' },
      ],
    },
    {
      id: 'prohibited',
      icon: Ban,
      number: '08',
      label: 'Restrictions',
      title: 'Prohibited Uses',
      content: [
        'You are strictly prohibited from using Cosmic Virtue\'s platform for any of the following:',
      ],
      list: [
        'Engaging in unlawful, fraudulent, or harmful activities',
        'Harassing, abusing, or threatening other users or our staff',
        'Uploading or transmitting viruses, malware, or any other harmful code',
        'Collecting personal information of other users without consent',
        'Impersonating Cosmic Virtue or any of its employees or representatives',
        'Using automated tools (bots, scrapers) to access or extract data from our platform',
        'Attempting to gain unauthorised access to any part of our systems or infrastructure',
      ],
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      number: '09',
      label: 'Liability',
      title: 'Limitation of Liability',
      content: [
        'Cosmic Virtue\'s products are handcrafted and intended for personal wellness use. While we take every precaution to ensure quality and safety, we make no warranties — express or implied — regarding the suitability of our products for any specific purpose.',
        'To the fullest extent permitted by law, Cosmic Virtue shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific order in question.',
      ],
      highlight: {
        label: 'Health & Safety Disclaimer',
        text: 'Our bath salts, candles, and wax products are for external and ambient use only. Please read all product labels carefully. Keep products away from children. If you experience any adverse reaction, discontinue use immediately and consult a medical professional.',
      },
    },
    {
      id: 'governing-law',
      icon: Scale,
      number: '10',
      label: 'Legal',
      title: 'Governing Law',
      content: [
        'These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat, India.',
        'We encourage you to contact us directly to resolve any concerns before initiating formal legal proceedings. Most disputes can be resolved amicably through our customer support team.',
      ],
    },
    {
      id: 'contact',
      icon: Globe,
      number: '11',
      label: 'Contact',
      title: 'Contact Information',
      content: [
        'If you have any questions, concerns, or feedback regarding these Terms and Conditions, please reach out to us through any of the following channels:',
      ],
      cards: [
        { emoji: '✉️', label: 'General Enquiries', desc: 'cosmicvirtue07@gmail.com' },
        { emoji: '🛒', label: 'Order Support', desc: 'cosmicvirtue07@gmail.com' },
        { emoji: '⚖️', label: 'Legal & Privacy', desc: 'cosmicvirtue07@gmail.com' },
        { emoji: '📍', label: 'Location', desc: 'Ahmedabad, Gujarat, India' },
      ],
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

  const TermsAndConditions = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('acceptance');

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
                Legal &amp; Policy
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400" />
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Terms &amp; <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Conditions</span>
            </h1>

            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
              Please read these terms carefully before using our website or placing an order. By continuing, you agree to be bound by the policies below.
            </p>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {['Effective: January 1, 2026', 'Jurisdiction: Ahmedabad, Gujarat, India', 'Version 1.0'].map((m) => (
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
                { id: 'acceptance', label: 'General' },
                { id: 'products', label: 'Products' },
                { id: 'intellectual-property', label: 'IP Rights' },
                { id: 'user-conduct', label: 'Conduct' },
                { id: 'prohibited', label: 'Restrictions' },
          
                { id: 'liability', label: 'Liability' },
                { id: 'contact', label: 'Contact' },
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
                  <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Need help?</p>
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
                  <Shield className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-semibold text-purple-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>Secure Shopping</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                  All transactions on Cosmic Virtue are encrypted and processed securely.
                </p>
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

                        {/* Bullet list */}
                        {section.list && (
                          <ul className="space-y-3 mt-2">
                            {section.list.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
                                <span
                                  className="text-sm text-gray-600 leading-relaxed"
                                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                                >
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
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
                        Have a question about our terms?
                      </p>
                      <h3
                        className="text-2xl sm:text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        We're here to help
                      </h3>
                      <p className="text-white/75 text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                        Reach out to our team for any clarifications before placing your order.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                      <a
                        href="mailto:cosmicvirtue07@gmail.com"
                        className="flex items-center gap-2 bg-white text-purple-700 px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-purple-50 transition-all duration-300 shadow-lg whitespace-nowrap"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <Mail className="w-4 h-4" />
                        Contact Us
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

  export default TermsAndConditions;