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
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-24">

      {/* Main Footer */}
     <div className="bg-white rounded-t-3xl shadow-inner">
         <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4 text-gray-700">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Cosmic Virtue
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Handcrafted candles designed to bring warmth,
              relaxation and a little cosmic magic into your home.
            </p>

            <div className="mt-5 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <MapPin size={16} /> Mumbai, India
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} /> support@cosmicvirtue.com
              </p>
            </div>
          </div>


          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                "All Candles",
                "Scented",
                "Decorative",
                "Bath Collection",
                "Best Sellers",
                "New Arrivals",
              ].map((item) => (
                <li key={item}>
                  <a className="hover:text-pink-500 transition cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {[
                "About Us",
                "Contact",
                "FAQs",
                "Shipping Policy",
                "Returns",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a className="hover:text-pink-500 transition cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated ✨</h3>

            <p className="text-sm text-gray-600 mb-4">
              Get new arrivals & exclusive offers first.
            </p>

            <div className="flex bg-white rounded-xl shadow-sm overflow-hidden">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-4 py-2 outline-none text-sm"
              />
              <button className="bg-pink-500 text-white px-4 hover:bg-pink-600 transition">
                Subscribe
              </button>
            </div>

            {/* Social */}
            <div className="flex gap-4 mt-5 text-lg text-gray-600">
              <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />
              <FaFacebookF className="hover:text-pink-500 cursor-pointer transition" />
              <FaTwitter className="hover:text-pink-500 cursor-pointer transition" />
              <FaPinterestP className="hover:text-pink-500 cursor-pointer transition" />
            </div>
          </div>
        </div>


        {/* Bottom bar */}
        <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            © 2026 Cosmic Virtue • Made with <Heart size={14} className="text-pink-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
