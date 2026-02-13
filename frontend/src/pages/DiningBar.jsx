import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Utensils,
  Wine,
  Coffee,
  Clock,
  Music,
  Sun,
  Sunset,
  IceCream,
  UtensilsCrossed,
  Palmtree,
  Download,
  ChevronRight,
} from "lucide-react";

const venues = [
  { id: "lagula", label: "La Gula", icon: IceCream },
  { id: "kitchen", label: "Fatwave Kitchen", icon: UtensilsCrossed },
  { id: "sunset", label: "Sunset Shack", icon: Sunset },
  { id: "tiki", label: "Tiki Bikini", icon: Palmtree },
];

const lagulaGallery = [
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
];

const kitchenMenu = [
  {
    category: "Breakfast",
    items: ["Longsilog", "Tapsilog", "Pancakes", "Omelettes"],
  },
  {
    category: "Rice Meals",
    items: ["Sinigang", "Kare-Kare", "Sisig", "Lechon Kawali"],
  },
  {
    category: "Seafood",
    items: ["Grilled Fish", "Shrimp Sinigang", "Calamares", "Fish Fillet"],
  },
  {
    category: "Grilled",
    items: ["BBQ Ribs", "Grilled Chicken", "Pork Belly", "Mixed Grill"],
  },
];

const tikiDrinks = [
  {
    name: "Blue Lagoon",
    price: 220,
    description: "Vodka, blue curacao, lime, sprite",
  },
  {
    name: "Mai Tai",
    price: 280,
    description: "Rum, orange curacao, lime, orgeat",
  },
  {
    name: "Piña Colada",
    price: 250,
    description: "Rum, coconut cream, pineapple",
  },
  {
    name: "Mango Mojito",
    price: 240,
    description: "Rum, mango, mint, lime, soda",
  },
  {
    name: "Tiki Punch",
    price: 300,
    description: "House special tropical blend",
  },
  {
    name: "Coconut Margarita",
    price: 260,
    description: "Tequila, coconut, lime",
  },
];

