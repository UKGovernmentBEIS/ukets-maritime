import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  ItemDTOResponse,
  ItemsAssignedToMeService,
  ItemsAssignedToOthersService,
  UnassignedItemsService,
} from '@mrtm/api';

import { WorkflowItemsAssignmentType } from '@shared/dashboard/+store';

@Injectable()
export class WorkflowItemsService {
  private readonly itemsAssignedToMeService = inject(ItemsAssignedToMeService);
  private readonly itemsAssignedToOthersService = inject(ItemsAssignedToOthersService);
  private readonly unassignedItemsService = inject(UnassignedItemsService);

  getItems(type: WorkflowItemsAssignmentType, page: number, pageSize: number): Observable<ItemDTOResponse> {
    switch (type) {
      case 'unassigned':
        return this.unassignedItemsService.getUnassignedItems(page - 1, pageSize);
      case 'assigned-to-others':
        return this.itemsAssignedToOthersService.getAssignedToOthersItems(page - 1, pageSize);
      case 'assigned-to-me':
      default:
        return this.itemsAssignedToMeService.getAssignedItems(page - 1, pageSize);
    }
  }
}
