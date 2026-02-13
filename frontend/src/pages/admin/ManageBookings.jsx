import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  User,
  ChevronDown,
  X,
  Mail,
  Phone,
  KeyRound,
  Copy,
  Loader2,
} from "lucide-react";
import * as apiService from "../../services/api";
import { useAdminStore } from "../../stores";
import Loading from "../../components/Loading";

const ManageBookings = () => {
  const { bookings, isLoading, fetchBookings, updateBookingStatus } =
    useAdminStore();
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const result = await updateBookingStatus(bookingId, newStatus);

    if (result.success) {
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } else {
      toast.error(result.message);
    }
  };

  const handleDownloadPDF = async (bookingReference) => {
    try {
      const response = await apiService.downloadReceipt(bookingReference);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${bookingReference}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download receipt");
    }
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
    setGeneratedCode(null);
    setCodeCopied(false);
  };

  const handleGenerateCode = async () => {
    if (!selectedBooking) return;
    setIsGeneratingCode(true);
    try {
      const response = await apiService.getVerificationCode(
        selectedBooking._id,
      );
      setGeneratedCode(response.data.data.verificationCode);
      toast.success("Verification code retrieved!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to get verification code",
      );
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const statusOptions = [
    {
      value: "awaiting_payment",
      label: "Awaiting Payment",
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600 bg-red-50",
    },
    {
      value: "expired",
      label: "Expired",
      icon: Clock,
      color: "text-gray-600 bg-gray-50",
    },
  ];

  const getStatusOption = (status) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filters.status && booking.paymentStatus !== filters.status)
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !booking.bookingReference?.toLowerCase().includes(searchLower) &&
        !booking.guestName?.toLowerCase().includes(searchLower) &&
        !booking.guestEmail?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-charcoal">
          Manage Bookings
        </h1>
        <p className="text-gray-500">
          View and manage all reservation requests
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by confirmation #, guest name or email..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="input pr-10 min-w-[150px]"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(filters.status || filters.search) && (
            <button
              onClick={() =>
                setFilters({
                  status: "",
                  search: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="btn btn-outline flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOptions.map((status) => {
          const count = bookings.filter(
            (b) => b.status === status.value,
          ).length;
          const StatusIcon = status.icon;
          return (
            <button
              key={status.value}
              onClick={() =>
                setFilters({
                  ...filters,
                  status: filters.status === status.value ? "" : status.value,
                })
              }
              className={`card p-4 text-left transition-all ${
                filters.status === status.value ? "ring-2 ring-ocean" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-lg ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                </span>
                <span className="text-2xl font-heading font-bold">{count}</span>
              </div>
              <span className="text-sm text-gray-500">{status.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand border-b border-gray-200">
                <th className="text-left p-4 font-heading font-semibold text-charcoal">
                  Confirmation
                </th>
                <th className="text-left p-4 font-heading font-semibold text-charcoal">
                  Guest
                </th>
                <th className="text-left p-4 font-heading font-semibold text-charcoal">
                  Room
                </th>
                <th className="text-left p-4 font-heading font-semibold text-charcoal">
                  Dates
                </th>
                <th className="text-left p-4 font-heading font-semibold text-charcoal">
                  Total
                </th>
                <th className="text-left p-4 font-heading font-semibold text-charcoal">
                  Status
                </th>
                <th className="text-left p-4 font-heading font-semibold text-charcoal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No bookings found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusConfig = getStatusOption(booking.paymentStatus);
                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-gray-100 hover:bg-sand/30"
                    >
                      <td className="p-4">
                        <span className="font-mono font-medium text-ocean">
                          {booking.bookingReference}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-charcoal">
                            {booking.guestName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.guestEmail}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-charcoal">
                          {booking.room?.name || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>
                            {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                          </p>
                          <p className="text-gray-500">
                            to{" "}
                            {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-heading font-bold text-charcoal">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <select
                            value={booking.paymentStatus}
                            onChange={(e) =>
                              handleStatusUpdate(booking._id, e.target.value)
                            }
                            className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-sm font-medium cursor-pointer border-0 ${statusConfig.color}`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetails(booking)}
                            className="p-2 hover:bg-sand rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadPDF(booking.bookingReference)
                            }
                            className="p-2 hover:bg-sand rounded-lg transition-colors"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-heading font-bold text-charcoal">
                  Booking Details
                </h3>
                <p className="text-sm text-gray-500 font-mono">
                  {selectedBooking.bookingReference}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-sand rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusOption(selectedBooking.paymentStatus).color}`}
                >
                  {getStatusOption(selectedBooking.paymentStatus).label}
                </span>
              </div>

              {/* Guest Info */}
              <div className="card p-4 bg-sand/50">
                <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-ocean" />
                  Guest Information
                </h4>
                <div className="grid gap-2">
                  <p>
                    <strong>Name:</strong> {selectedBooking.guestName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedBooking.guestEmail}
                  </p>
                  {selectedBooking.specialRequests && (
                    <p>
                      <strong>Special Requests:</strong>{" "}
                      {selectedBooking.specialRequests}
                    </p>
                  )}
                </div>
              </div>

              {/* Room Info */}
              <div className="card p-4 bg-sand/50">
                <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-ocean" />
                  Room & Stay Details
                </h4>
                <div className="grid gap-2">
                  <p>
                    <strong>Room:</strong> {selectedBooking.room?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Guests:</strong> {selectedBooking.guests}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {format(
                      new Date(selectedBooking.checkIn),
                      "MMMM dd, yyyy",
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(selectedBooking.checkOut),
                      "MMMM dd, yyyy",
                    )}
                  </p>
                  <p>
                    <strong>Nights:</strong> {selectedBooking.nights}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="card p-4 bg-sand/50">
                <h4 className="font-heading font-semibold mb-3">
                  Payment Details
                </h4>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>Room Rate</span>
                    <span>
                      {formatPrice(selectedBooking.room?.currentPrice || 0)}
                      /night × {selectedBooking.nights} nights
                    </span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-ocean">
                      {formatPrice(selectedBooking.totalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Payment: Bank Transfer
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  Booked on:{" "}
                  {format(
                    new Date(selectedBooking.createdAt),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}
                </p>
                {selectedBooking.confirmedAt && (
                  <p>
                    Confirmed on:{" "}
                    {format(
                      new Date(selectedBooking.confirmedAt),
                      "MMMM dd, yyyy 'at' h:mm a",
                    )}
                  </p>
                )}
              </div>

              {/* Verification Code Section - Only for awaiting_payment bookings */}
              {selectedBooking.paymentStatus === "awaiting_payment" && (
                <div className="card p-4 bg-sunset/10 border border-sunset/30">
                  <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-sunset" />
                    Verification Code
                  </h4>
                  {generatedCode || selectedBooking.verificationCode ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-mono text-lg font-bold text-charcoal">
                          {generatedCode || selectedBooking.verificationCode}
                        </span>
                        <button
                          onClick={copyCode}
                          className="flex items-center gap-2 text-ocean hover:text-ocean-dark transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          {codeCopied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Share this code with the guest after they complete the
                        bank transfer. Expires at{" "}
                        {selectedBooking.expiresAt
                          ? format(
                              new Date(selectedBooking.expiresAt),
                              "MMM dd 'at' h:mm a",
                            )
                          : "N/A"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        View the verification code to share with the guest.
                      </p>
                      <button
                        onClick={handleGenerateCode}
                        disabled={isGeneratingCode}
                        className="btn bg-sunset hover:bg-sunset/90 text-white w-full flex items-center justify-center gap-2"
                      >
                        {isGeneratingCode ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4" />
                            View Verification Code
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() =>
                    handleDownloadPDF(selectedBooking.bookingReference)
                  }
                  className="flex-1 btn btn-outline flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 btn btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