export default function DiningBar() {
  const [activeVenue, setActiveVenue] = useState("lagula");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-accent text-5xl md:text-7xl text-white drop-shadow-lg mb-6">
              Dining & Bar
            </h1>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-20 z-40 bg-white border-b border-sand-dark shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {venues.map((venue) => (
              <button
                key={venue.id}
                onClick={() => setActiveVenue(venue.id)}
                className={`flex items-center gap-2 px-6 py-4 font-heading font-semibold whitespace-nowrap transition-all duration-300 border-b-4 ${
                  activeVenue === venue.id
                    ? "border-sunset text-ocean"
                    : "border-transparent text-charcoal/60 hover:text-ocean hover:border-ocean/30"
                }`}
              >
                <venue.icon className="w-5 h-5" />
                {venue.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LA GULA SECTION */}
      {activeVenue === "lagula" && (
        <div className="animate-fade-in">
          {/* La Gula Hero */}
          <section className="py-20 md:py-28 px-4 bg-[#FDF6F0] relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 opacity-20">
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
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left - Content */}
                <div>
                  <p className="text-sunset font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                    Pastry Shop & Café
                  </p>
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal font-bold mb-6 leading-tight">
                    Indulge your sweet tooth at La Gula
                  </h2>
                  <div className="space-y-4 text-charcoal/70 font-body text-lg leading-relaxed mb-8">
                    <p>
                      <em>"La gula"</em> means gluttony in Spanish — and
                      perfectly describes the comforting joy of indulging in
                      desserts.
                    </p>
                    <p>
                      Run by one of Fatwave's owners and Executive Pastry Chef
                      Miguel Duyla, La Gula was the first brick-and-mortar
                      pastry shop in San Juan, La Union beachfront. The shop
                      serves decadent cakes, pastries, bread, homemade ice
                      cream, and coffee — all in a cozy, welcoming space.
                    </p>
                  </div>

                  {/* Operating Hours */}
                  <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-sunset" />
                      <h3 className="font-heading font-bold text-ocean">
                        Operating Hours
                      </h3>
                    </div>
                    <div className="space-y-2 text-charcoal/70 font-body">
                      <p>
                        <span className="font-semibold">
                          Monday to Thursday:
                        </span>{" "}
                        7:00 AM – 10:00 PM
                      </p>
                      <p>
                        <span className="font-semibold">Friday to Sunday:</span>{" "}
                        7:00 AM – 11:00 PM
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 bg-sunset hover:bg-sunset-dark text-white px-8 py-4 rounded-full font-heading font-semibold transition-all duration-300 shadow-button"
                  >
                    <Download className="w-5 h-5" />
                    Download Menu
                  </a>
                </div>

                {/* Right - Image */}
                <div className="relative">
                  <div className="relative z-10">
                    <img
                      src="https://images.unsplash.com/photo-1517433670267-30f41b34a6c6?w=600&h=600&fit=crop"
                      alt="La Gula Pastry Shop"
                      className="w-full h-[400px] md:h-[500px] object-cover rounded-full shadow-card-hover"
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-4 border-4 border-sunny/30 rounded-full z-0" />
                </div>
              </div>
            </div>
          </section>

          {/* La Gula Gallery */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {lagulaGallery.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-2xl overflow-hidden group"
                  >
                    <img
                      src={image}
                      alt={`La Gula ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dessert Banner */}
          <section className="relative h-[40vh] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1920&h=800&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-charcoal/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-accent text-4xl md:text-5xl text-white drop-shadow-lg mb-4">
                  Life is short, eat dessert first
                </h3>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* FATWAVE KITCHEN SECTION */}
      {activeVenue === "kitchen" && (
        <div className="animate-fade-in">
          <section className="py-20 md:py-28 px-4 bg-sand">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-sunset font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  All-Day Dining
                </p>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal font-bold mb-6">
                  Fatwave Kitchen
                </h2>
                <p className="text-charcoal/70 font-body text-lg max-w-2xl mx-auto">
                  Filipino comfort food and international favorites, served from
                  sunrise to sunset with ocean views and good vibes.
                </p>
              </div>

              {/* Menu Categories */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kitchenMenu.map((category, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-card"
                  >
                    <h3 className="font-heading text-xl text-ocean font-bold mb-4 pb-3 border-b border-sand-dark">
                      {category.category}
                    </h3>
                    <ul className="space-y-2">
                      {category.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-charcoal/70 font-body"
                        >
                          <span className="w-1.5 h-1.5 bg-sunset rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Kitchen Features */}
              <div className="mt-16 grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-heading text-lg text-ocean font-bold mb-2">
                    Breakfast
                  </h4>
                  <p className="text-charcoal/60 font-body text-sm">
                    6:00 AM - 10:30 AM
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-tropical rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-heading text-lg text-ocean font-bold mb-2">
                    Lunch & Dinner
                  </h4>
                  <p className="text-charcoal/60 font-body text-sm">
                    11:00 AM - 10:00 PM
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wine className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-heading text-lg text-ocean font-bold mb-2">
                    Cocktails
                  </h4>
                  <p className="text-charcoal/60 font-body text-sm">
                    All day until midnight
                  </p>
                </div>
              </div>

              {/* Download Menu */}
              <div className="text-center mt-12">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white px-8 py-4 rounded-full font-heading font-semibold transition-all duration-300"
                >
                  <Download className="w-5 h-5" />
                  Download Full Menu
                </a>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SUNSET SHACK SECTION */}
      {activeVenue === "sunset" && (
        <div className="animate-fade-in">
          {/* Happy Hour Hero */}
          <section className="relative py-20 md:py-32 px-4 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&h=1080&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/60 to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto">
              <div className="max-w-xl">
                <p className="text-sunny font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Sunset Shack
                </p>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
                  Happy Hour at the Fatwave Sundown Club
                </h2>
                <div className="space-y-4 text-white/90 font-body text-lg mb-8">
                  <p className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-sunny" />
                    Daily 4:00 PM – 6:00 PM
                  </p>
                  <p className="flex items-center gap-3">
                    <Wine className="w-5 h-5 text-sunny" />
                    Signature cocktails at 20% off
                  </p>
                  <p className="flex items-center gap-3">
                    <Sun className="w-5 h-5 text-sunny" />
                    Sunset views with pink and purple skies
                  </p>
                  <p className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-sunny" />
                    Live DJ sets every Friday & Saturday
                  </p>
                </div>
                <p className="text-white/70 font-body italic mb-8">
                  Party vibe from 4:00 PM to midnight
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-sunset hover:bg-sunset-dark text-white px-8 py-4 rounded-full font-heading font-semibold transition-all duration-300 shadow-button"
                >
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Decorative Quote */}
          <section className="py-20 px-4 bg-gradient-tropical text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="font-accent text-3xl md:text-4xl text-white mb-4">
                "There's no better place to watch the sun go down"
              </h3>
              <p className="text-white/80 font-body">
                — Every guest, every sunset
              </p>
            </div>
          </section>
        </div>
      )}

      {/* TIKI BIKINI SECTION */}
      {activeVenue === "tiki" && (
        <div className="animate-fade-in">
          <section className="py-20 md:py-28 px-4 bg-[#E8F4F0] relative overflow-hidden">
            {/* Decorative palm */}
            <div className="absolute top-10 left-10 text-6xl opacity-20">
              🌴
            </div>
            <div className="absolute bottom-10 right-10 text-6xl opacity-20">
              🥥
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-ocean font-heading font-semibold text-sm tracking-[0.2em] uppercase mb-4">
                  Beachside Bar
                </p>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal font-bold mb-6">
                  Tiki Bikini
                </h2>
                <p className="text-charcoal/70 font-body text-lg max-w-2xl mx-auto">
                  Island-inspired cocktails, tropical vibes, and the best
                  sunset-facing spot on the beach. Casual, vibrant, and
                  unforgettable.
                </p>
              </div>

              {/* Drinks Menu */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {tikiDrinks.map((drink, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading text-xl text-ocean font-bold group-hover:text-ocean-light transition-colors">
                        {drink.name}
                      </h3>
                      <span className="font-heading text-sunset font-bold text-lg">
                        {formatPrice(drink.price)}
                      </span>
                    </div>
                    <p className="text-charcoal/60 font-body text-sm">
                      {drink.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl mb-4">🍹</div>
                    <h4 className="font-heading text-lg text-ocean font-bold mb-2">
                      Tropical Cocktails
                    </h4>
                    <p className="text-charcoal/60 font-body text-sm">
                      Handcrafted island drinks
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl mb-4">🌅</div>
                    <h4 className="font-heading text-lg text-ocean font-bold mb-2">
                      Sunset Views
                    </h4>
                    <p className="text-charcoal/60 font-body text-sm">
                      Best seat on the beach
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl mb-4">🎶</div>
                    <h4 className="font-heading text-lg text-ocean font-bold mb-2">
                      Chill Vibes
                    </h4>
                    <p className="text-charcoal/60 font-body text-sm">
                      Perfect beach atmosphere
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-white font-bold mb-6">
            Reserve Your Experience
          </h2>
          <p className="text-white/70 font-body text-lg mb-8">
            For reservations, special events, and private dining inquiries, get
            in touch with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:inigo@fatwavesurfresort.net"
              className="bg-sunset hover:bg-sunset-dark text-white px-8 py-4 rounded-full font-heading font-semibold transition-all duration-300"
            >
              Email for Reservations
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-heading font-semibold hover:bg-white hover:text-charcoal transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
