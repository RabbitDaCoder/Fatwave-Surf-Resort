import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import {
  Wifi,
  Car,
  Coffee,
  Waves,
  Music,
  Utensils,
  ShowerHead,
  Tv,
  Wind,
  Sun,
  ChevronRight,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

const amenitiesList = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Car, label: "Free Parking" },
  { icon: Coffee, label: "Coffee Bar" },
  { icon: Waves, label: "Beach Access" },
  { icon: Music, label: "Live DJ" },
  { icon: Utensils, label: "Restaurant" },
  { icon: ShowerHead, label: "Hot Shower" },
  { icon: Tv, label: "Cable TV" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Sun, label: "Rooftop Deck" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&h=500&fit=crop",
];

const thumbnailImages = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=150&fit=crop",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=200&h=150&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=200&h=150&fit=crop",
];

const houseRules = [
  "Check-in time is 2:00 PM and check-out time is 12:00 NN. Early check-in and late check-out may be arranged subject to availability and additional charges.",
  "A valid government-issued ID is required upon check-in for all guests. Foreign nationals must present a valid passport.",
  "Smoking is strictly prohibited in all indoor areas. Designated smoking areas are available on the property.",
  "Pets are not allowed on the premises unless prior arrangement has been made with management.",
  "Quiet hours are observed from 10:00 PM to 7:00 AM. Please be considerate of other guests.",
  "Swimming pool and beach areas are open from 6:00 AM to 10:00 PM. Children must be supervised at all times.",
  "The resort is not responsible for any loss or damage to personal belongings. Safety deposit boxes are available at the front desk.",
  "Any damage to resort property will be charged to the guest's account.",
  "Outside food and beverages are not allowed in the restaurant and bar areas.",
  "Management reserves the right to refuse service or accommodation to anyone who violates house rules or behaves inappropriately.",
];

const policyMenu = [
  { id: "terms", label: "Terms and Conditions" },
  { id: "payment", label: "Payment Policy" },
  { id: "cancellation", label: "Cancellation Policy" },
];

