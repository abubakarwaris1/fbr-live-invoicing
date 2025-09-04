/**
 * Format date to "yyyy-MM-dd" format
 * @param {Date|string} dateOrString - Date object or date string
 * @returns {string} Formatted date string
 */
export const toYmd = (dateOrString) => {
  try {
    const date = new Date(dateOrString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    return "";
  }
};

/**
 * Format number to percentage string with 0-2 decimals
 * @param {number} n - Number to format
 * @returns {string} Formatted percentage string
 */
export const pct = (n) => {
  const num = parseFloat(n);
  if (isNaN(num) || num < 0) {
    return "0%";
  }
  
  // Format to 0-2 decimal places
  const formatted = num.toFixed(Math.min(2, (num.toString().split('.')[1] || '').length));
  return `${formatted}%`;
};

/**
 * Coerce string or number to finite number or 0
 * @param {string|number} v - Value to coerce
 * @returns {number} Finite number or 0
 */
export const num = (v) => {
  if (v === null || v === undefined || v === "") {
    return 0;
  }
  
  const parsed = parseFloat(v);
  return isFinite(parsed) ? parsed : 0;
};

/**
 * Strip non-digit characters from string
 * @param {string} v - String to process
 * @returns {string} String with only digits
 */
export const digitsOnly = (v) => {
  if (typeof v !== 'string') {
    return String(v || "").replace(/\D/g, '');
  }
  return v.replace(/\D/g, '');
};

/**
 * Return value if regex matches, else empty string
 * @param {string} v - String to test
 * @param {RegExp} re - Regular expression to match
 * @returns {string} Original value if matches, empty string otherwise
 */
export const matchOrEmpty = (v, re) => {
  if (typeof v !== 'string' || !re || !(re instanceof RegExp)) {
    return "";
  }
  return re.test(v) ? v : "";
}; 