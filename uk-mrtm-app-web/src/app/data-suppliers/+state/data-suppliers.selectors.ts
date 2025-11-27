import { ThirdPartyDataProviderCreateDTO } from '@mrtm/api';

import { createSelector, StateSelector } from '@netz/common/store';

import { DataSupplierItem, DataSuppliersState } from '@data-suppliers/data-suppliers.types';

const selectItems: StateSelector<DataSuppliersState, Array<DataSupplierItem>> = createSelector(
  (payload) => payload?.items ?? [],
);

const selectIsEditable: StateSelector<DataSuppliersState, boolean> = createSelector(
  (payload) => payload?.isEditable ?? false,
);

const selectNewItem: StateSelector<DataSuppliersState, ThirdPartyDataProviderCreateDTO> = createSelector(
  (payload) => payload?.newItem,
);

export const dataSuppliersQuery = { selectItems, selectNewItem, selectIsEditable };
