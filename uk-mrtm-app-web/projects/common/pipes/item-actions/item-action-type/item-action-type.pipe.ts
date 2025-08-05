import { inject, Pipe, PipeTransform } from '@angular/core';

import { RequestActionInfoDTO } from '@mrtm/api';

import { ITEM_ACTION_TRANSFORMER, ItemActionTransformer } from '../item-actions.providers';

@Pipe({ name: 'itemActionType', standalone: true, pure: true })
export class ItemActionTypePipe implements PipeTransform {
  private readonly itemActionTransformer: ItemActionTransformer = inject(ITEM_ACTION_TRANSFORMER);

  transform(type: RequestActionInfoDTO['type'], year?: string | number): string {
    return this.itemActionTransformer(type, year);
  }
}
