import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optionalFieldLabel',
  standalone: true,
})
export class OptionalFieldLabelPipe implements PipeTransform {
  transform(label: string, optional: boolean = false): string {
    return optional ? `${label} (Optional)` : label;
  }
}
