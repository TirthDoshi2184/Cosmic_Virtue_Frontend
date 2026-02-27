import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const result = await response.json();
      setCategories((result.data || []).filter(cat => cat.isactive === true));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-14 h-14 animate-spin text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loading Collections...
          </h2>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Something Went Wrong
          </h2>
          <p className="text-gray-500 text-sm mb-7" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {error}
          </p>
          <button
            onClick={fetchCategories}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .cat-card { transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .cat-card:hover { transform: translateY(-7px); box-shadow: 0 20px 50px rgba(147,51,234,0.14); }
        .cat-img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
        .cat-card:hover .cat-img { transform: scale(1.08); }
        .cat-arrow { transition: transform 0.25s ease, opacity 0.25s ease; opacity: 0; }
        .cat-card:hover .cat-arrow { transform: translateX(4px); opacity: 1; }
        .cat-overlay { transition: opacity 0.3s ease; opacity: 0; }
        .cat-card:hover .cat-overlay { opacity: 1; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* ── HERO HEADER ── */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 sm:py-20 px-4 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-white/50"></span>
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs uppercase tracking-[0.3em]">Browse</span>
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="h-px w-8 bg-white/50"></span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Collections
            </h1>
            <p
              className="text-white/80 text-sm sm:text-base max-w-md mx-auto"
              style={{ fontWeight: 300 }}
            >
              Discover a wide range of handcrafted candles &amp; wellness products across every category
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

          {/* Empty state */}
          {categories.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Package className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                No Categories Yet
              </h3>
              <p className="text-gray-500 text-sm" style={{ fontWeight: 300 }}>
                Collections will appear here once they are added
              </p>
            </div>
          ) : (
            <>
              {/* Count label */}
              <p className="text-sm text-gray-400 mb-8 font-medium">
                {categories.length} {categories.length === 1 ? 'collection' : 'collections'} available
              </p>

              {/* Categories grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className="cat-card bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="cat-img w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                          <Package className="w-14 h-14 text-purple-300" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="cat-overlay absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent">
                        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center">
                          <span
                            className="bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            View Products <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 sm:p-5">
                      <h3
                        className="text-sm sm:text-base font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {category.name}
                      </h3>

                      {category.description && (
                        <p
                          className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed"
                          style={{ fontWeight: 300 }}
                        >
                          {category.description}
                        </p>
                      )}

                      <div
                        className="flex items-center gap-1 text-purple-600 text-xs font-semibold uppercase tracking-wide"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Shop Now
                        <ArrowRight className="cat-arrow w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;