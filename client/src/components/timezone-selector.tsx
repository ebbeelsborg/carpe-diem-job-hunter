import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { commonTimezones, getUserTimezone, setUserTimezone } from '@/lib/timezone';

interface TimezoneSelectorProps {
  compact?: boolean;
}

export function TimezoneSelector({ compact = false }: TimezoneSelectorProps) {
  const [timezone, setTimezone] = useState<string>(getUserTimezone());

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    setUserTimezone(newTimezone);
    // Trigger a page refresh to update all displayed times
    window.location.reload();
  };

  // Get flag and city name from timezone label (e.g., "🇺🇸 New York", "🇬🇧 London")
  const getCityName = (label: string) => {
    // Extract flag and city from patterns like "(GMT-5) 🇺🇸 New York (EST)"
    const match = label.match(/\)\s+([\p{Emoji}]+)\s+([^(]+)\s+\(/u);
    if (match) return `${match[1]} ${match[2].trim()}`;
    
    // Fallback for cities without flags
    const simpleMatch = label.match(/\)\s+([^(]+)\s+\(/);
    if (simpleMatch) return simpleMatch[1].trim();
    
    // Fallback
    return label.split(' ')[1] || 'TZ';
  };

  const currentTz = commonTimezones.find(tz => tz.value === timezone);
  const currentLabel = currentTz?.label || timezone;
  const currentCity = currentTz ? getCityName(currentTz.label) : 'Timezone';

  if (compact) {
    return (
      <Select value={timezone} onValueChange={handleTimezoneChange}>
        <SelectTrigger className="w-[260px] h-10">
          <Globe className="h-4 w-4 mr-2" />
          <SelectValue>
            {currentCity}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {commonTimezones.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={timezone} onValueChange={handleTimezoneChange}>
      <SelectTrigger className="w-full">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue>
          {currentLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {commonTimezones.map((tz) => (
          <SelectItem key={tz.value} value={tz.value}>
            {tz.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

