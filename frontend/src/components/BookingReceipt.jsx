import { forwardRef } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

/**
 * Elegant Receipt Component for PDF Generation
 * Amanpulo-inspired minimalist design with Georgia font and warm cream tones
 */
const BookingReceipt = forwardRef(({ booking, room }, ref) => {
  if (!booking || !room) {
    return null;
  }

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights =
    booking.nights ||
    Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const pricePerNight =
    room.currentPrice || room.pricePerNight || booking.totalPrice / nights;

  // Handle guests - could be number or object
  const guestDisplay =
    typeof booking.guests === "object"
      ? `${booking.guests.adults} Adult${booking.guests.adults > 1 ? "s" : ""}${booking.guests.children > 0 ? `, ${booking.guests.children} Child${booking.guests.children > 1 ? "ren" : ""}` : ""}`
      : `${booking.guests} Guest${booking.guests > 1 ? "s" : ""}`;

  return (
    <div
      ref={ref}
      data-receipt
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "0",
        fontFamily: "'Georgia', serif",
        color: "#2c2a26",
        margin: "0 auto",
        backgroundColor: "#faf8f5",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "50px 50px 40px",
          borderBottom: "2px solid #d4c5a9",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "400",
            color: "#2c2a26",
            letterSpacing: "6px",
            textTransform: "uppercase",
            margin: "0",
          }}
        >
          Fatwave Surf Resort
        </h1>
        <p
          style={{
            fontSize: "12px",
            color: "#8b7355",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginTop: "10px",
          }}
        >
          Where the waves meet paradise
        </p>
      </div>

      {/* Content */}
      <div
        style={{
          backgroundColor: "#ffffff",
          margin: "40px 50px",
          padding: "40px",
          border: "1px solid #e8e4dd",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "#2c2a26",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Booking Confirmation
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b6458",
            fontSize: "14px",
            marginBottom: "35px",
          }}
        >
          Generated on {format(new Date(), "MMMM d, yyyy")}
        </p>

        {/* Confirmation Number */}
        <div
          style={{
            background: "#faf8f5",
            padding: "25px",
            textAlign: "center",
            margin: "0 0 35px 0",
            border: "1px solid #e8e4dd",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#8b7355",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0",
            }}
          >
            Confirmation Number
          </p>
          <p
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2c2a26",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "3px",
              marginTop: "10px",
            }}
          >
            {booking.bookingReference}
          </p>
        </div>

        {/* Guest Information */}
        <div style={{ marginBottom: "35px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#8b7355",
              letterSpacing: "2px",
              textTransform: "uppercase",
              borderBottom: "1px solid #e8e4dd",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            Guest Information
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#8b7355",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  margin: "0",
                }}
              >
                Full Name
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#2c2a26",
                  marginTop: "5px",
                }}
              >
                {booking.guestName}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#8b7355",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  margin: "0",
                }}
              >
                Email Address
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#2c2a26",
                  marginTop: "5px",
                }}
              >
                {booking.guestEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Reservation Details */}
        <div style={{ marginBottom: "35px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#8b7355",
              letterSpacing: "2px",
              textTransform: "uppercase",
              borderBottom: "1px solid #e8e4dd",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            Reservation Details
          </h3>
          <div style={{ borderTop: "1px solid #e8e4dd" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #e8e4dd",
              }}
            >
              <span style={{ color: "#8b7355" }}>Room</span>
              <span style={{ fontWeight: "500", color: "#2c2a26" }}>
                {room.name}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #e8e4dd",
              }}
            >
              <span style={{ color: "#8b7355" }}>Check-in</span>
              <span style={{ fontWeight: "500", color: "#2c2a26" }}>
                {format(checkInDate, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #e8e4dd",
              }}
            >
              <span style={{ color: "#8b7355" }}>Check-out</span>
              <span style={{ fontWeight: "500", color: "#2c2a26" }}>
                {format(checkOutDate, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #e8e4dd",
              }}
            >
              <span style={{ color: "#8b7355" }}>Duration</span>
              <span style={{ fontWeight: "500", color: "#2c2a26" }}>
                {nights} Night{nights > 1 ? "s" : ""}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
              }}
            >
              <span style={{ color: "#8b7355" }}>Guests</span>
              <span style={{ fontWeight: "500", color: "#2c2a26" }}>
                {guestDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{ marginBottom: "35px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#8b7355",
              letterSpacing: "2px",
              textTransform: "uppercase",
              borderBottom: "1px solid #e8e4dd",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            Payment Summary
          </h3>
          <div style={{ borderTop: "1px solid #e8e4dd" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #e8e4dd",
              }}
            >
              <span style={{ color: "#8b7355" }}>Room Rate (per night)</span>
              <span style={{ fontWeight: "500", color: "#2c2a26" }}>
                {formatCurrency(pricePerNight)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #e8e4dd",
              }}
            >
              <span style={{ color: "#8b7355" }}>Number of Nights</span>
              <span style={{ fontWeight: "500", color: "#2c2a26" }}>
                × {nights}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px 0",
                borderTop: "2px solid #2c2a26",
                marginTop: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#2c2a26",
                }}
              >
                Total Amount
              </span>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#2c2a26",
                }}
              >
                {formatCurrency(booking.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "12px 35px",
              backgroundColor:
                booking.paymentStatus === "confirmed" ? "#f0f7f0" : "#faf8f5",
              border: `1px solid ${booking.paymentStatus === "confirmed" ? "#c8dcc8" : "#e8e4dd"}`,
              color:
                booking.paymentStatus === "confirmed" ? "#4a7c4a" : "#8b7355",
              fontSize: "13px",
              fontWeight: "500",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {booking.paymentStatus === "confirmed"
              ? "Payment Confirmed"
              : "Awaiting Payment"}
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#8b7355",
                letterSpacing: "2px",
                textTransform: "uppercase",
                borderBottom: "1px solid #e8e4dd",
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              Special Requests
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6b6458",
                fontStyle: "italic",
                lineHeight: "1.7",
              }}
            >
              "{booking.specialRequests}"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "30px 50px 50px",
          color: "#8b7355",
          fontSize: "12px",
        }}
      >
        <p style={{ marginBottom: "5px" }}>
          <strong style={{ color: "#2c2a26" }}>Need assistance?</strong>
        </p>
        <p style={{ marginBottom: "5px" }}>
          Email: reservations@fatwavesurfresort.com
        </p>
        <p style={{ marginBottom: "25px" }}>Website: fatwavesurfresort.com</p>
        <p style={{ borderTop: "1px solid #d4c5a9", paddingTop: "25px" }}>
          Fatwave Surf Resort · La Union, Philippines
        </p>
        <p style={{ color: "#b0a89a", marginTop: "10px" }}>
          © {new Date().getFullYear()} Fatwave Surf Resort. All rights reserved.
        </p>
      </div>
    </div>
  );
});

BookingReceipt.displayName = "BookingReceipt";

export default BookingReceipt;
