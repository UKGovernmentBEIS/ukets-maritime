import { CalendarDate } from '@shared/components/date-picker/date-picker.interface';
import { DatePickerChunkPipe } from '@shared/components/date-picker/pipes/date-picker-chunk.pipe';

describe('DatePickerChunkPipe', () => {
  const pipe = new DatePickerChunkPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform CalendarDate[] to double array based on chunkSize', () => {
    const calendarDates: CalendarDate[] = Array(42).fill(null);
    const expectedDates = Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));
    expect(pipe.transform(calendarDates, 7)).toEqual(expectedDates);
  });
});
