import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Calendar,
  Music,
  Heart,
  Sparkles,
  PartyPopper,
  Briefcase,
  Mail,
  Sun,
  Clock,
  MapPin,
  ChevronRight,
  Mic2,
  Waves,
  GlassWater,
  Users,
} from "lucide-react";

// Featured events for the hero carousel
const featuredEvents = [
  {
    id: 1,
    title: "Sundown Club",
    subtitle: "Where sunsets meet music & cocktails",
    date: "Every Weekend",
    time: "4:00 PM – Late",
    discount: "Happy Hour 4-6 PM",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=500&fit=crop",
    bgColor: "bg-gradient-to-br from-pink-100 via-lavender-50 to-coral-50",
  },
  {
    id: 2,
    title: "Full Moon Party",
    subtitle: "Dance under the stars by the sea",
    date: "Feb 28, 2026",
    time: "8:00 PM – 2:00 AM",
    discount: "Early Bird: ₱500 entry",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=500&fit=crop",
    bgColor: "bg-gradient-to-br from-lavender-100 via-pink-50 to-sand",
  },
  {
    id: 3,
    title: "Sunset Acoustic",
    subtitle: "Live local artists every Friday",
    date: "Every Friday",
    time: "5:30 PM – 9:00 PM",
    discount: "Free Entry",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop",
    poster:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=500&fit=crop",
    bgColor: "bg-gradient-to-br from-coral-50 via-sunset/10 to-pink-50",
  },
];

// Upcoming events calendar
const upcomingEvents = [
  {
    date: "Feb 21",
    day: "Fri",
    title: "Acoustic Sunset Sessions",
    time: "5:30 PM",
    category: "Live Music",
  },
  {
    date: "Feb 22",
    day: "Sat",
    title: "DJ Night: Tropical House",
    time: "8:00 PM",
    category: "DJ Night",
  },
  {
    date: "Feb 28",
    day: "Fri",
    title: "Full Moon Beach Party",
    time: "8:00 PM",
    category: "Special Event",
  },
  {
    date: "Mar 8",
    day: "Sat",
    title: "International Women's Day Brunch",
    time: "10:00 AM",
    category: "Celebration",
  },
  {
    date: "Mar 15",
    day: "Sat",
    title: "Surf Competition After-Party",
    time: "6:00 PM",
    category: "Special Event",
  },
];

// Private event types
const privateEvents = [
  {
    icon: Heart,
    title: "Sunset Receptions",
    description: "Intimate celebrations with golden hour views",
  },
  {
    icon: PartyPopper,
    title: "Birthday Parties",
    description: "Beachfront celebrations with full catering",
  },
  {
    icon: Briefcase,
    title: "Corporate Gatherings",
    description: "Team building & brand activations",
  },
  {
    icon: Sparkles,
    title: "Special Occasions",
    description: "Anniversaries, proposals & milestones",
  },
];

// Seasonal events
const seasonalEvents = [
  { emoji: "🎄", title: "Holiday Parties", period: "Dec" },
  { emoji: "🏄", title: "Surf Fest", period: "Jan-Feb" },
  { emoji: "☀️", title: "Summer Kickoff", period: "Apr" },
  { emoji: "🍹", title: "Cocktail Nights", period: "Year-round" },
];

// Lifestyle gallery
const lifestyleGallery = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&h=300&fit=crop",
];

