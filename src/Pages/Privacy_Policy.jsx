import React, { useState, useEffect, useRef } from 'react';
import { Shield, Database, Share2, Lock, Trash2, UserCheck, RefreshCw, Mail, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sections = [
  {
    id: 'introduction',
    icon: Shield,
    number: '01',
    label: 'Overview',
    title: 'Introduction',
    content: [
      'Cosmic Virtue ("we," "our," or "us") is committed to protecting your privacy and handling your data with complete transparency. This Privacy Policy governs how our application accesses, uses, stores, and protects information obtained through Google API Services.',
      'By using Cosmic Virtue, you agree to the practices described in this policy. Our use of information received from Google APIs strictly adheres to the Google API Services User Data Policy, including all Limited Use requirements.',
    ],
  },
  {
    id: 'data-accessed',
    icon: Database,
    number: '02',
    label: 'Section 1',
    title: 'Data Accessed',
    content: [
      'Cosmic Virtue requests access to the following categories of Google user data, only to the extent strictly necessary to provide core application functionality:',
    ],
    cards: [
      { emoji: '✉️', label: 'Gmail Data', desc: 'Read and send access to Gmail messages and threads, used solely to enable in-app communication features.' },
      { emoji: '📅', label: 'Google Calendar', desc: 'Read and write access to calendar events to allow scheduling and reminder functionalities within the app.' },
      { emoji: '👤', label: 'Profile Information', desc: 'Basic profile data including your name, email address, and profile photo used for account identification.' },
      { emoji: '🔑', label: 'Authentication Tokens', desc: 'OAuth tokens used to securely authenticate your identity and maintain your session.' },
    ],
    footer: 'We request only the minimum scopes necessary for the features you choose to use. You may revoke any of these permissions at any time through your Google Account settings.',
  },
  {
    id: 'data-usage',
    icon: UserCheck,
    number: '03',
    label: 'Section 2',
    title: 'Data Usage',
    content: [
      'Google user data accessed by Cosmic Virtue is used exclusively for the following purposes:',
    ],
    cards: [
      { emoji: '⚙️', label: 'Core Functionality', desc: 'To operate, maintain, and deliver the features and services of the Cosmic Virtue application.' },
      { emoji: '🛡️', label: 'Security & Integrity', desc: 'To authenticate users, prevent fraud, and protect against unauthorized access.' },
      { emoji: '💬', label: 'User Communication', desc: 'To send transactional emails, notifications, and support responses related to your use of the app.' },
      { emoji: '🔧', label: 'Improvement', desc: 'To diagnose technical issues, monitor app performance, and improve reliability of services.' },
    ],
    highlight: {
      label: 'Limited Use Commitment',
      text: 'Cosmic Virtue does not use Google user data to serve advertisements, for any profiling purposes, or for any use unrelated to providing and improving the app\'s features.',
    },
  },
  {
    id: 'data-sharing',
    icon: Share2,
    number: '04',
    label: 'Section 3',
    title: 'Data Sharing',
    content: [
      'Cosmic Virtue does not sell, rent, or trade your Google user data to any third parties. We may share limited data only in the following strictly defined circumstances:',
    ],
    cards: [
      { emoji: '🤝', label: 'Service Providers', desc: 'Trusted vendors who assist in operating our platform (e.g., cloud hosting) under strict confidentiality agreements.' },
      { emoji: '⚖️', label: 'Legal Compliance', desc: 'When required by applicable law, regulation, or enforceable governmental request — only to the extent necessary.' },
      { emoji: '🔄', label: 'Business Transfer', desc: 'In the event of a merger or acquisition, user data may be transferred with prior notice to affected users.' },
    ],
    footer: 'Any third parties we work with are prohibited from using your Google user data for any purpose other than providing services to Cosmic Virtue.',
  },
  {
    id: 'data-storage',
    icon: Lock,
    number: '05',
    label: 'Section 4',
    title: 'Data Storage & Protection',
    content: [
      'We implement industry-standard security measures to protect your data throughout its entire lifecycle:',
    ],
    cards: [
      { emoji: '🔐', label: 'Encryption in Transit', desc: 'All data transmitted between your device and our servers is encrypted using TLS 1.2 or higher.' },
      { emoji: '🗄️', label: 'Encryption at Rest', desc: 'Stored data is encrypted using AES-256 encryption on secure, access-controlled servers.' },
      { emoji: '🚪', label: 'Access Controls', desc: 'Access to user data is strictly role-based, limited to authorized personnel under least-privilege principles.' },
      { emoji: '🔍', label: 'Security Audits', desc: 'We conduct regular security assessments, vulnerability scans, and access log reviews to address potential threats.' },
    ],
  },
  {
    id: 'data-retention',
    icon: Trash2,
    number: '06',
    label: 'Section 5',
    title: 'Data Retention & Deletion',
    content: [
      'We retain your Google user data only for as long as your account is active or as needed to provide services:',
    ],
    cards: [
      { emoji: '🕐', label: 'Active Account Data', desc: 'Retained for the duration of your active account to support continued use of the application.' },
      { emoji: '📜', label: 'Transaction Logs', desc: 'Retained for up to 12 months for security, compliance, and dispute resolution purposes.' },
      { emoji: '🗑️', label: 'Deleted Account Data', desc: 'Permanently purged from our systems within 30 days of account deletion, unless required by law.' },
    ],
    highlight: {
      label: 'Your Right to Deletion',
      text: 'You may request deletion of your data at any time by emailing privacy@cosmicvirtues.com or using the in-app data deletion option in Account Settings. We will process all deletion requests within 30 days.',
    },
  },
  {
    id: 'policy-changes',
    icon: RefreshCw,
    number: '07',
    label: 'Section 6',
    title: 'Policy Changes',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. Material changes will be communicated to you via email or a prominent in-app notice at least 30 days before they take effect.',
      'Your continued use of Cosmic Virtue after the effective date of any update constitutes your acceptance of the revised policy.',
    ],
  },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
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
    <div className="flex items-start gap-4 bg-white rounded-xl p-5 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300">
      <span className="text-2xl mt-0.5 flex-shrink-0">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>{label}</p>
        <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Track active section on scroll
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
        .toc-link { transition: all 0.2s ease; }
        .toc-link:hover { padding-left: 4px; }
        html { scroll-padding-top: 80px; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Soft background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-pink-400" />
            <span className="text-purple-500 text-xs uppercase tracking-[0.3em] font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Legal &amp; Transparency
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400" />
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Privacy <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Policy</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
            We believe transparency is a virtue. Here's exactly how we access, use, protect, and respect every piece of data you entrust to us.
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Effective: January 1, 2026', 'Project: cosmic-virtue', 'Version 2.0'].map((m) => (
              <span
                key={m}
                className="bg-white border border-purple-100 text-gray-500 text-xs px-4 py-1.5 rounded-full shadow-sm"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-10 lg:gap-16 items-start">

          {/* ── STICKY TOC (desktop) ── */}
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

              {/* Contact shortcut */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Questions?</p>
                <a
                  href="mailto:privacy@cosmicvirtues.com"
                  className="flex items-center gap-2 text-purple-600 text-xs font-medium hover:text-purple-800 transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <Mail className="w-3.5 h-3.5" />
                  privacy@cosmicvirtues.com
                </a>
              </div>
            </div>
          </aside>

          {/* ── SECTIONS ── */}
          <div className="flex-1 min-w-0 space-y-6">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <AnimatedSection key={section.id} delay={idx * 60}>
                  <div
                    id={section.id}
                    className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden"
                  >
                    {/* Section header */}
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
                        className="ml-auto text-3xl font-bold text-gray-100 select-none"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {section.number}
                      </span>
                    </div>

                    {/* Section body */}
                    <div className="px-7 py-6 space-y-5">
                      {/* Paragraphs */}
                      {section.content.map((para, i) => (
                        <p
                          key={i}
                          className="text-gray-600 text-sm sm:text-base leading-relaxed"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                        >
                          {para}
                        </p>
                      ))}

                      {/* Data cards grid */}
                      {section.cards && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {section.cards.map((card) => (
                            <DataCard key={card.label} {...card} />
                          ))}
                        </div>
                      )}

                      {/* Highlight box */}
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

            {/* ── CONTACT CARD ── */}
            <AnimatedSection delay={sections.length * 60}>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-10 text-center shadow-xl shadow-purple-200">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Questions or Concerns?
                </h3>
                <p
                  className="text-white/80 text-sm mb-7 max-w-md mx-auto leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                >
                  Our privacy team is here to help with data requests, deletion inquiries, or any privacy-related questions.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="mailto:privacy@cosmicvirtues.com"
                    className="flex items-center gap-2 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-purple-50 transition-all duration-300 shadow-lg"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Mail className="w-4 h-4" />
                    cosmicvirtue07@gmail.com
                  </a>
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-white/25 transition-all duration-300"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Back to Home <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* ── FOOTER NOTE ── */}
            <AnimatedSection delay={(sections.length + 1) * 60}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2">
                <p className="text-xs text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  © 2026 Cosmic Virtue. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/term')}
                    className="text-xs text-purple-500 hover:text-purple-700 transition-colors"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Terms of Service
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

export default PrivacyPolicy;