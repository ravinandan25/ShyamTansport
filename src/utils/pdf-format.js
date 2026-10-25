// Formatting for the quotation/invoice PDF. Must stay in sync with
// generate_pdf_and_save() in the Django backend (mobile/utils.py) so the
// PDF made on the phone and the one stored on the server read word for word the same.

// 600 -> "600", "600.50" -> "600.5"
export const formatNumber = value => String(Math.round(Number(value) * 100) / 100);

export const escapeHtml = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

const LESS_THAN_TWENTY = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const numberInWords = num => {
  if (!num) {
    return 'zero';
  }

  const parts = [];
  const crores = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  const lakhs = Math.floor(remainder / 100000);
  remainder %= 100000;
  const thousands = Math.floor(remainder / 1000);
  remainder %= 1000;
  const hundreds = Math.floor(remainder / 100);
  remainder %= 100;
  const tens = Math.floor(remainder / 10);
  const ones = remainder % 10;

  if (crores) {
    parts.push(`${numberInWords(crores)} crore${crores > 1 ? 's' : ''}`);
  }
  if (lakhs) {
    parts.push(`${numberInWords(lakhs)} lakhs`);
  }
  if (thousands) {
    parts.push(`${numberInWords(thousands)} thousand`);
  }
  if (hundreds) {
    parts.push(`${LESS_THAN_TWENTY[hundreds]} hundred`);
  }
  if (remainder > 0 && remainder < 20) {
    parts.push(LESS_THAN_TWENTY[remainder]);
  } else {
    if (tens) {
      parts.push(TENS[tens]);
    }
    if (ones) {
      parts.push(LESS_THAN_TWENTY[ones]);
    }
  }

  return parts.join(' ');
};

// 600 -> "six hundred rupee(s)", 600.5 -> "six hundred rupee(s) and fifty paise"
export const amountInWords = amount => {
  const totalPaise = Math.round(Number(amount) * 100);
  const rupees = Math.floor(totalPaise / 100);
  const paise = totalPaise % 100;

  let words = `${numberInWords(rupees)} rupee(s)`;
  if (paise) {
    words += ` and ${numberInWords(paise)} paise`;
  }
  return words;
};
