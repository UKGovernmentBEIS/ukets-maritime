import { Pipe, PipeTransform } from '@angular/core';

import { GovukSelectOption } from '@netz/govuk-components';

@Pipe({
  name: 'selectOptionToTitle',
  standalone: true,
})
export class SelectOptionToTitlePipe implements PipeTransform {
  transform<T>(value: T, source: GovukSelectOption<T>[]): string | T {
    return source.find((item) => item.value === value)?.text ?? value;
  }
}
