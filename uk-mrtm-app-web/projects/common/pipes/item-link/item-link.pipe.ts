import { inject, Pipe, PipeTransform } from '@angular/core';

import { MrtmItemDTO } from '@mrtm/api';

import { ITEM_LINK_REQUEST_TYPES_WHITELIST } from './item-link.provider';

@Pipe({ name: 'itemLink', pure: true, standalone: true })
export class ItemLinkPipe implements PipeTransform {
  private readonly requestTypesWhitelist: string[] = inject(ITEM_LINK_REQUEST_TYPES_WHITELIST);

  transform(value: MrtmItemDTO, isWorkflow?: boolean): any[] {
    if (isWorkflow) {
      return this.transformWorkflowUrl(value, '/accounts/' + value.accountId + '/workflows/' + value.requestId + '/');
    } else {
      return this.transformWorkflowUrl(value, '/');
    }
  }

  private transformWorkflowUrl(value: MrtmItemDTO, routerLooks: string) {
    return this.requestTypesWhitelist.includes(value?.requestType) ? [routerLooks + 'tasks', value.taskId] : ['.'];
  }
}
