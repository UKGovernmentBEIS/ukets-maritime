import { Pipe, PipeTransform } from '@angular/core';

import { CalendarDate } from '@shared/components/date-picker/date-picker.interface';

@Pipe({
  name: 'datePickerChunk',
  standalone: true,
})
export class DatePickerChunkPipe implements PipeTransform {
  transform(calendarDates: CalendarDate[], chunkSize: number): CalendarDate[][] {
    const calendarDays = [];
    let weekDays = [];

    for (let index = 0; index < calendarDates?.length; index++) {
      weekDays.push(calendarDates[index]);

      if ((index + 1) % chunkSize === 0) {
        calendarDays.push(weekDays);
        weekDays = [];
      }
    }

    return calendarDays;
  }
}
