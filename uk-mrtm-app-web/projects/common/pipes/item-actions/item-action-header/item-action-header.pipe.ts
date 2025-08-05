import { inject, Pipe, PipeTransform } from '@angular/core';

import { RequestActionDTO, RequestActionInfoDTO } from '@mrtm/api';

import { ITEM_ACTION_TRANSFORMER, ItemActionTransformer } from '../item-actions.providers';

@Pipe({ name: 'itemActionHeader', standalone: true, pure: true })
export class ItemActionHeaderPipe implements PipeTransform {
  private readonly itemActionTransformer: ItemActionTransformer = inject(ITEM_ACTION_TRANSFORMER);

  transform(item: RequestActionDTO | RequestActionInfoDTO, year?: string | number): string {
    return this.itemActionTransformer(item.type, year, item.submitter);
  }
}
