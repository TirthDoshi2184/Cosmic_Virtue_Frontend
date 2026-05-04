import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Leaf, Package, Heart, ArrowRight, Star, Flame, Globe, Users } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  const values = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Natural & Pure',
      desc: 'Every ingredient we use is carefully sourced — free from toxins, synthetics and harmful chemicals. What touches your home should be as clean as nature intended.',
      gradient: 'from-purple-600 to-pink-600',
      bg: 'from-white to-purple-50',
      border: 'border-purple-100',
    },
    {
      icon: <Flame className="w-6 h-6" />,
      title: 'Handcrafted Always',
      desc: 'Every candle is handpoured in small batches by skilled artisans. No factory lines, no shortcuts — just honest craftsmanship in every pour.',
      gradient: 'from-pink-600 to-rose-500',
      bg: 'from-white to-pink-50',
      border: 'border-pink-100',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Eco Conscious',
      desc: 'From soy wax to recyclable packaging, every decision we make considers the planet. We believe beautiful things should leave a gentle footprint.',
      gradient: 'from-purple-600 to-indigo-600',
      bg: 'from-white to-purple-50',
      border: 'border-purple-100',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Made with Intention',
      desc: 'Each scent is designed to evoke a feeling — calm, joy, warmth. We do not just make candles; we craft experiences that transform your everyday moments.',
      gradient: 'from-pink-600 to-purple-600',
      bg: 'from-white to-pink-50',
      border: 'border-pink-100',
    },
  ];

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: '10K+', label: 'Happy Customers' },
    { icon: <Sparkles className="w-5 h-5" />, value: '50+', label: 'Fragrances' },
    { icon: <Package className="w-5 h-5" />, value: '500+', label: 'Products' },
    { icon: <Star className="w-5 h-5" />, value: '4.9★', label: 'Average Rating' },
  ];

  const soulPillars = [
    { symbol: '🕯️', heading: 'The Flame', body: 'Every candle we pour is a small act of defiance against the rush — a quiet insistence that stillness matters.' },
    { symbol: '🌸', heading: 'The Scent', body: 'Fragrance is memory, emotion and medicine all at once. We blend each note with the care of someone who truly understands that.' },
    { symbol: '💜', heading: 'The Intent', body: 'Nothing leaves our studio without purpose. We ask: will this bring someone comfort? If yes — it earns its place.' },
    { symbol: '🌿', heading: 'The Earth', body: 'We borrow from nature and give back thoughtfully. Every material choice is weighed against its footprint on the planet.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .value-card { transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .value-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(147,51,234,0.13); }
        .value-icon { transition: transform 0.3s ease; }
        .value-card:hover .value-icon { transform: scale(1.12) rotate(6deg); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeInUp 0.65s ease both; }

        .story-quote {
          padding-left: 1.25rem;
          border-left: 3px solid #c084fc;
        }

        .soul-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: default;
        }
        .soul-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 60px rgba(147,51,234,0.18);
        }

        .floating-orb {
          animation: floatOrb 6s ease-in-out infinite;
        }
        .floating-orb-2 {
          animation: floatOrb 8s ease-in-out infinite reverse;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.04); }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 22s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track:hover { animation-play-state: paused; }

        .founder-img-wrap {
          position: relative;
        }
        .founder-img-wrap::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 999px;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          z-index: 0;
          opacity: 0.25;
          filter: blur(16px);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50" style={{ fontFamily: "'Montserrat', sans-serif" }}>

        {/* HERO */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 sm:py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto fade-up">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10 bg-white/50"></span>
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs uppercase tracking-[0.3em]">Our Story</span>
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="h-px w-10 bg-white/50"></span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Born from a love of<br /><span className="italic font-normal">light & fragrance</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ fontWeight: 300 }}>
              Cosmic Virtue began as a deeply personal journey — and grew into a mission to bring handcrafted, toxin-free candles and intentional living into homes across India and beyond.
            </p>
          </div>
        </div>

        {/* BRAND STORY */}
        <section className="overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[520px]">
            <div className="lg:w-1/2 relative overflow-hidden flex items-center justify-center">
  <img
    src="https://res.cloudinary.com/ddpvtobbh/image/upload/v1776347746/Bottle_Main_Photo_kkytos.png"
    alt="Our Studio"
    className="w-full h-auto object-contain transition-transform duration-700 ease-in-out hover:scale-105"
  />

  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
