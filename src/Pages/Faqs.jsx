
import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle, ShoppingBag, Truck, RotateCcw, CreditCard,
  Flame, Package, Star, Mail, ArrowRight, ChevronDown, ChevronRight, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'products',
    icon: Flame,
    label: 'Products',
    title: 'Our Candles & Products',
    color: 'from-orange-100 to-pink-100',
    iconColor: 'text-orange-500',
    faqs: [
      {
        q: 'What type of wax is used in Cosmic Virtue candles?',
        a: 'All our candles are made with 100% premium soy wax, which is clean-burning, non-toxic, and eco-friendly. We do not use paraffin wax, which is petroleum-based and releases harmful chemicals when burned. Our soy wax is responsibly sourced and gives a longer, cooler burn.',
      },
      {
        q: 'Are your candles safe to use indoors during Indian summers?',
        a: 'Yes, our candles are safe for indoor use year-round. However, during peak Indian summers (April–June), we recommend storing candles away from direct sunlight and not leaving them near open windows or fans, as this can cause uneven burning. Soy wax has a lower melting point, so storing them in a cool, dry place is ideal.',
      },
      {
        q: 'Do your candles contain any artificial fragrances or chemicals?',
        a: 'No. Cosmic Virtue candles are crafted with skin-safe fragrance oils and natural essential oils. We never use phthalates, parabens, or synthetic dyes. Our wicks are 100% cotton — lead-free and zinc-free — ensuring a clean, even burn.',
      },
      {
        q: 'What is the burn time of your candles?',
        a: 'Burn times vary by product. Our jar candles typically burn for 40–50 hours, pillar candles for 25–35 hours, and our 7 Chakra candle sets for 6–8 hours each. Burn time can be maximised by trimming the wick to 6mm before each use and keeping the melt pool clear of debris.',
      },
      {
        q: 'What are 7 Chakra candles? Are they suitable for pooja or meditation?',
        a: 'Our 7 Chakra candles are a set of seven colour-coded candles, each representing one of the seven energy centres (chakras) in the body — from Root (Muladhara) to Crown (Sahasrara). They are widely used for meditation, yoga, and spiritual practices. They can complement your pooja space, though they are not traditional agarbatti or diyas and should not replace them in religious rituals.',
      },
      {
        q: 'Are your bath salts and wax sachets made locally in India?',
        a: 'Yes! All our products — bath salts, wax sachets, pearl wax melts, and candles — are handcrafted at our studio in Ahmedabad, Gujarat. We source ingredients locally wherever possible, supporting Indian artisans and suppliers.',
      },
    ],
  },
  {
    id: 'orders',
    icon: ShoppingBag,
    label: 'Orders',
    title: 'Placing Orders',
    color: 'from-purple-100 to-violet-100',
    iconColor: 'text-purple-500',
    faqs: [
      {
        q: 'How do I place an order on cosmicvirtues.com?',
        a: 'Simply browse our catalogue, add products to your cart, and proceed to checkout. You can complete your payment via UPI (PhonePe, Google Pay, Paytm), credit/debit card, net banking, or cash on delivery where available. You will receive an order confirmation email immediately after successful payment.',
      },
      {
        q: 'Can I place a bulk or corporate gifting order for Diwali or festivals?',
        a: 'Absolutely! We offer custom bulk orders for Diwali, Navratri, weddings, corporate gifting, and other occasions. You can request custom branding, personalised labels, or curated hampers. Please email us at hello@cosmicvirtues.com at least 10–15 days in advance for bulk orders to ensure timely delivery.',
      },
      {
        q: 'Is COD (Cash on Delivery) available?',
        a: 'COD is available on select pin codes across India. At checkout, you will be able to see if COD is available for your delivery address. For COD orders, a small convenience fee may be applicable. Prepaid orders via UPI or card are always preferred for faster processing.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Orders can be modified or cancelled within 24 hours of placement by emailing support@cosmicvirtues.com with your order number. Once the order is dispatched, it cannot be cancelled. For prepaid orders that are cancelled within the window, refunds are processed within 5–7 business days.',
      },
      {
        q: 'Do you offer GST invoices for business purchases?',
        a: 'Yes, we provide GST-compliant invoices for all orders. If you need a GST invoice with your business GSTIN, please share your details at the time of ordering or email us within 24 hours of purchase. Our GSTIN is registered in Gujarat.',
      },
    ],
  },
  {
    id: 'shipping',
    icon: Truck,
    label: 'Shipping',
    title: 'Shipping & Delivery',
    color: 'from-sky-100 to-blue-100',
    iconColor: 'text-sky-500',
    faqs: [
      {
        q: 'How long does delivery take across India?',
        a: 'Orders are processed within 1–3 business days from our Ahmedabad studio. Standard delivery typically takes 5–7 business days for most Indian cities and towns. Remote areas or certain North-East pin codes may take up to 10–12 business days. Express delivery may be available at checkout for select locations.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free shipping on all prepaid orders above ₹999 within India. For orders below ₹999, a flat shipping fee of ₹60–80 is applicable depending on your location. COD orders may attract an additional handling charge.',
      },
      {
        q: 'How are candles packaged to prevent breakage during transit?',
        a: 'We take great care in packing our products. Each candle is individually wrapped in bubble wrap and nestled in custom-sized boxes with tissue paper and filler material. Fragile items like glass jar candles receive additional padding. Despite best efforts, if a product arrives damaged, please photograph it immediately and contact us.',
      },
      {
        q: 'Do you ship to Tier 2 and Tier 3 cities in India?',
        a: 'Yes, we ship pan-India through trusted courier partners including Shiprocket, Delhivery, and Blue Dart. This covers most cities, towns, and pin codes across all states including remote areas in Rajasthan, MP, Bihar, and the North-East. Enter your pin code at checkout to confirm deliverability.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you will receive an email and/or SMS with your tracking number and a link to track your shipment in real time. You can also track your order from your account dashboard on cosmicvirtues.com.',
      },
    ],
  },
  {
    id: 'returns',
    icon: RotateCcw,
    label: 'Returns',
    title: 'Returns & Refunds',
    color: 'from-green-100 to-emerald-100',
    iconColor: 'text-emerald-500',
    faqs: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery only for products that arrive damaged or defective. Since all our products are handcrafted and perishable in nature, we are unable to accept returns for change of mind. Please inspect your package upon delivery and report any issues promptly.',
      },
      {
        q: 'My candle arrived cracked or broken — what do I do?',
        a: 'We are sorry to hear that! Please take an unboxing video or clear photos of the damaged product and packaging, and email them to support@cosmicvirtues.com within 7 days of delivery along with your order number. Our team will review and arrange a replacement or refund within 48 hours of confirmation.',
      },
      {
        q: 'Can I return a candle if I don \'t like the fragrance?',
        a: 'Unfortunately, we cannot accept returns based on fragrance preference as all our candles are made to order and are a sensory, perishable product. We recommend checking the product descriptions and fragrance notes carefully before ordering. You are also welcome to DM us on Instagram for fragrance guidance before purchasing.',
      },
      {
        q: 'How long does a refund take to reflect in my account?',
        a: 'Approved refunds are processed within 5–7 business days from the date of approval. The amount is credited back to your original payment method — UPI, bank account, or card. For COD orders, refunds are processed via NEFT/bank transfer, so please share your bank details when raising the return request.',
      },
      {
        q: 'Are personalised or gift-wrapped orders eligible for return?',
        a: 'Personalised products, custom-labelled candles, and gift-wrapped orders are non-returnable unless they arrive damaged or defective. This is because they are made specifically for you and cannot be resold. Please double-check personalisation details before confirming your order.',
      },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    label: 'Payments',
    title: 'Payments & Security',
    color: 'from-yellow-100 to-amber-100',
    iconColor: 'text-amber-500',
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), credit and debit cards (Visa, Mastercard, RuPay), net banking, and EMI options on select cards. All transactions are secured via SSL encryption and processed through PCI-DSS compliant payment gateways.',
      },
      {
        q: 'Is it safe to pay online on cosmicvirtues.com?',
        a: 'Yes, absolutely. Our website uses 256-bit SSL encryption and all payments are processed through Razorpay or a similarly certified payment gateway. We do not store your card or UPI details on our servers. You can shop with complete confidence.',
      },
      {
        q: 'My payment failed but money was deducted — what should I do?',
        a: 'In case of a payment failure where money has been debited, please don\'t panic. Such amounts are automatically refunded by your bank within 5–7 working days. If you don\'t receive the refund, email us at support@cosmicvirtues.com with your transaction ID and we will help coordinate with the payment gateway.',
      },
      {
        q: 'Do you offer EMI on candle orders?',
        a: 'EMI options are available on select credit cards for orders above ₹3,000 through our payment gateway. Applicable cards and tenure options are displayed at checkout. No-cost EMI may be available during festive sales such as Diwali or Republic Day.',
      },
    ],
  },
  {
    id: 'care',
    icon: Star,
    label: 'Candle Care',
    title: 'Candle Safety & Care',
    color: 'from-rose-100 to-pink-100',
    iconColor: 'text-rose-500',
    faqs: [
      {
        q: 'How should I burn a candle for the first time?',
        a: 'The first burn is the most important! Allow the candle to burn until the entire top layer of wax melts edge to edge — this is called the "memory pool." For a standard jar candle this takes 2–3 hours. Never extinguish the candle before the full melt pool forms, as this causes tunnelling and wastes wax.',
      },
      {
        q: 'How do I store candles in Indian humidity and heat?',
        a: 'Store your candles in a cool, dry place away from direct sunlight, fans, and air-conditioner vents. Excessive heat (common in Ahmedabad summers!) can cause sweating or softening of soy wax. Keep candles covered when not in use to prevent dust accumulation. Do not refrigerate candles as moisture can cause cracking.',
      },
      {
        q: 'How often should I trim the wick?',
        a: 'Trim the wick to approximately 6mm (about ¼ inch) before every single burn. A long wick causes mushrooming, excess soot, and uneven burning. Use a wick trimmer or small scissors. This simple habit dramatically extends the life and quality of your candle.',
      },
      {
        q: 'Are your candles safe around children and pets?',
        a: 'Our candles are made from non-toxic soy wax and are generally safe for use in homes with children and pets. However, never leave a burning candle unattended, and always keep lit candles out of reach of children and animals. Place candles on a stable, heat-resistant surface. Keep away from curtains, fabrics, and flammable materials.',
      },
      {
        q: 'Can I reuse the glass jar once the candle is finished?',
        a: 'Yes! Our glass jar candles are designed with reuse in mind. Once the candle is finished, place the jar in the freezer for 2 hours — the remaining wax will shrink and pop out easily. Clean the jar with warm soapy water and reuse it as a pen holder, small planter, spice jar, or just a decorative piece. Very desi jugaad!',
      },
    ],
  },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.06 });
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

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        open ? 'border-purple-300 shadow-md shadow-purple-100' : 'border-purple-100 hover:border-purple-200'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 px-6 py-5 text-left bg-white hover:bg-purple-50/40 transition-colors duration-200 group"
      >
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mt-0.5"
        >
          <span className="text-white text-[10px] font-bold">{String(index + 1).padStart(2, '0')}</span>
        </span>
        <span
          className="flex-1 text-sm sm:text-base font-semibold text-gray-800 leading-snug"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-purple-400 flex-shrink-0 mt-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        style={{
          maxHeight: open ? '400px' : '0',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.4s ease, opacity 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <div className="px-6 pb-5 pt-0 bg-white">
          <div className="ml-10 pl-0">
            <div className="w-full h-px bg-gradient-to-r from-purple-100 to-pink-100 mb-4" />
            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
            >
              {a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveCategory(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      for (const cat of [...categories].reverse()) {
        const el = document.getElementById(cat.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveCategory(cat.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCategories = searchQuery.trim()
    ? categories.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (f) =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.faqs.length > 0)
    : categories;

  const totalFAQs = categories.reduce((acc, c) => acc + c.faqs.length, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');
        body { background: linear-gradient(135deg, #fdf4ff 0%, #faf5ff 40%, #fce7f3 100%); background-attachment: fixed; }
        html { scroll-padding-top: 90px; }
        .toc-link { transition: all 0.2s ease; }
        .search-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(168,85,247,0.15); }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-100/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-pink-400" />
            <span className="text-purple-500 text-xs uppercase tracking-[0.3em] font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Help Centre
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400" />
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Questions</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
            Got questions about our handcrafted candles, shipping across India, or how to care for your purchase? We've got you covered.
          </p>

          {/* Stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              `${totalFAQs} Questions Answered`,
              'Ahmedabad, Gujarat',
              'Pan-India Shipping',
            ].map((m) => (
              <span
                key={m}
                className="bg-white border border-purple-100 text-gray-500 text-xs px-4 py-1.5 rounded-full shadow-sm"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search questions… e.g. COD, Diwali order, candle care"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input w-full bg-white border border-purple-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category quick nav */}
          {!searchQuery && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollTo(cat.id)}
                    className="flex items-center gap-1.5 bg-white border border-purple-200 text-purple-600 text-xs px-4 py-1.5 rounded-full shadow-sm hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 font-medium"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Icon className="w-3 h-3" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-10 lg:gap-16 items-start">

          {/* ── STICKY TOC ── */}
          {!searchQuery && (
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Topics
                </p>
                <nav className="space-y-1">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const active = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => scrollTo(cat.id)}
                        className={`toc-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-semibold border border-purple-200'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-purple-500' : 'text-gray-400'}`} />
                        <span className="truncate">{cat.title}</span>
                        {active && <ChevronRight className="w-3 h-3 ml-auto text-purple-400" />}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Still have questions?</p>
                  <a
                    href="mailto:support@cosmicvirtues.com"
                    className="flex items-center gap-2 text-purple-600 text-xs font-medium hover:text-purple-800 transition-colors"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    support@cosmicvirtues.com
                  </a>
                </div>
              </div>

              {/* Candle tip card */}
              <div className="mt-4 bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <p className="text-xs font-semibold text-orange-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>Candle Tip</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                  Always let your candle burn for at least 2 hours on the first use to prevent tunnelling.
                </p>
              </div>

              {/* Secure badge */}
              <div className="mt-4 bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-semibold text-purple-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>Made in Ahmedabad</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                  Every product is handcrafted with love at our studio in Ahmedabad, Gujarat. 🇮🇳
                </p>
              </div>
            </aside>
          )}

          {/* ── FAQ SECTIONS ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Search results banner */}
            {searchQuery && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl px-6 py-4 flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <p className="text-sm text-purple-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {filteredCategories.reduce((a, c) => a + c.faqs.length, 0)} result(s) for{' '}
                  <span className="font-semibold">"{searchQuery}"</span>
                </p>
              </div>
            )}

            {filteredCategories.length === 0 && (
              <div className="bg-white border border-purple-100 rounded-2xl p-12 text-center">
                <p className="text-4xl mb-4">🕯️</p>
                <p className="text-gray-700 font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>No results found</p>
                <p className="text-sm text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                  Try a different search term, or email us at support@cosmicvirtues.com
                </p>
              </div>
            )}

            {filteredCategories.map((cat, catIdx) => {
              const Icon = cat.icon;
              return (
                <AnimatedSection key={cat.id} delay={catIdx * 60}>
                  <div
                    id={cat.id}
                    className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden"
                  >
                    {/* Category header */}
                    <div className="flex items-center gap-4 px-7 py-6 border-b border-gray-50">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {cat.label}
                        </p>
                        <h2
                          className="text-xl sm:text-2xl font-bold text-gray-900"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {cat.title}
                        </h2>
                      </div>
                      <span
                        className="ml-auto text-xs font-semibold text-gray-300 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 hidden sm:block"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {cat.faqs.length} Q&amp;A
                      </span>
                    </div>

                    {/* FAQ items */}
                    <div className="px-7 py-6 space-y-3">
                      {cat.faqs.map((faq, i) => (
                        <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}

            {/* ── BOTTOM CTA ── */}
            {!searchQuery && (
              <AnimatedSection delay={categories.length * 60}>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-10 shadow-xl shadow-purple-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Didn't find your answer?
                      </p>
                      <h3
                        className="text-2xl sm:text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        We're happy to help
                      </h3>
                      <p className="text-white/75 text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                        Drop us an email or DM us on Instagram — we reply within 24 hours.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                      <a
                        href="mailto:support@cosmicvirtues.com"
                        className="flex items-center gap-2 bg-white text-purple-700 px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-purple-50 transition-all duration-300 shadow-lg whitespace-nowrap"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <Mail className="w-4 h-4" />
                        Email Us
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
            )}

            {/* ── FOOTER LINKS ── */}
            <AnimatedSection delay={(categories.length + 1) * 60}>
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
                    onClick={() => navigate('/refund')}
                    className="text-xs text-purple-500 hover:text-purple-700 transition-colors"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Refund Policy
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

export default FAQ;