/**
 * Formatting Utilities
 * Common formatting functions used across the app
 */

/**
 * Format date to Arabic locale string
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatDateArabic = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('ar-SA');
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param {Date} date - Date to format
 * @returns {string}
 */
export const formatDateISO = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Format price with currency
 * @param {number|string} price - Price value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string}
 */
export const formatPrice = (price, currency = '$') => {
  if (price === null || price === undefined) return '-';
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '-';
  return `${numPrice.toLocaleString()} ${currency}`;
};

/**
 * Format price for display in farm list
 * @param {object} farm - Farm object
 * @returns {string}
 */
export const formatFarmPrice = (farm) => {
  if (farm?.type === 'rent') {
    return `${farm.weekendPrice || '-'} ليرة`;
  }
  return `${farm.price || '-'} دولار`;
};

/**
 * Get farm type display text
 * @param {string} type - Farm type (sale/rent)
 * @returns {string}
 */
export const getFarmTypeText = (type) => {
  return type === 'sale' ? 'بيع' : 'إيجار';
};

/**
 * Get nights text based on count
 * @param {number} nights - Number of nights
 * @returns {string}
 */
export const getNightsText = (nights) => {
  if (nights === 1) return 'ليلة واحدة';
  if (nights === 2) return 'ليلتان';
  if (nights >= 3 && nights <= 10) return `${nights} ليالي`;
  return `${nights} ليلة`;
};

/**
 * Calculate number of nights between two dates
 * @param {string|Date} fromDate - Start date
 * @param {string|Date} toDate - End date
 * @returns {number}
 */
export const calculateNights = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate || fromDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
};

/**
 * Get date range array between two dates
 * @param {string} start - Start date (YYYY-MM-DD)
 * @param {string} end - End date (YYYY-MM-DD)
 * @returns {string[]}
 */
export const getDatesRange = (start, end) => {
  const range = [];
  const current = new Date(start);
  const last = new Date(end);
  
  while (current <= last) {
    range.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return range;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format farm address for display
 * @param {string|object} address - Address string or object
 * @returns {string}
 */
export const formatAddress = (address) => {
  if (!address) return 'غير محدد';
  if (typeof address === 'string') return address;
  return address.address || 'غير محدد';
};
