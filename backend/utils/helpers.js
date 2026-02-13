/**
 * Generate a unique confirmation number for bookings
 * Format: FW-YYYYMMDD-XXXXX (random 5 chars)
 */
export const generateConfirmationNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `FW-${year}${month}${day}-${random}`;
};

/**
 * Generate a processing code for payment confirmation
 * Format: FW-YYYY-XXXX (sequential-style random 4 digits)
 */
export const generateProcessingCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  return `FW-${year}-${random}`;
};

/**
 * Calculate the number of nights between two dates
 */
export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Check if dates overlap with existing bookings
 */
export const datesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};
