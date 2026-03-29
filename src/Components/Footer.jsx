import {
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@300;400;600&display=swap');
      `}</style>

      <footer className="mt-16" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* ── NEWSLETTER BANNER ── */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-10 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-purple-100 text-xs uppercase tracking-widest font-semibold mb-2">Stay in the loop</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Get Exclusive Offers ✨
            </h3>
            <p className="text-purple-100 text-sm mb-6" style={{ fontWeight: 300 }}>
              New arrivals, special discounts and cosmic updates — straight to your inbox.
            </p>
            <div className="flex max-w-md mx-auto overflow-hidden rounded-xl shadow-xl">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none bg-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
              <button className="bg-gray-900 text-white px-6 text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN FOOTER ── */}
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

              {/* ── Brand ── */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <img src="https://res.cloudinary.com/ddpvtobbh/image/upload/v1772228242/Logo_fybl1d.jpg" alt="Cosmic Virtue" className="h-12 w-auto object-contain rounded-full shadow-sm" />
                  <h2
                    className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Cosmic Virtue
                  </h2>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontWeight: 300 }}>
                  Handcrafted candles designed to bring warmth, relaxation and a little cosmic magic into your home.
                </p>

                <div className="space-y-2.5">
                  {[
                    { icon: <MapPin className="w-4 h-4 flex-shrink-0" />, text: 'Ahmedabad, Gujarat, India' },
                    { icon: <Phone className="w-4 h-4 flex-shrink-0" />, text: '+91 63538 26286' },
                    { icon: <Mail className="w-4 h-4 flex-shrink-0" />, text: 'cosmicvirtue07@gmail.com' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-gray-500">
                      <span className="text-purple-500">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                  {/* Social icons */}
                  <div className="flex items-center gap-3 mt-6">
                    {[
                      { icon: <FaInstagram className="w-4 h-4" />, label: 'Instagram' },
                      {icon : <FaWhatsapp className="w-4 h-4" />, label:"Whatsapp"}
                    ].map((s, i) => (
                      <button
                        key={i}
                        aria-label={s.label}
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:border-transparent transition-all duration-200"
                      >
                        {s.icon}
                      </button>
                    ))}
                  </div>
                </div>

              {/* ── Shop ── */}
{/* ── Shop ── */}
<div>
  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">Shop</h3>
  <ul className="space-y-3">
    {[
      { label: 'All Products',    href: '/products' },
      { label: 'Categories',      href: '/categories' },
      { label: 'Wishlist',        href: '/wishlist' },
      { label: 'Cart',            href: '/cart' },
      { label: 'Checkout',        href: '/checkout' },
      { label: 'Order History',   href: '/order-success' },
    ].map((item) => (
      <li key={item.label}>
        <a
          href={item.href}
          className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1.5 group"
          style={{ fontWeight: 300 }}
        >
          <span className="w-1 h-1 rounded-full bg-purple-300 group-hover:bg-purple-600 transition-colors flex-shrink-0"></span>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</div>
              {/* ── Support ── */}
<div>
  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">Support</h3>
  <ul className="space-y-3">
    {[
      { label: 'About Us',        href: '/about' },
      { label: 'Contact',         href: '/contact' },
      { label: 'FAQs',            href: '/contact' },
      { label: 'Terms & Conditions', href: '/term' },
      { label: 'Returns',         href: '/returns' },
      { label: 'Privacy Policy',  href: '/privacy' },
    ].map((item) => (
      <li key={item.label}>
        <a
          href={item.href}
          className="text-sm text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-1.5 group"
          style={{ fontWeight: 300 }}
        >
          <span className="w-1 h-1 rounded-full bg-purple-300 group-hover:bg-purple-600 transition-colors flex-shrink-0"></span>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</div>
              {/* ── Why Us ── */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">Why Cosmic Virtue</h3>
                <div className="space-y-4">
                  {[
                    { emoji: '🌿', title: '100% Natural', desc: 'No toxins, no synthetics' },
                    { emoji: '🕯️', title: 'Handcrafted', desc: 'Made with love, every batch' },
                    { emoji: '📦', title: 'Eco Packaging', desc: 'Zero plastic, fully recyclable' },
                    { emoji: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-base flex-shrink-0 mt-0.5">{item.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{item.title}</p>
                        <p className="text-xs text-gray-400" style={{ fontWeight: 300 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="border-t border-gray-100 py-5 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                © 2026 Cosmic Virtue • Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> in India
              </p>
              <div className="flex items-center gap-4">
                {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map((item, i) => (
                  <a key={i} className="text-xs text-gray-400 hover:text-purple-600 transition-colors cursor-pointer">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}