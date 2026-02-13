import { useEffect, useState, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CheckCircle2,
  Download,
  Mail,
  CalendarDays,
  Users,
  Building,
  MapPin,
  Printer,
  Share2,
  Home,
  Copy,
  Eye,
  X,
} from "lucide-react";
import { useBookingStore } from "../stores";
import Loading from "../components/Loading";
import BookingReceipt from "../components/BookingReceipt";
import { downloadReceiptPDF } from "@/lib/pdfGenerator";

const BookingSuccess = () => {
  const { bookingReference } = useParams();
  const { currentBooking, isLoading, error, fetchBooking, sendReceipt } =
    useBookingStore();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  // Ref for the receipt component (used for PDF generation)
  const receiptRef = useRef(null);

  useEffect(() => {
    fetchBooking(bookingReference);
  }, [bookingReference, fetchBooking]);

  const handleSendReceipt = async () => {
    setIsSendingEmail(true);
    const result = await sendReceipt(bookingReference);

    if (result.success) {
      toast.success("Receipt sent to your email!");
    } else {
      toast.error(result.message);
    }
    setIsSendingEmail(false);
  };

  const handleDownloadReceipt = async () => {
    // Show the receipt preview first, then download
    setShowReceiptPreview(true);
    setIsDownloading(true);

    try {
      // Wait a moment for the receipt to render
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (!receiptRef.current) {
        throw new Error("Receipt not ready");
      }

      await downloadReceiptPDF(receiptRef.current, bookingReference);
      toast.success("Receipt downloaded!");
      setShowReceiptPreview(false);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  const copyConfirmation = () => {
    navigator.clipboard.writeText(bookingReference);
    setCopied(true);
    toast.success("Booking reference copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) return <Loading fullScreen />;

  if (error || !currentBooking) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-sand">
        <div className="text-center card p-12 max-w-md">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn't find a booking with this confirmation number.
          </p>
          <NavLink to="/" className="btn btn-primary">
            Go Home
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-sand min-h-screen">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for choosing Fatwave Surf Resort. We can't wait to host
              you!
            </p>
          </div>

          {/* Confirmation Card */}
          <div className="card overflow-hidden">
            {/* Confirmation Number Header */}
            <div className="bg-gradient-tropical p-6 text-center text-white">
              <p className="text-sm opacity-80 mb-1">Booking Reference</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl font-heading font-bold tracking-wider">
                  {currentBooking.bookingReference}
                </span>
                <button
                  onClick={copyConfirmation}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title="Copy"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-8">
              {/* Status Badge */}
              <div className="flex justify-center mb-8">
                <span
                  className={`badge text-sm px-4 py-2 ${
                    currentBooking.paymentStatus === "confirmed"
                      ? "badge-success"
                      : currentBooking.paymentStatus === "awaiting_payment"
                        ? "badge-warning"
                        : "badge-error"
                  }`}
                >
                  Status:{" "}
                  {currentBooking.paymentStatus === "awaiting_payment"
                    ? "Awaiting Payment"
                    : currentBooking.paymentStatus.charAt(0).toUpperCase() +
                      currentBooking.paymentStatus.slice(1)}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Guest Info */}
                <div>
                  <h3 className="font-heading font-bold text-charcoal mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-ocean" />
                    Guest Information
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p>
                      <span className="font-medium text-charcoal">Name:</span>{" "}
                      {currentBooking.guestName}
                    </p>
                    <p>
                      <span className="font-medium text-charcoal">Email:</span>{" "}
                      {currentBooking.guestEmail}
                    </p>
                    <p>
                      <span className="font-medium text-charcoal">Guests:</span>{" "}
                      {currentBooking.guests}
                    </p>
                  </div>
                </div>

                {/* Stay Details */}
                <div>
                  <h3 className="font-heading font-bold text-charcoal mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-ocean" />
                    Stay Details
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p>
                      <span className="font-medium text-charcoal">Room:</span>{" "}
                      {currentBooking.room?.name}
                    </p>
                    <p>
                      <span className="font-medium text-charcoal">
                        Check-in:
                      </span>{" "}
                      {format(
                        new Date(currentBooking.checkIn),
                        "EEE, MMM d, yyyy",
                      )}
                    </p>
                    <p>
                      <span className="font-medium text-charcoal">
                        Check-out:
                      </span>{" "}
                      {format(
                        new Date(currentBooking.checkOut),
                        "EEE, MMM d, yyyy",
                      )}
                    </p>
                    <p>
                      <span className="font-medium text-charcoal">
                        Duration:
                      </span>{" "}
                      {currentBooking.nights} night(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {currentBooking.specialRequests && (
                <div className="mb-8 p-4 bg-sunny/10 rounded-xl">
                  <h4 className="font-medium text-charcoal mb-2">
                    Special Requests:
                  </h4>
                  <p className="text-gray-600 italic">
                    {currentBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between p-6 bg-ocean/5 rounded-xl mb-8">
                <span className="font-heading font-bold text-xl text-charcoal">
                  Total Paid
                </span>
                <span className="font-heading font-bold text-3xl text-ocean">
                  {formatPrice(currentBooking.totalPrice)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 spinner border-white border-t-transparent" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Receipt
                    </>
                  )}
                </button>

                <button
                  onClick={handleSendReceipt}
                  disabled={isSendingEmail}
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-5 h-5 spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Email Receipt
                    </>
                  )}
                </button>
              </div>

              {/* Preview Receipt Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowReceiptPreview(true)}
                  className="text-ocean hover:text-sunset transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview Receipt
                </button>
              </div>
            </div>
          </div>

          {/* Resort Info */}
          <div className="card p-6 mt-8">
            <h3 className="font-heading font-bold text-charcoal mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-ocean" />
              Resort Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sunset shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-charcoal">Address</p>
                  <p>123 Beach Road, Tropical Paradise</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sunset shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-charcoal">Email</p>
                  <p>info@fatwavesurfresort.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 text-ocean hover:text-sunset transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </NavLink>
          </div>
        </div>
      </div>

      {/* Hidden Receipt Component for PDF Generation */}
      <div
        style={{
          position: "fixed",
          left: showReceiptPreview ? "50%" : "-9999px",
          top: showReceiptPreview ? "50%" : "-9999px",
          transform: showReceiptPreview ? "translate(-50%, -50%)" : "none",
          zIndex: showReceiptPreview ? 9999 : -1,
          maxHeight: showReceiptPreview ? "90vh" : "auto",
          overflow: showReceiptPreview ? "auto" : "hidden",
          backgroundColor: showReceiptPreview ? "white" : "transparent",
          boxShadow: showReceiptPreview
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            : "none",
          borderRadius: showReceiptPreview ? "12px" : "0",
        }}
      >
        {currentBooking && currentBooking.room && (
          <BookingReceipt
            ref={receiptRef}
            booking={currentBooking}
            room={currentBooking.room}
          />
        )}
      </div>

      {/* Receipt Preview Modal Backdrop */}
      {showReceiptPreview && (
        <div
          className="fixed inset-0 bg-black/60 z-[9998]"
          onClick={() => !isDownloading && setShowReceiptPreview(false)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-[10000]"
            onClick={() => !isDownloading && setShowReceiptPreview(false)}
            disabled={isDownloading}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Modal Actions */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex gap-4">
            {isDownloading ? (
              <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                <div className="w-5 h-5 spinner border-ocean border-t-transparent" />
                <span className="text-charcoal font-medium">
                  Generating PDF...
                </span>
              </div>
            ) : (
              <>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setIsDownloading(true);
                    try {
                      await downloadReceiptPDF(
                        receiptRef.current,
                        bookingReference,
                      );
                      toast.success("Receipt downloaded!");
                      setShowReceiptPreview(false);
                    } catch (error) {
                      toast.error("Failed to download receipt");
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                  className="bg-ocean text-white px-6 py-3 rounded-full shadow-lg hover:bg-ocean/90 transition-colors flex items-center gap-2 font-medium"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReceiptPreview(false);
                  }}
                  className="bg-white text-charcoal px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Close Preview
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
