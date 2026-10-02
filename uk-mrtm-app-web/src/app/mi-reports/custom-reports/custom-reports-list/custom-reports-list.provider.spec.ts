import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActivatedRouteStub } from '@netz/common/testing';

import { provideCustomReportsListFiltersForm } from '@mi-reports/custom-reports/custom-reports-list/custom-reports-list.provider';

describe('provideCustomReportsListFiltersForm', () => {
  const buildForm = (queryParams: Record<string, string>): FormGroup => {
    const fb = TestBed.inject(FormBuilder);
    const activatedRoute = new ActivatedRouteStub({}, queryParams);

    return TestBed.runInInjectionContext(() =>
      (provideCustomReportsListFiltersForm as any).useFactory(fb, activatedRoute),
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should initialise controls to null defaults when there are no query params', () => {
    const form = buildForm({});

    expect(form.value).toEqual({ categoryId: null, term: null, favourites: [null] });
  });

  it('should parse categoryId as a number from query params', () => {
    const form = buildForm({ categoryId: '3' });

    expect(form.get('categoryId').value).toBe(3);
  });

  it('should set term from query params', () => {
    const form = buildForm({ term: 'search' });

    expect(form.get('term').value).toBe('search');
  });

  it('should set favourites from query params', () => {
    const form = buildForm({ favourites: 'true' });

    expect(form.get('favourites').value).toEqual([true]);
  });
});
