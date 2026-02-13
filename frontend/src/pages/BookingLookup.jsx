import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, FileSearch, ArrowRight } from "lucide-react";
import { useBookingStore } from "../stores";

const BookingLookup = () => {
  const navigate = useNavigate();
  const { fetchBooking, isLoading } = useBookingStore();
  const [bookingReference, setBookingReference] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingReference.trim()) {
      toast.error("Please enter a booking reference");
      return;
    }

    const booking = await fetchBooking(bookingReference.trim().toUpperCase());

    if (booking) {
      navigate(`/booking/success/${bookingReference.trim().toUpperCase()}`);
    } else {
      toast.error("Booking not found. Please check your booking reference.");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-sand">
      {/* Hero Section */}
      <div className="relative h-64 bg-ocean overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean to-ocean-light opacity-80" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Find Your Booking
          </h1>
          <p className="text-lg text-white/80">
            Enter your booking reference to view or manage your reservation
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-xl mx-auto">
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ocean/10 flex items-center justify-center">
                <FileSearch className="w-8 h-8 text-ocean" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">
                Look Up Your Reservation
              </h2>
              <p className="text-gray-600">
                Your booking reference was sent to your email when you booked.
                It looks like:{" "}
                <span className="font-mono font-medium">FW-2026-XXXXX</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">Booking Reference</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={bookingReference}
                    onChange={(e) =>
                      setBookingReference(e.target.value.toUpperCase())
                    }
                    placeholder="Enter your booking reference"
                    className="input pl-12 font-mono uppercase tracking-wider"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 spinner border-white border-t-transparent" />
                    Searching...
                  </>
                ) : (
                  <>
                    Find My Booking
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Can't find your confirmation number? Check your email inbox and
                spam folder. If you still need help, contact us at{" "}
                <a
                  href="mailto:info@fatwavesurfresort.com"
                  className="text-ocean hover:underline"
                >
                  info@fatwavesurfresort.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingLookup;
