import PDFDocument from "pdfkit";
import { formatDate, formatCurrency } from "../utils/helpers.js";

// Brand colors
const COLORS = {
  deepBlue: "#1F4E79",
  mediumBlue: "#2D6BA8",
  orange: "#F76C1E",
  gold: "#F7B733",
  dark: "#333333",
  gray: "#666666",
  lightGray: "#888888",
  cream: "#F4EDE3",
  white: "#FFFFFF",
  green: "#2e7d32",
};

/**
 * Helper: draw a filled rectangle
 */
const drawRect = (doc, x, y, w, h, color) => {
  doc.save().rect(x, y, w, h).fill(color).restore();
};

/**
 * Helper: draw a detail row (label + value) in a 2-column grid
 */
const drawDetailItem = (doc, x, y, label, value, options = {}) => {
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.lightGray)
    .text(label.toUpperCase(), x, y);
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(options.color || COLORS.dark)
    .text(value, x, y + 12);
  return y + 30;
};

/**
 * Helper: draw a price row
 */
const drawPriceRow = (doc, y, label, value, options = {}) => {
  const leftX = 60;
  const rightX = 400;
  const color = options.color || COLORS.gray;

  doc.font("Helvetica").fontSize(10).fillColor(color).text(label, leftX, y);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(options.valueColor || COLORS.dark)
    .text(value, rightX, y, { width: 130, align: "right" });

  // dashed line
  if (!options.noDash) {
    doc
      .save()
      .moveTo(leftX, y + 18)
      .lineTo(530, y + 18)
      .dash(3, { space: 3 })
      .strokeColor("#dddddd")
      .stroke()
      .undash()
      .restore();
  }

  return y + 26;
};

/**
 * Generate PDF receipt with Fatwave branding using PDFKit
 */
