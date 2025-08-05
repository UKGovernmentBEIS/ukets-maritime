import { Pipe, PipeTransform } from '@angular/core';

import { MrtmItemDTO } from '@mrtm/api';

@Pipe({
  name: 'itemType',
  standalone: true,
})
export class ItemTypePipe implements PipeTransform {
  transform(value: MrtmItemDTO['requestType']): string {
    switch (value) {
      default:
        return null;
    }
  }
}
