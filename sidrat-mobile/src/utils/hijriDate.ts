/**
 * Hijri Date Utility
 *
 * Converts Gregorian dates to approximate Hijri (Islamic) calendar dates.
 * Uses the Kuwaiti algorithm — a well-known arithmetic approximation
 * that's accurate to within ±1 day for most cases.
 *
 * No external API required — pure calculation from Gregorian input.
 */

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi\u2019 al-Awwal',
  'Rabi\u2019 al-Thani',
  'Jumada al-Ula',
  'Jumada al-Thani',
  'Rajab',
  'Sha\u2019ban',
  'Ramadan',
  'Shawwal',
  'Dhul Qi\u2019dah',
  'Dhul Hijjah',
] as const;

const HIJRI_MONTHS_ARABIC = [
  'مُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الثَّانِي',
  'جُمَادَى الأُولَى',
  'جُمَادَى الآخِرَة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة',
] as const;

export interface HijriDate {
  day: number;
  month: number; // 1-indexed (1 = Muharram)
  year: number;
  monthName: string;
  monthNameArabic: string;
}

/**
 * Convert a Gregorian date to an approximate Hijri date.
 *
 * Uses the Kuwaiti/civil algorithm for arithmetic conversion.
 * Accurate to ±1 day in most cases.
 */
export function gregorianToHijri(date: Date = new Date()): HijriDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1; // 1-indexed
  const gDay = date.getDate();

  // Calculate Julian Day Number
  let jd =
    Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) +
    Math.floor((367 * (gMonth - 2 - 12 * Math.floor((gMonth - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100)) / 4) +
    gDay -
    32075;

  // Adjust to Islamic epoch
  jd = jd - 1948440 + 10632;
  const n = Math.floor((jd - 1) / 10631);
  jd = jd - 10631 * n + 354;

  const j =
    Math.floor((10985 - jd) / 5316) * Math.floor((50 * jd) / 17719) +
    Math.floor(jd / 5670) * Math.floor((43 * jd) / 15238);

  jd =
    jd -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const hMonth = Math.floor((24 * jd) / 709);
  const hDay = jd - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    monthName: HIJRI_MONTHS[hMonth - 1] ?? '',
    monthNameArabic: HIJRI_MONTHS_ARABIC[hMonth - 1] ?? '',
  };
}

/**
 * Format a Hijri date as a readable English string.
 * e.g. "7 Ramadan 1447"
 */
export function formatHijriDate(date?: Date): string {
  const h = gregorianToHijri(date);
  return `${h.day} ${h.monthName} ${h.year} AH`;
}

/**
 * Format a Hijri date with Arabic month name.
 * e.g. "7 رَمَضَان 1447"
 */
export function formatHijriDateArabicMonth(date?: Date): string {
  const h = gregorianToHijri(date);
  return `${h.day} ${h.monthNameArabic} ${h.year}`;
}

/**
 * Check if the current Hijri month is Ramadan.
 */
export function isRamadan(date?: Date): boolean {
  return gregorianToHijri(date).month === 9;
}

/**
 * Get contextual Islamic info based on the current Hijri date.
 * Useful for adding special banners or greetings.
 */
export function getHijriContext(date?: Date): { isSpecialDay: boolean; message?: string } {
  const h = gregorianToHijri(date);

  // Ramadan
  if (h.month === 9) {
    return { isSpecialDay: true, message: 'Ramadan Mubarak! 🌙' };
  }

  // Eid al-Fitr (1 Shawwal)
  if (h.month === 10 && h.day === 1) {
    return { isSpecialDay: true, message: 'Eid Mubarak! 🎉' };
  }

  // Eid al-Adha (10 Dhul Hijjah)
  if (h.month === 12 && h.day === 10) {
    return { isSpecialDay: true, message: 'Eid al-Adha Mubarak! 🐑' };
  }

  // Day of Arafah (9 Dhul Hijjah)
  if (h.month === 12 && h.day === 9) {
    return { isSpecialDay: true, message: 'Day of Arafah — a blessed day of fasting' };
  }

  // Ashura (10 Muharram)
  if (h.month === 1 && h.day === 10) {
    return { isSpecialDay: true, message: 'Day of Ashura' };
  }

  // 12 Rabi al-Awwal (Mawlid an-Nabi)
  if (h.month === 3 && h.day === 12) {
    return { isSpecialDay: true, message: '12th Rabi\u2019 al-Awwal' };
  }

  return { isSpecialDay: false };
}
