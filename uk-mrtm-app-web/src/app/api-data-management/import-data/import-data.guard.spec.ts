import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';

import { IMPORT_DATA_WIZARD_STEP } from '@api-data-management/api-data-management.constants';
import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import {
  canActivateImportData,
  canActivateImportDataSuccess,
  canActivateImportDataSummary,
  canActivateSelectAccountsStep,
  canDeactivateImportData,
} from '@api-data-management/import-data/import-data.guard';

@Component({
  selector: 'mrtm-test-dummy',
  template: '',
})
class DummyComponent {}

// Bare (unguarded) mirror of `IMPORT_DATA_ROUTES` so a real, fully-formed `ActivatedRouteSnapshot`
// can be obtained for each step by navigating to it, then passed manually into the guard under test.
const routes: Routes = [
  { path: '', component: DummyComponent },
  { path: IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE, component: DummyComponent },
  { path: IMPORT_DATA_WIZARD_STEP.SELECT_OPERATOR_ACCOUNTS, component: DummyComponent },
  { path: IMPORT_DATA_WIZARD_STEP.SUCCESS, component: DummyComponent },
];

describe('import-data guards', () => {
  let store: ImportDataStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    store = TestBed.inject(ImportDataStore);
    router = TestBed.inject(Router);
  });

  describe('canActivateImportDataSummary', () => {
    it('should allow activation when accounts have been selected for a chosen task', async () => {
      store.setState({ requestType: 'AER', items: [1, 2] });
      await router.navigateByUrl('/');
      const route = router.routerState.snapshot.root.firstChild;

      const result = TestBed.runInInjectionContext(() =>
        canActivateImportDataSummary(route, router.routerState.snapshot),
      );

      expect(result).toBe(true);
    });

    it('should redirect to the select-task-type step when no accounts have been selected', async () => {
      store.setState({ requestType: 'AER', items: [] });
      await router.navigateByUrl('/');
      const route = router.routerState.snapshot.root.firstChild;

      const result = TestBed.runInInjectionContext(() =>
        canActivateImportDataSummary(route, router.routerState.snapshot),
      );

      expect(result).toEqual(router.parseUrl(IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE));
    });

    it('should redirect to the select-task-type step when no request type is selected', async () => {
      store.setState({ requestType: undefined, items: [1, 2] });
      await router.navigateByUrl('/');
      const route = router.routerState.snapshot.root.firstChild;

      const result = TestBed.runInInjectionContext(() =>
        canActivateImportDataSummary(route, router.routerState.snapshot),
      );

      expect(result).toEqual(router.parseUrl(IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE));
    });
  });

  describe('canActivateImportDataSuccess', () => {
    it('should allow activation when accounts have been selected for a chosen task', async () => {
      store.setState({ requestType: 'AER', items: [1, 2] });
      await router.navigateByUrl(`/${IMPORT_DATA_WIZARD_STEP.SUCCESS}`);
      const route = router.routerState.snapshot.root.firstChild;

      const result = TestBed.runInInjectionContext(() =>
        canActivateImportDataSuccess(route, router.routerState.snapshot),
      );

      expect(result).toBe(true);
    });

    it('should redirect to the select-task-type step when nothing has been selected', async () => {
      store.setState({ requestType: undefined, items: [] });
      await router.navigateByUrl(`/${IMPORT_DATA_WIZARD_STEP.SUCCESS}`);
      const route = router.routerState.snapshot.root.firstChild;

      const result = TestBed.runInInjectionContext(() =>
        canActivateImportDataSuccess(route, router.routerState.snapshot),
      );

      expect(result).toEqual(router.parseUrl(IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE));
    });
  });

  describe('canActivateSelectAccountsStep', () => {
    it('should allow activation when a request type is already selected', async () => {
      store.setState({ requestType: 'AER' });
      await router.navigateByUrl(`/${IMPORT_DATA_WIZARD_STEP.SELECT_OPERATOR_ACCOUNTS}`);
      const route = router.routerState.snapshot.root.firstChild;

      const result = TestBed.runInInjectionContext(() =>
        canActivateSelectAccountsStep(route, router.routerState.snapshot),
      );

      expect(result).toBe(true);
    });

    it('should redirect to the select-task-type step when no request type is selected', async () => {
      store.setState({ requestType: undefined });
      await router.navigateByUrl(`/${IMPORT_DATA_WIZARD_STEP.SELECT_OPERATOR_ACCOUNTS}`);
      const route = router.routerState.snapshot.root.firstChild;

      const result = TestBed.runInInjectionContext(() =>
        canActivateSelectAccountsStep(route, router.routerState.snapshot),
      );

      expect(result).toEqual(router.parseUrl(IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE));
    });
  });

  describe('canActivateImportData', () => {
    it('should reset the store and allow activation', () => {
      store.setState({ requestType: 'AER', year: 2025 });

      const result = TestBed.runInInjectionContext(() => canActivateImportData(undefined, undefined));

      expect(result).toBe(true);
      expect(store.state).toEqual({});
    });
  });

  describe('canDeactivateImportData', () => {
    it('should reset the store and allow deactivation', () => {
      store.setState({ requestType: 'AER', year: 2025 });

      const result = TestBed.runInInjectionContext(() =>
        canDeactivateImportData(undefined, undefined, undefined, undefined),
      );

      expect(result).toBe(true);
      expect(store.state).toEqual({});
    });
  });
});
