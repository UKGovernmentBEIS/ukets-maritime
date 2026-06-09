import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  AccountSearchResultInfoDTO,
  ItemDTOResponse,
  ItemsAssignedToMeService,
  ItemsAssignedToOthersService,
  ItemSearchCriteriaDTO,
  MaritimeAccountsService,
  UnassignedItemsService,
} from '@mrtm/api';

import { WorkflowItemsAssignmentType } from '@shared/dashboard/+store';
import { MrtmRequestType } from '@shared/types';

@Injectable()
export class WorkflowItemsService {
  private readonly itemsAssignedToMeService = inject(ItemsAssignedToMeService);
  private readonly itemsAssignedToOthersService = inject(ItemsAssignedToOthersService);
  private readonly unassignedItemsService = inject(UnassignedItemsService);
  private readonly accountsService = inject(MaritimeAccountsService);

  getRelatedAccounts(): Observable<Array<AccountSearchResultInfoDTO>> {
    return this.accountsService.getMrtmAccountsInfoByUser().pipe(map((response) => response ?? []));
  }

  getItems(
    type: WorkflowItemsAssignmentType,
    page: number,
    pageSize: number,
    orderBy: 'NEWEST_FIRST' | 'NEAREST_DUE_DATE',
    accountId?: string,
    requestType?: MrtmRequestType,
  ): Observable<ItemDTOResponse> {
    const filters: ItemSearchCriteriaDTO = {
      orderBy,
      requestType,
      searchTerm: accountId,
    };

    switch (type) {
      case 'unassigned':
        return this.unassignedItemsService.getUnassignedItems(page - 1, pageSize, filters);
      case 'assigned-to-others':
        return this.itemsAssignedToOthersService.getAssignedToOthersItems(page - 1, pageSize, filters);
      case 'assigned-to-me':
      default:
        return this.itemsAssignedToMeService.getAssignedItems(page - 1, pageSize, filters);
    }
  }
}
