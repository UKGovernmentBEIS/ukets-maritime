import { inject, Pipe, PipeTransform } from '@angular/core';

import { MrtmItemDTO } from '@mrtm/api';

import { ITEM_NAME_TRANSFORMER } from './item-name.providers';
import { ItemNameTransformer } from './item-name.types';

@Pipe({
  name: 'itemName',
  standalone: true,
  pure: true,
})
export class ItemNamePipe implements PipeTransform {
  private readonly itemNameTransformer: ItemNameTransformer = inject(ITEM_NAME_TRANSFORMER);

  transform(value: MrtmItemDTO['taskType'], year?: string | number): string {
    return this.itemNameTransformer(value, year);
  }
}
