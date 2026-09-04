// Bangla digits mapping
export const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)])
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Bengali Months & Days
const bnMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const bnDays = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

export const formatBengaliDate = (dateString?: string | Date): string => {
  const date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getTime())) return '';

  const dayName = bnDays[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const monthName = bnMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  let hours = date.getHours();
  const minutes = toBengaliNumber(date.getMinutes().toString().padStart(2, '0'));
  const period = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const hoursBn = toBengaliNumber(hours);

  return `${dayName}, ${day} ${monthName} ${year}, ${hoursBn}:${minutes} ${period}`;
};

export const formatRelativeBanglaTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) {
    return 'এইমাত্র';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${toBengaliNumber(diffMin)} মিনিট আগে`;
  }
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return `${toBengaliNumber(diffHour)} ঘণ্টা আগে`;
  }
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays < 30) {
    return `${toBengaliNumber(diffDays)} দিন আগে`;
  }
  return formatBengaliDate(dateString);
};

// Generate SEO Slug
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Calculate Bangla Reading Time
export const calculateReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 180;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Levenshtein similarity algorithm for Automated Duplicate Detection
export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;

  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
};

// Today's Dhaka date in Bangla
export const getDhakaHeaderDate = (): string => {
  const now = new Date();
  const dayName = bnDays[now.getDay()];
  const day = toBengaliNumber(now.getDate());
  const month = bnMonths[now.getMonth()];
  const year = toBengaliNumber(now.getFullYear());
  return `${dayName}, ${day} ${month} ${year}`;
};