export default function About() {
  const [activePolicy, setActivePolicy] = useState("terms");

  return (
    <div className="min-h-screen bg-white">
      {/* 1. OUR STORY SECTION - Split Hero Layout */}
      <section className="py-20 md:py-28 px-4 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-ocean">
            <path
              fill="currentColor"
              d="M50 0 C60 20, 80 20, 100 50 C80 80, 60 80, 50 100 C40 80, 20 80, 0 50 C20 20, 40 20, 50 0Z"
            />
          </svg>
        </div>
        <div className="absolute bottom-40 right-20 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-sunset">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="order-2 md:order-1">
              <p className="text-sunset font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                About Us
              </p>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal font-bold mb-8 leading-tight">
                Our Story
              </h1>
              <div className="space-y-6 text-charcoal/70 font-body text-lg leading-relaxed">
                <p>
                  Nestled along the sun-kissed shores of La Union, Fatwave Surf
                  Resort was born from a simple dream: to create a sanctuary
                  where surfers and beach lovers could escape the chaos of city
                  life and reconnect with the rhythm of the ocean.
                </p>
                <p>
                  What started as a humble beach shack in 2009 has blossomed
                  into a beloved destination for travelers from around the
                  world. Our philosophy remains unchanged — offer warm Filipino
                  hospitality, celebrate the surf culture, and create memories
                  that last a lifetime. Whether you're catching your first wave
                  or your thousandth, you'll always find a home at Fatwave.
                </p>
              </div>
            </div>

            {/* Right Column - Image Collage */}
            <div className="order-1 md:order-2 relative">
              {/* Main Image */}
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=700&fit=crop"
                  alt="Fatwave Surf Resort Beach"
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-card"
                />
              </div>

              {/* Decorative Palm Tree */}
              <div className="absolute -top-8 -right-4 w-24 h-24 z-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <text x="50" y="60" textAnchor="middle" fontSize="60">
                    🌴
                  </text>
                </svg>
              </div>

              {/* Zigzag Decoration */}
              <div className="absolute -bottom-4 -left-4 w-20 h-8 z-0">
                <svg viewBox="0 0 80 20" className="w-full h-full text-sunny">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    d="M0 10 L10 5 L20 15 L30 5 L40 15 L50 5 L60 15 L70 5 L80 10"
                  />
                </svg>
              </div>

              {/* Flower Decoration */}
              <div className="absolute top-1/2 -left-8 w-16 h-16 z-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-sunset/60"
                >
                  <circle cx="50" cy="30" r="15" fill="currentColor" />
                  <circle cx="30" cy="50" r="15" fill="currentColor" />
                  <circle cx="70" cy="50" r="15" fill="currentColor" />
                  <circle cx="40" cy="70" r="15" fill="currentColor" />
                  <circle cx="60" cy="70" r="15" fill="currentColor" />
                  <circle cx="50" cy="50" r="12" fill="#F7B733" />
                </svg>
              </div>

              {/* Abstract Shape */}
              <div className="absolute -bottom-8 right-10 w-24 h-24 bg-ocean/10 rounded-full z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. AMENITIES SECTION - Layered Framed Card */}
      <section className="py-20 md:py-28 px-4 bg-[#E8E4F0] relative overflow-hidden">
        {/* Decorative Dotted Circle */}
        <div className="absolute top-20 right-10 w-40 h-40 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-ocean">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Framed Container */}
          <div className="relative">
            {/* Outer Border Frame */}
            <div className="absolute -inset-4 md:-inset-6 border-4 border-sunset/40 rounded-3xl" />

            {/* Inner Container */}
            <div className="relative bg-white rounded-2xl shadow-card-hover p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left - Image */}
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=500&fit=crop"
                    alt="Resort Amenities"
                    className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                  />
                </div>

                {/* Right - Content */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl text-ocean font-bold mb-6">
                    Amenities
                  </h2>

                  {/* Two Column Bullet List */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {amenitiesList.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <amenity.icon className="w-5 h-5 text-sunset shrink-0" />
                        <span className="text-charcoal/70 font-body text-sm">
                          {amenity.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-charcoal/60 font-body text-sm mb-6">
                    Everything you need for a perfect beach getaway, all under
                    one roof.
                  </p>

                  {/* Thumbnail Images */}
                  <div className="flex gap-3">
                    {thumbnailImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Resort view ${index + 1}`}
                        className="w-20 h-16 md:w-24 md:h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GALLERY STRIP */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={2}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="gallery-swiper"
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <style>{`
          .gallery-swiper .swiper-pagination {
            position: relative;
            margin-top: 24px;
          }
          .gallery-swiper .swiper-pagination-bullet {
            background: #1F4E79;
            opacity: 0.3;
            width: 10px;
            height: 10px;
          }
          .gallery-swiper .swiper-pagination-bullet-active {
            background: #F76C1E;
            opacity: 1;
          }
        `}</style>
      </section>

      {/* 4. HOUSE RULES SECTION */}
      <section className="py-20 md:py-28 px-4 bg-sand relative overflow-hidden">
        {/* Decorative Floral Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-ocean">
            <path
              fill="currentColor"
              d="M50 0 Q60 40, 100 50 Q60 60, 50 100 Q40 60, 0 50 Q40 40, 50 0Z"
            />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 w-40 h-40 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-sunset">
            <path
              fill="currentColor"
              d="M50 0 Q60 40, 100 50 Q60 60, 50 100 Q40 60, 0 50 Q40 40, 50 0Z"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-ocean font-bold mb-4">
              Fatwave Surf Resort House Rules
            </h2>
            <p className="text-charcoal/60 font-body max-w-2xl mx-auto">
              To ensure a pleasant stay for all our guests, we kindly ask that
              you observe the following house rules during your visit.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-[1fr_2.5fr] gap-8 md:gap-12">
            {/* Left - Policy Menu */}
            <div className="space-y-2">
              {policyMenu.map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => setActivePolicy(policy.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-body transition-all duration-300 flex items-center justify-between group ${
                    activePolicy === policy.id
                      ? "bg-ocean text-white"
                      : "bg-white text-charcoal hover:bg-ocean/10"
                  }`}
                >
                  {policy.label}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      activePolicy === policy.id
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Right - Rules Content */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
              <ol className="space-y-4">
                {houseRules.map((rule, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="font-heading font-bold text-sunset text-lg shrink-0">
                      {index + 1}.
                    </span>
                    <p className="text-charcoal/70 font-body leading-relaxed">
                      {rule}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Important Note */}
              <div className="mt-8 p-4 bg-sunny/10 rounded-xl border-l-4 border-sunny">
                <p className="text-charcoal/80 font-body italic">
                  <strong>Important Note:</strong> Management reserves the right
                  to update these rules at any time. Guests are encouraged to
                  check with the front desk for any changes or clarifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal font-bold mb-6">
            Want to check out our rooms?
          </h2>
          <p className="text-charcoal/60 font-body text-lg mb-10 max-w-xl mx-auto">
            Discover our range of accommodations, from cozy surf rooms to
            luxurious beachfront suites. Find your perfect stay at Fatwave.
          </p>
          <Link
            to="/rooms"
            className="inline-block bg-sunset hover:bg-sunset-dark text-white px-10 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300 shadow-button hover:shadow-lg transform hover:-translate-y-1"
          >
            EXPLORE ROOMS
          </Link>
        </div>
      </section>
    </div>
  );
}
