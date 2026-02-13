import { useState, Suspense, lazy } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const FloatingBackground = lazy(
  () => import("../components/3d/FloatingBackground"),
);

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    details: ["Real Street, Barangay Real", "Basey, Samar, Philippines 6705"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["hello@fatwavesurf.com", "reservations@fatwavesurf.com"],
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Front Desk: 24/7", "Restaurant: 6AM - 10PM"],
  },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-sand relative overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <FloatingBackground variant="contact" />
      </Suspense>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-accent text-5xl md:text-7xl text-ocean mb-4">
            Get in Touch
          </h1>
          <p className="text-charcoal/70 font-body text-lg md:text-xl max-w-2xl mx-auto">
            Have questions about your stay? Want to book a custom experience?
            We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 bg-gradient-tropical rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading text-lg text-ocean font-bold mb-2">
                  {item.title}
                </h3>
                {item.details.map((detail, i) => (
                  <p key={i} className="text-charcoal/70 font-body text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-ocean font-bold">
                    Send Us a Message
                  </h2>
                  <p className="text-charcoal/60 font-body text-sm">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-charcoal font-body font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-sand-dark focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all font-body"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal font-body font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-sand-dark focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all font-body"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal font-body font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-sand-dark focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all font-body bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="reservation">Reservation Inquiry</option>
                    <option value="surf-lessons">Surf Lessons</option>
                    <option value="events">Events & Groups</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-charcoal font-body font-medium mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-sand-dark focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all font-body resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-sunset text-white py-4 rounded-xl font-heading font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-button transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-card h-[350px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.1234567890123!2d125.0!3d11.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDE4JzAwLjAiTiAxMjXCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fatwave Surf Resort Location"
                />
              </div>

              {/* Social Links */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-card">
                <h3 className="font-heading text-xl text-ocean font-bold mb-4">
                  Follow Our Adventures
                </h3>
                <p className="text-charcoal/70 font-body mb-6">
                  Stay connected and see what's happening at Fatwave
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-tropical rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-md"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-card">
                <h3 className="font-heading text-xl text-ocean font-bold mb-4">
                  Quick FAQ
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-body font-semibold text-charcoal mb-1">
                      What's the best time to visit?
                    </h4>
                    <p className="text-charcoal/70 font-body text-sm">
                      We have great waves year-round, but November to April
                      offers the best conditions for beginners.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-charcoal mb-1">
                      Do you offer airport transfers?
                    </h4>
                    <p className="text-charcoal/70 font-body text-sm">
                      Yes! We provide complimentary transfers from Tacloban
                      Airport for bookings of 3 nights or more.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-charcoal mb-1">
                      Are surf lessons included?
                    </h4>
                    <p className="text-charcoal/70 font-body text-sm">
                      Selected packages include lessons. Contact us for custom
                      packages tailored to your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-tropical rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-5 left-10 w-32 h-32 rounded-full bg-white animate-float" />
              <div
                className="absolute bottom-5 right-10 w-24 h-24 rounded-full bg-white animate-float"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-4xl text-white font-bold mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-white/80 font-body mb-8 max-w-xl mx-auto">
                Get exclusive offers, surf condition updates, and travel tips
                delivered straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-full font-body outline-none focus:ring-2 focus:ring-sunny"
                />
                <button
                  type="submit"
                  className="bg-sunset hover:bg-sunset-dark text-white px-8 py-3 rounded-full font-heading font-semibold transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
