import { useEffect, Suspense, lazy } from "react";
import { NavLink } from "react-router-dom";
import {
  Waves,
  Sun,
  Palmtree,
  Star,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Quote,
} from "lucide-react";
import { useRoomsStore } from "../stores";
import RoomCard from "../components/RoomCard";
import Loading from "../components/Loading";

// Lazy load 3D components for better performance
const HeroBackground3D = lazy(
  () => import("../components/3d/HeroBackground3D"),
);
const Carousel3D = lazy(() => import("../components/3d/Carousel3D"));

const Home = () => {
  const { rooms, isLoading, fetchRooms } = useRoomsStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // 3D Carousel items
  const carouselItems = [
    {
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      title: "Pristine Beaches",
      subtitle: "San Juan, La Union",
    },
    {
      image:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800",
      title: "World-Class Surfing",
      subtitle: "Waves for all skill levels",
    },
    {
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      title: "Luxury Accommodations",
      subtitle: "Wake up to ocean views",
    },
    {
      image:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
      title: "Tropical Paradise",
      subtitle: "Your escape awaits",
    },
    {
      image:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
      title: "Unforgettable Sunsets",
      subtitle: "Golden hour magic",
    },
    {
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      title: "Beachfront Dining",
      subtitle: "Fresh local cuisine",
    },
  ];

  const features = [
    {
      icon: Waves,
      title: "World-Class Waves",
      description:
        "Access to the best surf breaks right at your doorstep. Perfect waves for all skill levels.",
    },
    {
      icon: Sun,
      title: "Tropical Paradise",
      description:
        "Experience year-round sunshine, pristine beaches, and breathtaking sunsets.",
    },
    {
      icon: Palmtree,
      title: "Beachfront Living",
      description:
        "Wake up to ocean views in our beautifully designed accommodations steps from the sand.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "California, USA",
      rating: 5,
      text: "Best surf trip of my life! The waves were incredible and the staff made us feel like family. Already planning our return trip.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    {
      name: "James K.",
      location: "Sydney, Australia",
      rating: 5,
      text: "Fatwave exceeded all expectations. Perfect waves every day, amazing food, and the most comfortable beds I've ever slept in.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      name: "Emma L.",
      location: "London, UK",
      rating: 5,
      text: "A hidden gem! The beachfront bungalow was pure paradise. I didn't want to leave. 10/10 would recommend!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
  ];

  return (
    <div>
      {/* Hero Section with 3D Background */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920)",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean/70 via-ocean/50 to-ocean/80" />

        {/* 3D Background Layer */}
        <Suspense fallback={null}>
          <HeroBackground3D className="z-[1] opacity-80" />
        </Suspense>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <span className="inline-block text-sunny font-nav text-lg mb-4 animate-fade-in">
            Welcome to Paradise
          </span>
          <h1 className="font-accent text-5xl md:text-7xl lg:text-8xl mb-6 animate-slide-up">
            Fatwave Surf Resort
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-body animate-slide-up">
            Where the waves meet paradise. Experience world-class surfing,
            tropical luxury, and unforgettable adventures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <NavLink to="/rooms" className="btn btn-primary btn-lg">
              Book Your Stay
            </NavLink>
            <NavLink to="/rooms" className="btn btn-white btn-lg">
              Explore Rooms
            </NavLink>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-sand">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sunset font-nav font-medium">
              Why Choose Us
            </span>
            <h2 className="section-title mt-2">The Fatwave Experience</h2>
            <p className="section-subtitle">
              More than just a place to stay – it's where memories are made and
              adventures begin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-tropical flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Experience Carousel */}
      <section className="relative py-20 bg-gradient-to-b from-ocean via-ocean-dark to-charcoal overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="text-sunny font-nav font-medium">
              Explore in 3D
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-2 text-white">
              Experience Paradise
            </h2>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto">
              Immerse yourself in our world-class resort. Drag to explore.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="h-[500px] flex items-center justify-center">
              <Loading />
            </div>
          }
        >
          <Carousel3D items={carouselItems} />
        </Suspense>

        {/* Decorative wave overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-20 text-white"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,100 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="section">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <span className="text-sunset font-nav font-medium">
                Accommodations
              </span>
              <h2 className="section-title mt-2">Featured Rooms</h2>
            </div>
            <NavLink
              to="/rooms"
              className="mt-4 md:mt-0 flex items-center gap-2 text-ocean font-nav font-medium hover:text-sunset transition-colors"
            >
              View All Rooms <ChevronRight className="w-5 h-5" />
            </NavLink>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.slice(0, 3).map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Surf Experience Section */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-ocean/80" />

        <div className="relative z-10 container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="text-sunny font-nav font-medium">
                The Surf Life
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mt-2 mb-6">
                Ride the Waves of Your Dreams
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Fatwave Surf Resort sits on one of the world's most consistent
                surf breaks. Whether you're a beginner looking to catch your
                first wave or an experienced surfer chasing barrels, our
                location offers perfect conditions year-round.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Beginner to advanced surf lessons",
                  "Board rentals and repair services",
                  "Surf forecasting and guide services",
                  "Yoga and fitness for surfers",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-sunny flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-ocean" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <NavLink to="/rooms" className="btn btn-primary">
                Start Your Adventure
              </NavLink>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400"
                alt="Surfing"
                className="rounded-2xl shadow-xl w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=400"
                alt="Beach"
                className="rounded-2xl shadow-xl w-full h-48 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
                alt="Beach"
                className="rounded-2xl shadow-xl w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400"
                alt="Sunset"
                className="rounded-2xl shadow-xl w-full h-48 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sunset font-nav font-medium">
              Guest Reviews
            </span>
            <h2 className="section-title mt-2">What Our Guests Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8 relative">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-sunny/20" />

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-sunny text-sunny" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-heading font-bold text-charcoal">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="section bg-sand">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sunset font-nav font-medium">
              @FatwaveSurfResort
            </span>
            <h2 className="section-title mt-2">Follow Our Journey</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
              "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400",
              "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400",
              "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?w=400",
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
              "https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=400",
              "https://images.unsplash.com/photo-1501949997128-2fdb9f6428f1?w=400",
              "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400",
            ].map((image, index) => (
              <a
                key={index}
                href="#"
                className="aspect-square overflow-hidden rounded-xl group"
              >
                <img
                  src={image}
                  alt={`Instagram ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-sunset opacity-90" />

        <div className="relative z-10 container-custom text-center text-white">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready for Paradise?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your stay at Fatwave Surf Resort and experience the vacation of
            a lifetime. The waves are waiting.
          </p>
          <NavLink
            to="/rooms"
            className="btn bg-white text-sunset hover:bg-sand btn-lg"
          >
            Book Now
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default Home;