export default function Events() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="min-h-screen bg-sand">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO CAROUSEL - Sundown Club / Featured Events
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-bullet-custom",
            bulletActiveClass: "swiper-bullet-active-custom",
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          className="events-hero-swiper"
        >
          {featuredEvents.map((event, index) => (
            <SwiperSlide key={event.id}>
              <div
                className={`${event.bgColor} min-h-[85vh] relative overflow-hidden`}
              >
                {/* Decorative shapes */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-lavender-200/30 rounded-full blur-3xl" />

                {/* Decorative wave SVG */}
                <svg
                  className="absolute bottom-0 left-0 w-full h-32 text-sand/50"
                  viewBox="0 0 1440 120"
                  preserveAspectRatio="none"
                >
                  <path
                    fill="currentColor"
                    d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,70 1440,80 L1440,120 L0,120 Z"
                  />
                </svg>

                <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
                  {/* Left: Event Poster Card */}
                  <div className="relative order-2 lg:order-1">
                    <div className="relative mx-auto lg:mx-0 w-72 md:w-80 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                      <img
                        src={event.poster}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Dark overlay with floral/tropical feel */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

                      {/* Poster content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="text-white">
                          <p className="font-body text-sm text-white/70 uppercase tracking-widest mb-2">
                            Fatwave presents
                          </p>
                          <h3 className="font-accent text-3xl mb-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Decorative floral overlay */}
                      <div className="absolute top-4 right-4 w-20 h-20 opacity-20">
                        <svg viewBox="0 0 100 100" className="text-white">
                          <circle cx="50" cy="50" r="20" fill="currentColor" />
                          <circle cx="30" cy="30" r="10" fill="currentColor" />
                          <circle cx="70" cy="30" r="10" fill="currentColor" />
                          <circle cx="30" cy="70" r="10" fill="currentColor" />
                          <circle cx="70" cy="70" r="10" fill="currentColor" />
                        </svg>
                      </div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-coral-200/50 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-sunset/30 rounded-full blur-lg" />
                  </div>

                  {/* Right: Event Details */}
                  <div className="order-1 lg:order-2 text-center lg:text-left">
                    <p className="font-body text-coral-600 uppercase tracking-widest text-sm mb-4">
                      Featured Event
                    </p>
                    <h1 className="font-accent text-5xl md:text-7xl text-charcoal mb-4">
                      {event.title}
                    </h1>
                    <p className="font-heading text-xl md:text-2xl text-charcoal/70 mb-8">
                      {event.subtitle}
                    </p>

                    {/* Event info badges */}
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Calendar className="w-4 h-4 text-ocean" />
                        <span className="font-body text-charcoal">
                          {event.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Clock className="w-4 h-4 text-ocean" />
                        <span className="font-body text-charcoal">
                          {event.time}
                        </span>
                      </div>
                    </div>

                    {/* Discount/highlight badge */}
                    <div className="inline-block bg-gradient-sunset text-white px-6 py-3 rounded-full font-heading font-semibold shadow-lg mb-8">
                      {event.discount}
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <Link
                        to="/contact"
                        className="bg-charcoal text-white px-8 py-4 rounded-full font-heading font-semibold hover:bg-ocean transition-colors duration-300 flex items-center gap-2"
                      >
                        Reserve a Spot
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                      <button className="border-2 border-charcoal text-charcoal px-8 py-4 rounded-full font-heading font-semibold hover:bg-charcoal hover:text-white transition-all duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom pagination styles */}
        <style>{`
          .events-hero-swiper .swiper-pagination {
            bottom: 30px !important;
          }
          .swiper-bullet-custom {
            width: 10px;
            height: 10px;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            display: inline-block;
            margin: 0 5px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .swiper-bullet-active-custom {
            background: #f97316;
            width: 24px;
            border-radius: 10px;
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DJ NIGHTS & LIVE MUSIC
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl text-charcoal font-bold">
                  DJ Nights & Live Music
                </h2>
              </div>

              <p className="text-charcoal/70 font-body text-lg mb-8 leading-relaxed">
                Every weekend, Fatwave transforms into La Union's hottest
                beachfront party destination. Local DJs and guest performers
                bring the beats while you dance under the stars with sand
                between your toes.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: Mic2,
                    title: "Friday Acoustic Sessions",
                    desc: "Live local artists, chill vibes",
                  },
                  {
                    icon: Music,
                    title: "Saturday DJ Sets",
                    desc: "Tropical house, deep beats",
                  },
                  {
                    icon: Sun,
                    title: "Sunset Sessions",
                    desc: "Golden hour grooves daily",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-sand/50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-coral-600" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-charcoal">
                        {item.title}
                      </h4>
                      <p className="text-charcoal/60 font-body text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  "Resort Guests",
                  "Walk-ins Welcome",
                  "Surf Crowd",
                  "Travelers",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-lavender-100 text-lavender-700 rounded-full text-sm font-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
                    alt="DJ performing"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop"
                    alt="Beach party"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop"
                    alt="Crowd dancing"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop"
                    alt="Night party"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          UPCOMING EVENTS - Editorial Calendar Style
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-sand">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Calendar className="w-12 h-12 text-ocean mx-auto mb-4" />
            <h2 className="font-heading text-3xl md:text-4xl text-charcoal font-bold mb-4">
              Upcoming Events
            </h2>
            <p className="text-charcoal/60 font-body">
              Mark your calendar for these can't-miss experiences
            </p>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex items-center gap-6 group border border-transparent hover:border-coral-200"
              >
                {/* Date block */}
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 bg-gradient-sunset rounded-xl flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-body uppercase opacity-80">
                      {event.day}
                    </span>
                    <span className="text-lg font-heading font-bold">
                      {event.date.split(" ")[1]}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/50 font-body mt-1">
                    {event.date.split(" ")[0]}
                  </p>
                </div>

                {/* Event info */}
                <div className="flex-grow">
                  <span className="inline-block px-3 py-1 bg-lavender-100 text-lavender-700 text-xs rounded-full font-body mb-2">
                    {event.category}
                  </span>
                  <h3 className="font-heading text-xl text-charcoal font-semibold group-hover:text-ocean transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-charcoal/60 font-body text-sm flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0 hidden md:block">
                  <Link
                    to="/contact"
                    className="px-6 py-3 border-2 border-charcoal text-charcoal rounded-full font-heading font-semibold hover:bg-charcoal hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    Reserve
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PARTY AT OURS - CTA Section with Lavender Wave Pattern
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 bg-lavender-100 overflow-hidden">
        {/* Decorative wave patterns */}
        <div className="absolute inset-0 opacity-30">
          <svg
            className="absolute bottom-0 left-0 w-full h-48 text-lavender-200"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100 L1440,200 L0,200 Z"
            />
          </svg>
          <svg
            className="absolute top-0 right-0 w-full h-48 text-lavender-200 rotate-180"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,100 C240,50 480,150 720,100 C960,50 1200,150 1440,100 L1440,200 L0,200 Z"
            />
          </svg>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-coral-200/30 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Sparkles className="w-12 h-12 text-coral-500 mx-auto mb-6" />
          <h2 className="font-accent text-4xl md:text-5xl text-charcoal mb-6">
            Party at Ours
          </h2>
          <p className="text-charcoal/70 font-body text-lg mb-10 max-w-2xl mx-auto">
            Whether it's a sunset celebration, birthday bash, or corporate
            retreat — Fatwave is your beachfront venue. Indoor and outdoor
            spaces, in-house catering, and customizable setups.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-sunset text-white px-10 py-4 rounded-full font-heading font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Let's Party
            <PartyPopper className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRIVATE & SPECIAL EVENTS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl text-charcoal font-bold mb-4">
              Private & Special Events
            </h2>
            <p className="text-charcoal/60 font-body max-w-2xl mx-auto">
              From intimate sunset receptions to brand activations — we've got
              the beachfront venue and the vibe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privateEvents.map((event, index) => (
              <div
                key={index}
                className="bg-sand rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <event.icon className="w-8 h-8 text-coral-500" />
                </div>
                <h3 className="font-heading text-xl text-charcoal font-semibold mb-3">
                  {event.title}
                </h3>
                <p className="text-charcoal/60 font-body text-sm">
                  {event.description}
                </p>
              </div>
            ))}
          </div>

          {/* Venue advantages */}
          <div className="mt-12 bg-gradient-to-r from-pink-50 via-lavender-50 to-coral-50 rounded-3xl p-8 md:p-12">
            <h3 className="font-heading text-2xl text-charcoal font-bold text-center mb-8">
              Why Fatwave?
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                { icon: MapPin, label: "Beachfront Location" },
                { icon: Sun, label: "Indoor + Outdoor Areas" },
                { icon: GlassWater, label: "In-house Dining & Bar" },
                { icon: Users, label: "Customizable Setup" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <item.icon className="w-8 h-8 text-ocean" />
                  <span className="font-body text-charcoal/70">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SEASONAL & THEMED EVENTS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-sand">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-charcoal font-bold mb-4">
              Seasonal & Themed Events
            </h2>
            <p className="text-charcoal/60 font-body">
              Special celebrations throughout the year
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {seasonalEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-full px-8 py-4 flex items-center gap-4 shadow-card hover:shadow-card-hover hover:scale-105 transition-all duration-300"
              >
                <span className="text-3xl">{event.emoji}</span>
                <div>
                  <h4 className="font-heading font-semibold text-charcoal">
                    {event.title}
                  </h4>
                  <p className="text-charcoal/50 text-sm font-body">
                    {event.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LIFESTYLE GALLERY STRIP
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {lifestyleGallery.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden"
            >
              <img
                src={image}
                alt={`Event lifestyle ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-charcoal relative overflow-hidden">
        {/* Decorative tropical silhouettes */}
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
          <svg viewBox="0 0 100 100" className="text-white">
            <path
              fill="currentColor"
              d="M50,100 Q30,80 20,50 Q10,20 50,0 Q40,30 45,50 Q50,70 50,100 Z"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 transform scale-x-[-1]">
          <svg viewBox="0 0 100 100" className="text-white">
            <path
              fill="currentColor"
              d="M50,100 Q30,80 20,50 Q10,20 50,0 Q40,30 45,50 Q50,70 50,100 Z"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Mail className="w-14 h-14 text-coral-400 mx-auto mb-6" />
          <h2 className="font-accent text-4xl md:text-5xl text-white mb-6">
            Let's Plan Your Event
          </h2>
          <p className="text-white/70 font-body text-lg mb-10 max-w-2xl mx-auto">
            Contact our events team to discuss your vision and get a customized
            quote. We'll make your beachfront celebration unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:inigo@fatwavesurfresort.net"
              className="bg-gradient-sunset text-white px-8 py-4 rounded-full font-heading font-semibold hover:shadow-button transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Events Team
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-heading font-semibold hover:bg-white hover:text-charcoal transition-all duration-300"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
