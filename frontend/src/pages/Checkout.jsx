import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  User,
  Mail,
  MessageSquare,
  MessageCircle,
  CalendarDays,
  Users,
  ChevronLeft,
  Shield,
  CheckCircle2,
  KeyRound,
  Banknote,
  Clock,
  Copy,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useRoomsStore, useBookingStore } from "../stores";
import Loading from "../components/Loading";

const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    selectedRoom,
    isLoading: roomLoading,
    fetchRoomBySlug,
  } = useRoomsStore();
  const {
    bookingDetails,
    setBookingDetails,
    createBooking,
    confirmBookingWithCode,
    isLoading: bookingLoading,
  } = useBookingStore();

  // Current step: "details" | "pending" | "confirm"
  const [step, setStep] = useState("details");
  const [pendingBooking, setPendingBooking] = useState(null);

  const [formData, setFormData] = useState({
    guestName: bookingDetails.guestName || "",
    guestEmail: bookingDetails.guestEmail || "",
    specialRequests: bookingDetails.specialRequests || "",
  });

  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRoomBySlug(slug);
  }, [slug, fetchRoomBySlug]);

  useEffect(() => {
    // Redirect if no dates selected
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
      navigate(`/rooms/${slug}`);
    }
  }, [bookingDetails, slug, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = "Name is required";
    }

    if (!formData.guestEmail.trim()) {
      newErrors.guestEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
      newErrors.guestEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Create pending booking
  const handleCreatePendingBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setBookingDetails(formData);

    const result = await createBooking(selectedRoom._id);

    if (result.success) {
      setPendingBooking(result.data);
      setConfirmEmail(formData.guestEmail);
      setStep("pending");
      toast.success(
        "Booking request submitted! Please contact live support to complete payment.",
      );
    } else {
      toast.error(result.message);
    }
  };

  // Step 2: Confirm booking with processing code
  const handleConfirmWithCode = async (e) => {
    e.preventDefault();

    if (!confirmationCode.trim()) {
      toast.error("Please enter your confirmation code");
      return;
    }

    if (!confirmEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const result = await confirmBookingWithCode(confirmationCode, confirmEmail);

    if (result.success) {
      toast.success("Booking confirmed successfully!");
      navigate(`/booking/success/${result.data.bookingReference}`);
    } else {
      toast.error(result.message);
    }
  };

  // Open live chat
  const openLiveChat = () => {
    if (window.smartsupp) {
      window.smartsupp("chat:show");
      window.smartsupp("chat:open");
    }
  };

  const copyBookingRef = () => {
    if (pendingBooking?.bookingReference) {
      navigator.clipboard.writeText(pendingBooking.bookingReference);
      setCopied(true);
      toast.success("Reference number copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateNights = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    const diffTime = Math.abs(
      new Date(bookingDetails.checkOut) - new Date(bookingDetails.checkIn),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const price =
      selectedRoom?.currentPrice || selectedRoom?.pricePerNight || 0;
    return nights * price;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (roomLoading || !selectedRoom) {
    return <Loading fullScreen />;
  }

  return (
    <div className="pt-20 bg-sand min-h-screen">
      <div className="container-custom py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/rooms/${slug}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-ocean mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to room details
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === "details"
                ? "bg-ocean text-white"
                : "bg-ocean/20 text-ocean"
            }`}
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              1
            </span>
            <span className="font-medium">Guest Details</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === "pending"
                ? "bg-sunset text-white"
                : step === "confirm"
                  ? "bg-sunset/20 text-sunset"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              2
            </span>
            <span className="font-medium">Payment</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === "confirm"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              3
            </span>
            <span className="font-medium">Confirm</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Guest Details Form */}
            {step === "details" && (
              <div className="card p-8">
                <h1 className="text-2xl font-heading font-bold text-charcoal mb-2">
                  Guest Information
                </h1>
                <p className="text-gray-500 mb-8">
                  Please provide your details to reserve this room
                </p>

                <form
                  onSubmit={handleCreatePendingBooking}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="label flex items-center gap-2">
                        <User className="w-4 h-4 text-ocean" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`input ${errors.guestName ? "input-error" : ""}`}
                      />
                      {errors.guestName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guestName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label flex items-center gap-2">
                        <Mail className="w-4 h-4 text-ocean" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="guestEmail"
                        value={formData.guestEmail}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={`input ${errors.guestEmail ? "input-error" : ""}`}
                      />
                      {errors.guestEmail && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guestEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-ocean" />
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requests or requirements..."
                        rows={4}
                        className="input resize-none"
                      />
                    </div>
                  </div>

                  {/* Payment Info Notice */}
                  <div className="bg-sunset/10 border border-sunset/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <Banknote className="w-8 h-8 text-sunset flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-bold text-charcoal mb-2">
                          Payment via Bank Transfer
                        </h3>
                        <p className="text-gray-600 text-sm">
                          After submitting your booking request, you'll receive
                          payment instructions via our live support. Once
                          payment is confirmed, you'll receive a confirmation
                          code to complete your reservation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn btn-primary w-full btn-lg"
                  >
                    {bookingLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      `Proceed to Payment - ${formatPrice(calculateTotal())}`
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    Your information is secure and encrypted
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Pending - Contact Support */}
            {step === "pending" && pendingBooking && (
              <div className="card p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-sunset/20 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-10 h-10 text-sunset" />
                  </div>
                  <h1 className="text-2xl font-heading font-bold text-charcoal mb-2">
                    Almost There!
                  </h1>
                  <p className="text-gray-600">
                    Your booking request has been submitted. Contact our live
                    support to complete your payment.
                  </p>
                </div>

                {/* Booking Reference */}
                <div className="bg-sand rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Your Booking Reference
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xl text-charcoal">
                      {pendingBooking.bookingReference}
                    </span>
                    <button
                      onClick={copyBookingRef}
                      className="flex items-center gap-2 text-ocean hover:text-ocean-dark transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4 mb-8">
                  <h2 className="font-heading font-bold text-charcoal">
                    How to Complete Your Booking
                  </h2>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-ocean text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal">
                        Chat with Live Support
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Click the button below to open live chat and provide
                        your booking reference number.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-ocean text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal">
                        Complete Payment
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Our team will provide bank account details for the
                        transfer. Complete the payment as instructed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-ocean text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal">
                        Receive Confirmation Code
                      </h3>
                      <p className="text-gray-600 text-sm">
                        After payment verification, you'll receive a
                        confirmation code (e.g., FW-2026-1234) to finalize your
                        booking.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Button */}
                <button
                  onClick={openLiveChat}
                  className="btn btn-primary w-full btn-lg mb-4 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat with Live Support
                </button>

                {/* Already have code */}
                <button
                  onClick={() => setStep("confirm")}
                  className="btn btn-outline w-full"
                >
                  I already have a confirmation code
                </button>
              </div>
            )}

            {/* Step 3: Enter Confirmation Code */}
            {step === "confirm" && (
              <div className="card p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <KeyRound className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-heading font-bold text-charcoal mb-2">
                    Enter Confirmation Code
                  </h1>
                  <p className="text-gray-600">
                    Enter the confirmation code provided by our support team to
                    complete your booking.
                  </p>
                </div>

                <form onSubmit={handleConfirmWithCode} className="space-y-6">
                  <div>
                    <label className="label flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-ocean" />
                      Confirmation Code *
                    </label>
                    <input
                      type="text"
                      value={confirmationCode}
                      onChange={(e) =>
                        setConfirmationCode(e.target.value.toUpperCase())
                      }
                      placeholder="FW-2026-XXXX"
                      className="input text-center text-lg font-mono tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="label flex items-center gap-2">
                      <Mail className="w-4 h-4 text-ocean" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder="The email used for your booking"
                      className="input"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Must match the email used when creating your booking
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn btn-primary w-full btn-lg"
                  >
                    {bookingLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Confirming...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Confirm Booking
                      </span>
                    )}
                  </button>

                  {/* Error Alert */}
                  {errors.confirm && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>{errors.confirm}</p>
                    </div>
                  )}

                  {/* Back button */}
                  {pendingBooking && (
                    <button
                      type="button"
                      onClick={() => setStep("pending")}
                      className="btn btn-outline w-full"
                    >
                      Back to Instructions
                    </button>
                  )}

                  {/* Need help */}
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      Don't have a code?{" "}
                      <button
                        type="button"
                        onClick={openLiveChat}
                        className="text-ocean hover:underline font-medium"
                      >
                        Contact Live Support
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-heading font-bold text-charcoal mb-6">
                Booking Summary
              </h2>

              {/* Room Info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img
                  src={
                    selectedRoom.images?.[0] ||
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200"
                  }
                  alt={selectedRoom.name}
                  className="w-24 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-heading font-bold text-charcoal">
                    {selectedRoom.name}
                  </h3>
                  <span className="text-sm text-gray-500 capitalize">
                    {selectedRoom.category.replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-ocean" />
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-medium">
                      {bookingDetails.checkIn &&
                        format(
                          new Date(bookingDetails.checkIn),
                          "EEE, MMM d, yyyy",
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-ocean" />
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-medium">
                      {bookingDetails.checkOut &&
                        format(
                          new Date(bookingDetails.checkOut),
                          "EEE, MMM d, yyyy",
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-ocean" />
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium">
                      {bookingDetails.guests} guest(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {formatPrice(
                      selectedRoom.currentPrice || selectedRoom.pricePerNight,
                    )}{" "}
                    × {calculateNights()} nights
                  </span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-heading font-bold text-lg text-charcoal">
                  Total
                </span>
                <span className="font-heading font-bold text-2xl text-ocean">
                  {formatPrice(calculateTotal())}
                </span>
              </div>

              {/* Status Badge */}
              {step !== "details" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl ${
                      step === "pending"
                        ? "bg-sunset/10 text-sunset"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {step === "pending" ? (
                      <>
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Awaiting Payment</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Ready to Confirm</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
