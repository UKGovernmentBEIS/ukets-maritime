export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface CalendarDate {
  date: Date;
  dateHuman?: string;
  dateString?: string;
  isToday: boolean;
  isCurrent: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  isTabbable: boolean;
}

export interface DatePickerConfig {
  weekStartDay: 'Monday' | 'Sunday';
  leadingZeros: boolean;
  excludedDates?: string;
  excludedDays?: DayOfWeek[];
  minDate?: string;
  maxDate?: string;
}

export const datePickerConfigDefaults: DatePickerConfig = {
  weekStartDay: 'Monday',
  leadingZeros: false,
  excludedDates: null,
  excludedDays: null,
  minDate: null,
  maxDate: null,
};

export const dayLabels: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
