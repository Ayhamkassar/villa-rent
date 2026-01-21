/**
 * Validation Utilities
 * Common validation functions used across the app
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email?.trim());
};

/**
 * Validate password strength
 * Must be at least 8 characters with uppercase, lowercase, and number
 * @param {string} password - Password to validate
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate that a string is not empty
 * @param {string} value - Value to check
 * @returns {boolean}
 */
export const isNotEmpty = (value) => {
  return value?.trim()?.length > 0;
};

/**
 * Validate phone number (basic format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s-]{8,}$/;
  return phoneRegex.test(phone?.trim());
};

/**
 * Validate that a number is positive
 * @param {number|string} value - Value to check
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate that a number is non-negative
 * @param {number|string} value - Value to check
 * @returns {boolean}
 */
export const isNonNegativeNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Validate date is not in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean}
 */
export const isNotPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate >= today;
};

/**
 * Validate date range (end after start)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {boolean}
 */
export const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
};

/**
 * Get validation error message for email
 * @param {string} email - Email to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getEmailError = (email) => {
  if (!email?.trim()) return 'يرجى إدخال البريد الإلكتروني';
  if (!isValidEmail(email)) return 'يرجى إدخال بريد إلكتروني صحيح';
  return null;
};

/**
 * Get validation error message for password
 * @param {string} password - Password to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getPasswordError = (password) => {
  if (!password) return 'يرجى إدخال كلمة المرور';
  if (!isValidPassword(password)) {
    return 'كلمة المرور يجب أن تكون على الأقل 8 محارف وتحتوي على حرف كبير وحرف صغير ورقم';
  }
  return null;
};

/**
 * Get validation error message for name
 * @param {string} name - Name to validate
 * @returns {string|null} - Error message or null if valid
 */
export const getNameError = (name) => {
  if (!name?.trim()) return 'يرجى إدخال الاسم';
  if (name.trim().length < 2) return 'الاسم يجب أن يكون على الأقل حرفين';
  return null;
};
