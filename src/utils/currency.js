// Indian grouping, paise only when there are any: 45000 -> "₹45,000", 8500.5 -> "₹8,500.50".
export const formatRupees = value => {
  const amount = Math.round(Number(value) * 100) / 100;
  const digits = Number.isInteger(amount) ? 0 : 2;
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
};