</div>

            <div className="lg:w-1/2 bg-white flex items-center px-8 sm:px-14 py-14">
              <div className="max-w-lg">
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-purple-300"></span>
                  <span className="text-purple-500 text-xs uppercase tracking-[0.25em] font-semibold">Who We Are</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  A small studio with a big cosmic dream
                </h2>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4" style={{ fontWeight: 300 }}>
                  COSMIC VIRTUE began from a very personal chapter of my life. There were times when I felt overwhelmed, stretched thin, and emotionally exhausted. In those moments, I truly understood how important self-care and mental well-being are — not as trends, but as survival.
                </p>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-5" style={{ fontWeight: 300 }}>
                  In a world that constantly pushes us to do more, be more, and rush faster, I longed for something that gently reminded us to <em>slow down</em>. To pause. To breathe. To come back to ourselves.
                </p>
                <div className="story-quote my-5">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    "I created COSMIC VIRTUE for people like us — the ones who carry a lot, who feel deeply, who give so much to others that they sometimes forget themselves."
                  </p>
                </div>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4" style={{ fontWeight: 300 }}>
                  Every product we create carries intention. Not just fragrance, not just luxury — but comfort. A quiet moment. A sense of safety. A reminder that you are allowed to rest, even if it's just for a few peaceful minutes at the end of a long day.
                </p>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6" style={{ fontWeight: 300 }}>
                  We believe healing begins within. Aroma is more than a scent — it is a feeling, an invisible thread that connects the physical to something deeper. It grounds you. It lifts you. It brings you home to yourself.
                </p>
                <p className="text-purple-600 text-xs font-bold mb-7 uppercase tracking-widest">
                  ✦ Luxury living with soul &nbsp;·&nbsp; Soothe your space. Heal your spirit.
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wide hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-200"
                >
                  Explore Our Collection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BELIEFS STRIP */}
        <div className="bg-white border-y border-purple-100 py-8 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🌿', label: 'Self-care is necessary' },
              { icon: '🧠', label: 'Mental health deserves space' },
              { icon: '🕯️', label: 'Environment shapes how we feel' },
              { icon: '✨', label: 'Healing begins within' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">{stat.icon}</div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 sm:space-y-28">

          {/* VALUES */}
          <section>
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-pink-400"></span>
                <span className="text-purple-500 text-xs uppercase tracking-[0.25em] font-semibold">What We Stand For</span>
                <span className="h-px w-10 bg-gradient-to-r from-pink-400 to-purple-400"></span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Core Values</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto" style={{ fontWeight: 300 }}>
                The principles that guide every decision we make — from sourcing ingredients to packing your order
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className={`value-card bg-gradient-to-br ${v.bg} border ${v.border} rounded-2xl p-7 sm:p-8`}>
                  <div className={`value-icon w-14 h-14 bg-gradient-to-br ${v.gradient} rounded-full flex items-center justify-center text-white mb-5 shadow-lg`}>{v.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontWeight: 300 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── THE SOUL OF COSMIC VIRTUE (replaces team) ── */}
          <section className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div className="floating-orb absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 blur-3xl" />
              <div className="floating-orb-2 absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-30 blur-3xl" />
            </div>

            <div className="relative bg-gradient-to-br from-[#1a0533] to-[#2d0a4e] rounded-3xl overflow-hidden">
              {/* Top label */}
              <div className="text-center pt-14 pb-8 px-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="h-px w-10 bg-purple-400/50"></span>
                  <span className="text-purple-300 text-xs uppercase tracking-[0.3em] font-semibold">The Heart Behind the Brand</span>
                  <span className="h-px w-10 bg-purple-400/50"></span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  The Soul of<br /><span className="italic font-normal text-pink-300">Cosmic Virtue</span>
                </h2>
                <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto" style={{ fontWeight: 300 }}>
                  A brand is not just its products — it is the intention, the emotion and the people it was built for.
                </p>
              </div>

{/* Founder spotlight */}
<div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-8 sm:px-14 pb-12 lg:pb-16">
  {/* Founder visual */}
  <div className="flex-shrink-0 flex flex-col items-center">
    <div className="founder-img-wrap relative">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 blur-lg opacity-40 scale-110" />
      {/* Dashed orbit ring */}
      <div className="absolute inset-[-10px] rounded-full border border-dashed border-purple-400/30 animate-spin" style={{ animationDuration: '18s' }} />
      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-2xl relative z-10 border-4 border-white/10">
        <span className="text-white text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>BS</span>
      </div>
    </div>
    <div className="mt-6 text-center">
      <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Brinza Soneji</p>
      <p className="text-pink-300 text-xs uppercase tracking-widest font-semibold mt-1">Founder · Chandler · Dreamer</p>
      <p className="text-purple-300/50 text-xs mt-1 flex items-center justify-center gap-1">
        <span>📍</span> Ahmedabad, India
      </p>
    </div>
  </div>

  {/* Founder note */}
  <div className="flex-1 max-w-2xl">
    {/* Decorative quote mark */}
    <div className="mb-2">
      <span
        className="text-7xl leading-none bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent select-none"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        "
      </span>
    </div>
    <p
      className="text-white/85 text-base sm:text-lg leading-relaxed italic mb-5"
      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
    >
      I didn't set out to build a business. I set out to find something that helped me breathe again. Cosmic Virtue is my answer to every overwhelming day, every silent burnout, every moment I wished someone had reminded me that rest is not a reward — it is a right.
    </p>
    <p className="text-white/50 text-sm leading-relaxed mb-7" style={{ fontWeight: 300 }}>
      Built in Ahmedabad, carried by heart — this brand is for everyone who needs a small, sacred pause. Every candle we create is poured with that prayer.
    </p>
    {/* Tags */}
    <div className="flex flex-wrap gap-3">
      {['🕯️ Handpoured in Ahmedabad', '🌿 Toxin-free always', '💜 Born from healing'].map((tag, i) => (
        <span
          key={i}
          className="text-xs px-4 py-2 rounded-full border font-medium"
          style={{
            background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(236,72,153,0.10))',
            borderColor: 'rgba(192,132,252,0.25)',
            color: 'rgba(233,213,255,0.80)',
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
</div>
              {/* Divider */}
              <div className="mx-8 sm:mx-14 border-t border-white/10" />

              {/* Soul pillars */}
              <div className="px-8 sm:px-14 py-12">
                <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-semibold text-center mb-10">Four pillars we live by</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {soulPillars.map((p, i) => (
                    <div
                      key={i}
                      className="soul-card bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 rounded-2xl p-6 text-center"
                    >
                      <span className="text-4xl block mb-4">{p.symbol}</span>
                      <h4 className="text-white font-bold text-base mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{p.heading}</h4>
                      <p className="text-white/55 text-xs leading-relaxed" style={{ fontWeight: 300 }}>{p.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrolling manifesto ticker */}
              <div className="overflow-hidden border-t border-white/10 py-5 bg-white/5">
                <div className="marquee-track select-none">
                  {[...Array(2)].map((_, rep) => (
                    <div key={rep} className="flex items-center">
                      {[
                        'REST IS NOT A REWARD',
                        '✦',
                        'SLOW DOWN ON PURPOSE',
                        '✦',
                        'HEALING BEGINS WITHIN',
                        '✦',
                        'LIGHT THE CANDLE',
                        '✦',
                        'YOU DESERVE A QUIET MOMENT',
                        '✦',
                        'SOOTHE YOUR SPACE',
                        '✦',
                        'LUXURY WITH SOUL',
                        '✦',
                      ].map((word, j) => (
                        <span
                          key={j}
                          className={`mx-6 text-xs uppercase tracking-[0.3em] font-semibold whitespace-nowrap ${
                            word === '✦' ? 'text-pink-400' : 'text-white/40'
                          }`}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIAL */}
          <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 shadow-xl p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-28 h-28 bg-purple-200 rounded-full blur-2xl opacity-40 pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-pink-200 rounded-full blur-2xl opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />))}
              </div>
              <blockquote className="text-xl sm:text-2xl lg:text-3xl text-gray-800 italic leading-relaxed mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                "Cosmic Virtue candles have completely transformed the ambience of my home. The fragrance, the quality, the packaging — everything feels so intentional and special."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">NS</div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Nishit Soneji</p>
                  <p className="text-gray-400 text-xs">✓ Verified Customer</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-white/70 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Ready to illuminate your space?</h2>
              <p className="text-white/80 text-sm sm:text-base mb-8 max-w-lg mx-auto" style={{ fontWeight: 300 }}>
                Browse our full collection of handcrafted, natural candles and find your perfect scent.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate('/products')} className="bg-white text-purple-700 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-purple-50 transition-all duration-300 shadow-lg flex items-center gap-2">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/contact')} className="border-2 border-white/60 text-white px-10 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default AboutUs;