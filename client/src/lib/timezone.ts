import { format, formatInTimeZone } from 'date-fns-tz';

const TIMEZONE_KEY = 'user_timezone';

// Major world cities sorted by GMT offset (from GMT-11 to GMT+14)
export const commonTimezones = [
  // GMT-11
  { value: 'Pacific/Midway', label: '(GMT-11) 🇺🇸 Midway Island (SST)' },
  
  // GMT-10
  { value: 'Pacific/Honolulu', label: '(GMT-10) 🇺🇸 Honolulu (HST)' },
  
  // GMT-9
  { value: 'America/Anchorage', label: '(GMT-9) 🇺🇸 Anchorage (AKST)' },
  
  // GMT-8
  { value: 'America/Los_Angeles', label: '(GMT-8) 🇺🇸 Los Angeles (PST)' },
  { value: 'America/Vancouver', label: '(GMT-8) 🇨🇦 Vancouver (PST)' },
  { value: 'America/Seattle', label: '(GMT-8) 🇺🇸 Seattle (PST)' },
  { value: 'America/San_Francisco', label: '(GMT-8) 🇺🇸 San Francisco (PST)' },
  
  // GMT-7
  { value: 'America/Denver', label: '(GMT-7) 🇺🇸 Denver (MST)' },
  { value: 'America/Phoenix', label: '(GMT-7) 🇺🇸 Phoenix (MST)' },
  { value: 'America/Calgary', label: '(GMT-7) 🇨🇦 Calgary (MST)' },
  
  // GMT-6
  { value: 'America/Chicago', label: '(GMT-6) 🇺🇸 Chicago (CST)' },
  { value: 'America/Mexico_City', label: '(GMT-6) 🇲🇽 Mexico City (CST)' },
  { value: 'America/Dallas', label: '(GMT-6) 🇺🇸 Dallas (CST)' },
  { value: 'America/Houston', label: '(GMT-6) 🇺🇸 Houston (CST)' },
  
  // GMT-5
  { value: 'America/New_York', label: '(GMT-5) 🇺🇸 New York (EST)' },
  { value: 'America/Toronto', label: '(GMT-5) 🇨🇦 Toronto (EST)' },
  { value: 'America/Montreal', label: '(GMT-5) 🇨🇦 Montreal (EST)' },
  { value: 'America/Havana', label: '(GMT-5) 🇨🇺 Havana (CST)' },
  { value: 'America/Miami', label: '(GMT-5) 🇺🇸 Miami (EST)' },
  { value: 'America/Boston', label: '(GMT-5) 🇺🇸 Boston (EST)' },
  { value: 'America/Atlanta', label: '(GMT-5) 🇺🇸 Atlanta (EST)' },
  { value: 'America/Philadelphia', label: '(GMT-5) 🇺🇸 Philadelphia (EST)' },
  { value: 'America/Detroit', label: '(GMT-5) 🇺🇸 Detroit (EST)' },
  { value: 'America/Lima', label: '(GMT-5) 🇵🇪 Lima (PET)' },
  { value: 'America/Bogota', label: '(GMT-5) 🇨🇴 Bogotá (COT)' },
  { value: 'America/Guayaquil', label: '(GMT-5) 🇪🇨 Quito (ECT)' },
  { value: 'America/Panama', label: '(GMT-5) 🇵🇦 Panama City (EST)' },
  
  // GMT-4
  { value: 'America/Caracas', label: '(GMT-4) 🇻🇪 Caracas (VET)' },
  { value: 'America/La_Paz', label: '(GMT-4) 🇧🇴 La Paz (BOT)' },
  { value: 'America/Manaus', label: '(GMT-4) 🇧🇷 Manaus (AMT)' },
  
  // GMT-3:30
  { value: 'America/St_Johns', label: '(GMT-3:30) 🇨🇦 St. Johns (NST)' },
  
  // GMT-3
  { value: 'America/Sao_Paulo', label: '(GMT-3) 🇧🇷 São Paulo (BRT)' },
  { value: 'America/Bahia', label: '(GMT-3) 🇧🇷 Salvador (BRT)' },
  { value: 'America/Recife', label: '(GMT-3) 🇧🇷 Recife (BRT)' },
  { value: 'America/Fortaleza', label: '(GMT-3) 🇧🇷 Fortaleza (BRT)' },
  { value: 'America/Brasilia', label: '(GMT-3) 🇧🇷 Brasília (BRT)' },
  { value: 'America/Argentina/Buenos_Aires', label: '(GMT-3) 🇦🇷 Buenos Aires (ART)' },
  { value: 'America/Santiago', label: '(GMT-3) 🇨🇱 Santiago (CLT)' },
  { value: 'America/Montevideo', label: '(GMT-3) 🇺🇾 Montevideo (UYT)' },
  { value: 'America/Asuncion', label: '(GMT-3) 🇵🇾 Asunción (PYT)' },
  
  // GMT-2
  { value: 'America/Noronha', label: '(GMT-2) 🇧🇷 Fernando de Noronha (FNT)' },
  
  // GMT-1
  { value: 'Atlantic/Azores', label: '(GMT-1) 🇵🇹 Azores (AZOT)' },
  
  // GMT+0
  { value: 'UTC', label: '(GMT+0) 🌐 UTC' },
  { value: 'Europe/London', label: '(GMT+0) 🇬🇧 London (GMT)' },
  { value: 'Europe/Edinburgh', label: '(GMT+0) 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Edinburgh (GMT)' },
  { value: 'Europe/Dublin', label: '(GMT+0) 🇮🇪 Dublin (GMT)' },
  { value: 'Europe/Lisbon', label: '(GMT+0) 🇵🇹 Lisbon (WET)' },
  { value: 'Africa/Casablanca', label: '(GMT+0) 🇲🇦 Casablanca (WET)' },
  { value: 'Atlantic/Reykjavik', label: '(GMT+0) 🇮🇸 Reykjavik (GMT)' },
  
  // GMT+1
  { value: 'Europe/Paris', label: '(GMT+1) 🇫🇷 Paris (CET)' },
  { value: 'Europe/Berlin', label: '(GMT+1) 🇩🇪 Berlin (CET)' },
  { value: 'Europe/Copenhagen', label: '(GMT+1) 🇩🇰 Copenhagen (CET)' },
  { value: 'Europe/Madrid', label: '(GMT+1) 🇪🇸 Madrid (CET)' },
  { value: 'Europe/Barcelona', label: '(GMT+1) 🇪🇸 Barcelona (CET)' },
  { value: 'Europe/Rome', label: '(GMT+1) 🇮🇹 Rome (CET)' },
  { value: 'Europe/Milan', label: '(GMT+1) 🇮🇹 Milan (CET)' },
  { value: 'Europe/Amsterdam', label: '(GMT+1) 🇳🇱 Amsterdam (CET)' },
  { value: 'Europe/Brussels', label: '(GMT+1) 🇧🇪 Brussels (CET)' },
  { value: 'Europe/Vienna', label: '(GMT+1) 🇦🇹 Vienna (CET)' },
  { value: 'Europe/Prague', label: '(GMT+1) 🇨🇿 Prague (CET)' },
  { value: 'Europe/Budapest', label: '(GMT+1) 🇭🇺 Budapest (CET)' },
  { value: 'Europe/Warsaw', label: '(GMT+1) 🇵🇱 Warsaw (CET)' },
  { value: 'Europe/Oslo', label: '(GMT+1) 🇳🇴 Oslo (CET)' },
  { value: 'Europe/Stockholm', label: '(GMT+1) 🇸🇪 Stockholm (CET)' },
  { value: 'Europe/Zurich', label: '(GMT+1) 🇨🇭 Zurich (CET)' },
  { value: 'Africa/Lagos', label: '(GMT+1) 🇳🇬 Lagos (WAT)' },
  
  // GMT+2
  { value: 'Europe/Athens', label: '(GMT+2) 🇬🇷 Athens (EET)' },
  { value: 'Europe/Helsinki', label: '(GMT+2) 🇫🇮 Helsinki (EET)' },
  { value: 'Europe/Bucharest', label: '(GMT+2) 🇷🇴 Bucharest (EET)' },
  { value: 'Europe/Sofia', label: '(GMT+2) 🇧🇬 Sofia (EET)' },
  { value: 'Europe/Kiev', label: '(GMT+2) 🇺🇦 Kyiv (EET)' },
  { value: 'Africa/Cairo', label: '(GMT+2) 🇪🇬 Cairo (EET)' },
  { value: 'Africa/Johannesburg', label: '(GMT+2) 🇿🇦 Johannesburg (SAST)' },
  { value: 'Asia/Jerusalem', label: '(GMT+2) 🇮🇱 Jerusalem (IST)' },
  { value: 'Asia/Beirut', label: '(GMT+2) 🇱🇧 Beirut (EET)' },
  
  // GMT+3
  { value: 'Europe/Istanbul', label: '(GMT+3) 🇹🇷 Istanbul (TRT)' },
  { value: 'Europe/Moscow', label: '(GMT+3) 🇷🇺 Moscow (MSK)' },
  { value: 'Africa/Nairobi', label: '(GMT+3) 🇰🇪 Nairobi (EAT)' },
  { value: 'Africa/Addis_Ababa', label: '(GMT+3) 🇪🇹 Addis Ababa (EAT)' },
  { value: 'Asia/Riyadh', label: '(GMT+3) 🇸🇦 Riyadh (AST)' },
  { value: 'Asia/Baghdad', label: '(GMT+3) 🇮🇶 Baghdad (AST)' },
  { value: 'Asia/Kuwait', label: '(GMT+3) 🇰🇼 Kuwait City (AST)' },
  
  // GMT+4
  { value: 'Asia/Dubai', label: '(GMT+4) 🇦🇪 Dubai (GST)' },
  { value: 'Asia/Muscat', label: '(GMT+4) 🇴🇲 Muscat (GST)' },
  { value: 'Asia/Baku', label: '(GMT+4) 🇦🇿 Baku (AZT)' },
  { value: 'Asia/Tbilisi', label: '(GMT+4) 🇬🇪 Tbilisi (GET)' },
  { value: 'Asia/Yerevan', label: '(GMT+4) 🇦🇲 Yerevan (AMT)' },
  
  // GMT+5
  { value: 'Asia/Karachi', label: '(GMT+5) 🇵🇰 Karachi (PKT)' },
  { value: 'Asia/Tashkent', label: '(GMT+5) 🇺🇿 Tashkent (UZT)' },
  
  // GMT+5:30
  { value: 'Asia/Kolkata', label: '(GMT+5:30) 🇮🇳 Kolkata (IST)' },
  { value: 'Asia/Mumbai', label: '(GMT+5:30) 🇮🇳 Mumbai (IST)' },
  { value: 'Asia/Delhi', label: '(GMT+5:30) 🇮🇳 Delhi (IST)' },
  { value: 'Asia/Bangalore', label: '(GMT+5:30) 🇮🇳 Bangalore (IST)' },
  
  // GMT+5:45
  { value: 'Asia/Kathmandu', label: '(GMT+5:45) 🇳🇵 Kathmandu (NPT)' },
  
  // GMT+6
  { value: 'Asia/Dhaka', label: '(GMT+6) 🇧🇩 Dhaka (BST)' },
  
  // GMT+6:30
  { value: 'Asia/Yangon', label: '(GMT+6:30) 🇲🇲 Yangon (MMT)' },
  
  // GMT+7
  { value: 'Asia/Bangkok', label: '(GMT+7) 🇹🇭 Bangkok (ICT)' },
  { value: 'Asia/Jakarta', label: '(GMT+7) 🇮🇩 Jakarta (WIB)' },
  { value: 'Asia/Ho_Chi_Minh', label: '(GMT+7) 🇻🇳 Ho Chi Minh City (ICT)' },
  { value: 'Asia/Hanoi', label: '(GMT+7) 🇻🇳 Hanoi (ICT)' },
  { value: 'Asia/Phnom_Penh', label: '(GMT+7) 🇰🇭 Phnom Penh (ICT)' },
  { value: 'Asia/Vientiane', label: '(GMT+7) 🇱🇦 Vientiane (ICT)' },
  
  // GMT+8
  { value: 'Asia/Singapore', label: '(GMT+8) 🇸🇬 Singapore (SGT)' },
  { value: 'Asia/Hong_Kong', label: '(GMT+8) 🇭🇰 Hong Kong (HKT)' },
  { value: 'Asia/Shanghai', label: '(GMT+8) 🇨🇳 Shanghai (CST)' },
  { value: 'Asia/Beijing', label: '(GMT+8) 🇨🇳 Beijing (CST)' },
  { value: 'Asia/Manila', label: '(GMT+8) 🇵🇭 Manila (PHT)' },
  { value: 'Asia/Taipei', label: '(GMT+8) 🇹🇼 Taipei (CST)' },
  { value: 'Asia/Kuala_Lumpur', label: '(GMT+8) 🇲🇾 Kuala Lumpur (MYT)' },
  { value: 'Asia/Ulaanbaatar', label: '(GMT+8) 🇲🇳 Ulaanbaatar (ULAT)' },
  { value: 'Australia/Perth', label: '(GMT+8) 🇦🇺 Perth (AWST)' },
  
  // GMT+9
  { value: 'Asia/Tokyo', label: '(GMT+9) 🇯🇵 Tokyo (JST)' },
  { value: 'Asia/Seoul', label: '(GMT+9) 🇰🇷 Seoul (KST)' },
  
  // GMT+10
  { value: 'Australia/Brisbane', label: '(GMT+10) 🇦🇺 Brisbane (AEST)' },
  { value: 'Australia/Canberra', label: '(GMT+10) 🇦🇺 Canberra (AEST)' },
  { value: 'Pacific/Port_Moresby', label: '(GMT+10) 🇵🇬 Port Moresby (PGT)' },
  
  // GMT+10:30
  { value: 'Australia/Adelaide', label: '(GMT+10:30) 🇦🇺 Adelaide (ACDT)' },
  
  // GMT+11
  { value: 'Australia/Sydney', label: '(GMT+11) 🇦🇺 Sydney (AEDT)' },
  { value: 'Australia/Melbourne', label: '(GMT+11) 🇦🇺 Melbourne (AEDT)' },
  
  // GMT+12
  { value: 'Pacific/Auckland', label: '(GMT+12) 🇳🇿 Auckland (NZST)' },
  { value: 'Pacific/Fiji', label: '(GMT+12) 🇫🇯 Fiji (FJT)' },
  
  // GMT+13
  { value: 'Pacific/Tongatapu', label: '(GMT+13) 🇹🇴 Nuku\'alofa (TOT)' },
  
  // GMT+14
  { value: 'Pacific/Kiritimati', label: '(GMT+14) 🇰🇮 Kiritimati (LINT)' },
];

