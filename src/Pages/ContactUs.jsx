import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, Instagram, Facebook, Twitter, MessageCircle, Clock, Sparkles } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setSubmitting(true);
      // Replace with your actual API endpoint if available
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulated delay
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Call Us',
      value: '+91 63538 26286',
      sub: 'Mon – Sat, 10am – 7pm IST',
      href: 'tel:+916353826286',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email Us',
      value: 'cosmicvirtue07@gmail.com',
      sub: 'We reply within 24 hours',
      href: 'mailto:cosmicvirtue07@gmail.com',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Our Studio',
      value: 'Ahmedabad, Gujarat',
      sub: 'India – 380001',
      href: '#',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Working Hours',
      value: 'Mon – Sat',
      sub: '10:00 AM – 7:00 PM IST',
      href: '#',
    },
  ];

  const socials = [
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', href: 'https://www.instagram.com/cosmic_virtue?igsh=MTJ2NHcybGJnc2t5ag==', color: 'hover:bg-pink-500' },
    // { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', href: '#', color: 'hover:bg-blue-600' },
    // { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', href: '#', color: 'hover:bg-sky-500' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'WhatsApp', href: 'https://www.whatsapp.com/channel/0029Vb7KkrZGufIztQHXna22?source_surface=20', color: 'hover:bg-green-500' },
  ];

  const subjects = [
    'Order Enquiry',
    'Product Information',
    'Bulk / Corporate Order',
    'Gifting & Customisation',
    'Return / Exchange',
    'Other',
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Montserrat', sans-serif;
        }
        .input-field:focus {
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }
        .input-field::placeholder { color: #9ca3af; font-weight: 300; }

        .info-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .info-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(147,51,234,0.12); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeInUp 0.6s ease both; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* ── HERO HEADER ── */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 sm:py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-52 h-52 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-14 -right-14 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-white/50"></span>
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs uppercase tracking-[0.3em]">We'd love to hear from you</span>
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="h-px w-8 bg-white/50"></span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Get in Touch
            </h1>
            <p
              className="text-white/80 text-sm sm:text-base"
              style={{ fontWeight: 300 }}
            >
              Questions, bulk orders, gifting or just want to say hello — we're here for it all.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* ── CONTACT INFO CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-20">
            {contactInfo.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="info-card bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 text-center block"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
                  {item.icon}
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.value}
                </p>
                <p className="text-xs text-gray-400" style={{ fontWeight: 300 }}>
                  {item.sub}
                </p>
              </a>
            ))}
          </div>

          {/* ── MAIN GRID: Form + Sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* ── CONTACT FORM ── */}
            <div className="lg:col-span-3 fade-up">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 sm:p-10">

                {/* Form heading */}
                <div className="mb-7">
                  <p className="text-xs text-purple-500 uppercase tracking-widest font-semibold mb-1">Send a Message</p>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    We'll get back to you soon
                  </h2>
                </div>

                {/* Success state */}
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3
                      className="text-2xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Message Sent!
                    </h3>
                    <p className="text-gray-500 text-sm mb-7" style={{ fontWeight: 300 }}>
                      Thank you for reaching out. We'll reply within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Priya Sharma"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Phone + Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="input-field"
                          style={{ cursor: 'pointer' }}
                        >
                          <option value="">Select a topic…</option>
                          {subjects.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Message <span className="text-pink-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us how we can help you…"
                        className="input-field resize-none"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-red-500 text-xs font-medium">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400" style={{ fontWeight: 300 }}>
                      We respect your privacy. Your details will never be shared.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div className="lg:col-span-2 space-y-6 fade-up">

              {/* WhatsApp quick CTA */}
              <a
                href="https://wa.me/+916353826286"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-md p-6 sm:p-7 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Chat on WhatsApp</p>
                    <p className="text-green-100 text-xs" style={{ fontWeight: 300 }}>Fastest way to reach us</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed" style={{ fontWeight: 300 }}>
                  For quick queries, order updates or gifting customisations — drop us a WhatsApp message and we'll respond within the hour.
                </p>
                <div className="mt-4 flex items-center gap-1 text-white font-semibold text-xs uppercase tracking-wide">
                  Start Chat →
                </div>
              </a>

              {/* Follow us */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-7">
                <p className="text-xs text-purple-500 uppercase tracking-widest font-semibold mb-1">Social</p>
                <h3
                  className="text-xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Follow Our Journey
                </h3>
                <p className="text-sm text-gray-500 mb-5" style={{ fontWeight: 300 }}>
                  Stay inspired — behind-the-scenes, new launches and candle care tips.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 rounded-xl text-gray-600 text-sm font-medium border border-gray-100 ${s.color} hover:text-white hover:border-transparent transition-all duration-200`}
                    >
                      {s.icon}
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ teaser */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6 sm:p-7">
                <p className="text-xs text-purple-500 uppercase tracking-widest font-semibold mb-1">Quick Help</p>
                <h3
                  className="text-xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Common Questions
                </h3>
                <ul className="space-y-2.5">
                  {[
                    'How long does delivery take?',
                    'Do you offer bulk / corporate orders?',
                    'Can I customise a gift set?',
                    'What is your return policy?',
                  ].map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600" style={{ fontWeight: 300 }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0"></span>
                      {q}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-4" style={{ fontWeight: 300 }}>
                  Send us a message above and we'll answer any of these for you.
                </p>
              </div>

            </div>
          </div>

         

        </div>
      </div>
    </>
  );
};

export default ContactUs;