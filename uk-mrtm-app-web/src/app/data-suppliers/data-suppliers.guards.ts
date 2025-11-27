import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, Router } from '@angular/router';

import { iif, of, take } from 'rxjs';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

import { dataSuppliersQuery, DataSuppliersStore } from '@data-suppliers/+state';
import { isDataSupplierValid } from '@data-suppliers/data-suppliers.helpers';
import { DataSuppliersService } from '@data-suppliers/services/data-suppliers.service';

export const canActivateDataSuppliers: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const userRole = authStore.select(selectUserRoleType)();
  const service = inject(DataSuppliersService);
  const router = inject(Router);

  service.loadItems().pipe(take(1)).subscribe();

  return iif(() => userRole === 'REGULATOR', service.loadItems(), of(router.createUrlTree(['/dashboard'])));
};

export const canActivateDataSupplierForm: CanActivateFn = (activatedRoute: ActivatedRouteSnapshot) => {
  const store = inject(DataSuppliersStore);
  const isEditable = store.select(dataSuppliersQuery.selectIsEditable)();
  store.resetNewItem();

  return isEditable || createUrlTreeFromSnapshot(activatedRoute, ['../']);
};

export const canActivateDataSupplierSummary: CanActivateFn = (activatedRoute: ActivatedRouteSnapshot) => {
  const store = inject(DataSuppliersStore);
  const newItem = store.select(dataSuppliersQuery.selectNewItem)();

  return isDataSupplierValid(newItem) || createUrlTreeFromSnapshot(activatedRoute, ['../']);
};