// Get user's timezone preference from localStorage or detect from browser
export function getUserTimezone(): string {
  const stored = localStorage.getItem(TIMEZONE_KEY);
  if (stored) return stored;
  
  // Try to detect from browser
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return detected;
  } catch {
    return 'America/New_York'; // fallback
  }
}

// Save user's timezone preference
export function setUserTimezone(timezone: string): void {
  localStorage.setItem(TIMEZONE_KEY, timezone);
}

// Format a date in the user's timezone
export function formatDateInUserTz(
  date: Date | string | number,
  formatString: string = 'MMM d, yyyy',
  timezone?: string
): string {
  try {
    const tz = timezone || getUserTimezone();
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    // Check if the date is valid
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return formatInTimeZone(dateObj, tz, formatString);
  } catch (error) {
    console.error('Error formatting date:', error, 'Date:', date);
    return 'Invalid date';
  }
}

// Format a datetime in the user's timezone
export function formatDateTimeInUserTz(
  date: Date | string | number,
  formatString: string = 'MMM d, yyyy h:mm a',
  timezone?: string
): string {
  try {
    const tz = timezone || getUserTimezone();
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    // Check if the date is valid
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return formatInTimeZone(dateObj, tz, formatString);
  } catch (error) {
    console.error('Error formatting datetime:', error, 'Date:', date);
    return 'Invalid date';
  }
}

// Convert a local date string (from date input) to UTC Date object
export function localDateToUTC(dateString: string): Date {
  // Date input gives us YYYY-MM-DD in local timezone
  // We want to treat it as a date at noon in the user's timezone and convert to UTC
  const tz = getUserTimezone();
  const dateTime = `${dateString}T12:00:00`;
  const date = new Date(dateTime);
  return date;
}