export const generateReceiptPDF = async (booking, room) => {
  const pricePerNight = room.currentPrice || room.pricePerNight;
  const hasDiscount =
    room.seasonalDiscount?.isActive &&
    new Date() >= new Date(room.seasonalDiscount.startDate) &&
    new Date() <= new Date(room.seasonalDiscount.endDate);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - 40; // 595.28 - 40 = ~555
      const leftMargin = 20;

      // ── HEADER (deep blue banner) ──
      drawRect(doc, leftMargin, 20, pageWidth, 80, COLORS.deepBlue);
      doc
        .font("Helvetica-Bold")
        .fontSize(26)
        .fillColor(COLORS.white)
        .text("Fatwave Surf Resort", leftMargin, 38, {
          width: pageWidth,
          align: "center",
        });
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.gold)
        .text("WHERE THE WAVES MEET PARADISE", leftMargin, 70, {
          width: pageWidth,
          align: "center",
          characterSpacing: 2,
        });

      // ── Orange gradient line ──
      drawRect(doc, leftMargin, 100, pageWidth, 4, COLORS.orange);

      // ── RESERVATION RECEIPT title bar ──
      drawRect(doc, leftMargin, 104, pageWidth, 35, COLORS.orange);
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(COLORS.white)
        .text("RESERVATION RECEIPT", leftMargin, 114, {
          width: pageWidth,
          align: "center",
          characterSpacing: 1,
        });

      // ── CONTENT AREA ──
      let y = 155;

      // Confirmation box
      drawRect(doc, 40, y, pageWidth - 40, 50, COLORS.cream);
      drawRect(doc, 40, y, 4, 50, COLORS.orange);
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.gray)
        .text("CONFIRMATION NUMBER", 55, y + 10, { characterSpacing: 1 });
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor(COLORS.deepBlue)
        .text(booking.bookingReference, 55, y + 24);

      y += 70;

      // ── Guest Information Section ──
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(COLORS.deepBlue)
        .text("Guest Information", 40, y);
      y += 16;
      doc
        .save()
        .moveTo(40, y)
        .lineTo(530, y)
        .strokeColor(COLORS.gold)
        .lineWidth(2)
        .stroke()
        .restore();
      y += 12;

      const col1 = 40;
      const col2 = 290;

      drawDetailItem(doc, col1, y, "Name", booking.guestName);
      drawDetailItem(doc, col2, y, "Email", booking.guestEmail);
      y += 32;
      drawDetailItem(doc, col1, y, "Number of Guests", String(booking.guests));
      y += 40;

      // ── Accommodation Details Section ──
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(COLORS.deepBlue)
        .text("Accommodation Details", 40, y);
      y += 16;
      doc
        .save()
        .moveTo(40, y)
        .lineTo(530, y)
        .strokeColor(COLORS.gold)
        .lineWidth(2)
        .stroke()
        .restore();
      y += 12;

      drawDetailItem(doc, col1, y, "Room Type", room.name);
      drawDetailItem(
        doc,
        col2,
        y,
        "Category",
        room.category
          .replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      );
      y += 32;

      drawDetailItem(
        doc,
        col1,
        y,
        "Check-in Date",
        formatDate(booking.checkIn),
      );
      drawDetailItem(
        doc,
        col2,
        y,
        "Check-out Date",
        formatDate(booking.checkOut),
      );
      y += 32;

      drawDetailItem(doc, col1, y, "Number of Nights", String(booking.nights));

      const statusLabel =
        booking.paymentStatus === "awaiting_payment"
          ? "Awaiting Payment"
          : booking.paymentStatus.replace(/\b\w/g, (l) => l.toUpperCase());
      const statusColor =
        booking.paymentStatus === "confirmed" ? COLORS.green : COLORS.orange;
      drawDetailItem(doc, col2, y, "Booking Status", statusLabel, {
        color: statusColor,
      });
      y += 45;

      // ── Price Breakdown Section ──
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(COLORS.deepBlue)
        .text("Price Breakdown", 40, y);
      y += 16;
      doc
        .save()
        .moveTo(40, y)
        .lineTo(530, y)
        .strokeColor(COLORS.gold)
        .lineWidth(2)
        .stroke()
        .restore();
      y += 12;

      // Cream background for price breakdown
      const priceBoxTop = y;
      let priceY = y + 12;

      priceY = drawPriceRow(
        doc,
        priceY,
        "Room Rate (per night)",
        formatCurrency(room.pricePerNight),
      );

      if (hasDiscount) {
        priceY = drawPriceRow(
          doc,
          priceY,
          `Seasonal Discount (${room.seasonalDiscount.percentage}%)`,
          `-${formatCurrency(
            ((room.pricePerNight * room.seasonalDiscount.percentage) / 100) *
              booking.nights,
          )}`,
          { color: COLORS.green, valueColor: COLORS.green },
        );
      }

      priceY = drawPriceRow(
        doc,
        priceY,
        "Number of Nights",
        `x ${booking.nights}`,
      );
      priceY = drawPriceRow(
        doc,
        priceY,
        "Subtotal",
        formatCurrency(booking.totalPrice),
        { noDash: true },
      );

      // Draw cream background behind price rows
      const priceBoxHeight = priceY - priceBoxTop + 8;
      // Re-draw background behind (we draw it first by moving content)
      // Since PDFKit draws in order, we'll just add the background rect behind
      drawRect(
        doc,
        40,
        priceBoxTop,
        pageWidth - 40,
        priceBoxHeight,
        COLORS.cream,
      );

      // Re-draw price rows on top of background
      priceY = priceBoxTop + 12;
      priceY = drawPriceRow(
        doc,
        priceY,
        "Room Rate (per night)",
        formatCurrency(room.pricePerNight),
      );

      if (hasDiscount) {
        priceY = drawPriceRow(
          doc,
          priceY,
          `Seasonal Discount (${room.seasonalDiscount.percentage}%)`,
          `-${formatCurrency(
            ((room.pricePerNight * room.seasonalDiscount.percentage) / 100) *
              booking.nights,
          )}`,
          { color: COLORS.green, valueColor: COLORS.green },
        );
      }

      priceY = drawPriceRow(
        doc,
        priceY,
        "Number of Nights",
        `x ${booking.nights}`,
      );
      priceY = drawPriceRow(
        doc,
        priceY,
        "Subtotal",
        formatCurrency(booking.totalPrice),
        { noDash: true },
      );

      y = priceY + 10;

      // Total row (deep blue box)
      drawRect(doc, 40, y, pageWidth - 40, 40, COLORS.deepBlue);
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(COLORS.white)
        .text("TOTAL AMOUNT", 60, y + 12);
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(COLORS.white)
        .text(formatCurrency(booking.totalPrice), 400, y + 12, {
          width: 130,
          align: "right",
        });

      y += 55;

      // ── Special Requests ──
      if (booking.specialRequests) {
        drawRect(doc, 40, y, pageWidth - 40, 40, "#FFF8E1");
        drawRect(doc, 40, y, 4, 40, COLORS.gold);
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(COLORS.gray)
          .text("Special Requests:", 55, y + 8);
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor(COLORS.gray)
          .text(booking.specialRequests, 55, y + 22, { width: pageWidth - 80 });
        y += 50;
      }

      // Generated date
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.lightGray)
        .text(`Receipt generated on ${formatDate(new Date())}`, 40, y, {
          width: pageWidth - 40,
          align: "center",
        });

      y += 30;

      // ── FOOTER ──
      drawRect(doc, leftMargin, y, pageWidth, 70, COLORS.dark);
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(COLORS.white)
        .text(
          "Thank you for choosing Fatwave Surf Resort!",
          leftMargin,
          y + 12,
          { width: pageWidth, align: "center" },
        );
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(COLORS.white)
        .text(
          "We look forward to making your stay unforgettable.",
          leftMargin,
          y + 28,
          { width: pageWidth, align: "center" },
        );
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.gold)
        .text(
          "123 Beach Road, Tropical Paradise  |  info@fatwavesurfresort.com",
          leftMargin,
          y + 48,
          { width: pageWidth, align: "center" },
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default { generateReceiptPDF };
