import puppeteer from "puppeteer";
import { formatDate, formatCurrency } from "../utils/helpers.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get logo as base64 (fallback to wave emoji if file not found)
const getLogoBase64 = () => {
  try {
    const logoPath = path.resolve(__dirname, "../../frontend/public/logo.png");
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }
  } catch (e) {
    console.log("Logo file not found, using text fallback");
  }
  return null;
};

/**
 * Generate PDF receipt with Fatwave branding
 */
export const generateReceiptPDF = async (booking, room) => {
  const pricePerNight = room.currentPrice || room.pricePerNight;
  const hasDiscount =
    room.seasonalDiscount?.isActive &&
    new Date() >= new Date(room.seasonalDiscount.startDate) &&
    new Date() <= new Date(room.seasonalDiscount.endDate);

  const logoBase64 = getLogoBase64();
  const logoHtml = logoBase64
    ? `<img src="${logoBase64}" alt="Fatwave Surf Resort" style="max-height: 80px; margin-bottom: 10px;" />`
    : `<div class="logo">🌊 Fatwave Surf Resort</div>`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt - ${booking.bookingReference}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Pacifico&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Open Sans', sans-serif;
          color: #333333;
          background-color: #FFFFFF;
          line-height: 1.6;
        }
        
        .receipt {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
        }
        
        .header {
          background: linear-gradient(135deg, #1F4E79 0%, #2D6BA8 100%);
          padding: 40px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        
        .logo {
          font-family: 'Pacifico', cursive;
          font-size: 36px;
          color: #FFFFFF;
          margin-bottom: 5px;
        }
        
        .tagline {
          color: #F7B733;
          font-size: 14px;
          letter-spacing: 2px;
        }
        
        .receipt-title {
          background-color: #F76C1E;
          color: #FFFFFF;
          text-align: center;
          padding: 15px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 1px;
        }
        
        .content {
          background-color: #FFFFFF;
          padding: 40px;
          border: 1px solid #eee;
        }
        
        .confirmation-box {
          background-color: #F4EDE3;
          border-left: 4px solid #F76C1E;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .confirmation-label {
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .confirmation-number {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1F4E79;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1F4E79;
          border-bottom: 2px solid #F7B733;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }
        
        .price-breakdown {
          background-color: #F4EDE3;
          padding: 25px;
          border-radius: 8px;
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px dashed #ddd;
        }
        
        .price-row:last-child {
          border-bottom: none;
        }
        
        .price-label {
          color: #666;
        }
        
        .price-value {
          font-weight: 600;
          color: #333;
        }
        
        .discount-row {
          color: #2e7d32;
        }
        
        .total-row {
          background-color: #1F4E79;
          color: #FFFFFF;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 20px;
          border-radius: 8px;
          margin-top: 10px;
        }
        
        .footer {
          background-color: #333333;
          color: #FFFFFF;
          padding: 30px;
          text-align: center;
          border-radius: 0 0 10px 10px;
        }
        
        .footer-text {
          font-size: 14px;
          margin-bottom: 10px;
        }
        
        .footer-contact {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          font-size: 12px;
        }
        
        .footer-contact span {
          color: #F7B733;
        }
        
        .orange-line {
          height: 4px;
          background: linear-gradient(90deg, #F76C1E 0%, #F7B733 100%);
        }
        
        .special-requests {
          background-color: #FFF8E1;
          border-left: 4px solid #F7B733;
          padding: 15px;
          margin-top: 20px;
          font-style: italic;
          color: #666;
        }
        
        .generated-date {
          text-align: center;
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          ${logoHtml}
          <div class="tagline">WHERE THE WAVES MEET PARADISE</div>
        </div>
        
        <div class="orange-line"></div>
        
        <div class="receipt-title">RESERVATION RECEIPT</div>
        
        <div class="content">
          <div class="confirmation-box">
            <div class="confirmation-label">Confirmation Number</div>
            <div class="confirmation-number">${booking.bookingReference}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Guest Information</div>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Name</span>
                <span class="detail-value">${booking.guestName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">${booking.guestEmail}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Number of Guests</span>
                <span class="detail-value">${booking.guests}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Accommodation Details</div>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Room Type</span>
                <span class="detail-value">${room.name}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Category</span>
                <span class="detail-value" style="text-transform: capitalize;">${room.category.replace("-", " ")}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Check-in Date</span>
                <span class="detail-value">${formatDate(booking.checkIn)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Check-out Date</span>
                <span class="detail-value">${formatDate(booking.checkOut)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Number of Nights</span>
                <span class="detail-value">${booking.nights}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Booking Status</span>
                <span class="detail-value" style="text-transform: capitalize; color: ${booking.paymentStatus === "confirmed" ? "#2e7d32" : "#F76C1E"};">${booking.paymentStatus === "awaiting_payment" ? "Awaiting Payment" : booking.paymentStatus}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Price Breakdown</div>
            <div class="price-breakdown">
              <div class="price-row">
                <span class="price-label">Room Rate (per night)</span>
                <span class="price-value">${formatCurrency(room.pricePerNight)}</span>
              </div>
              ${
                hasDiscount
                  ? `
                <div class="price-row discount-row">
                  <span class="price-label">Seasonal Discount (${room.seasonalDiscount.percentage}%)</span>
                  <span class="price-value">-${formatCurrency(((room.pricePerNight * room.seasonalDiscount.percentage) / 100) * booking.nights)}</span>
                </div>
              `
                  : ""
              }
              <div class="price-row">
                <span class="price-label">Number of Nights</span>
                <span class="price-value">× ${booking.nights}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Subtotal</span>
                <span class="price-value">${formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>
            <div class="total-row">
              <span>TOTAL AMOUNT</span>
              <span>${formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
          
          ${
            booking.specialRequests
              ? `
            <div class="special-requests">
              <strong>Special Requests:</strong> ${booking.specialRequests}
            </div>
          `
              : ""
          }
          
          <div class="generated-date">
            Receipt generated on ${formatDate(new Date())}
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            Thank you for choosing Fatwave Surf Resort!
          </div>
          <div class="footer-text">
            We look forward to making your stay unforgettable. 🏄🌴
          </div>
          <div class="footer-contact">
            <div>📍 <span>123 Beach Road, Tropical Paradise</span></div>
            <div>✉️ <span>info@fatwavesurfresort.com</span></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();

  return pdfBuffer;
};

export default { generateReceiptPDF };
