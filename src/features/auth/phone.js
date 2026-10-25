// Same rules as the server: 10 digits starting 6-9, optional +91 / 91 / 0.
// Returns the 10 digits, or null when the number is not valid.
export const normalizePhone = value => {
  const digits = value
    .replace(/[\s-]/g, '')
    .replace(/^(\+91|91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};
