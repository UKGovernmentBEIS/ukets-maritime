import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { ActivatedRouteStub, asyncData, MockType } from '@netz/common/testing';

import { CustomReportsListComponent } from '@mi-reports/custom-reports/custom-reports-list/custom-reports-list.component';

describe('CustomReportsListComponent', () => {
  let component: CustomReportsListComponent;
  let fixture: ComponentFixture<CustomReportsListComponent>;
  let service: MockType<MiReportsUserDefinedService>;
  let router: Router;

  const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ];
  const queries = [{ id: 1, reportName: 'Report 1' }];

  const createFixture = async (queryParams: Record<string, string> = {}, total = 0) => {
    service = {
      getCategories: vi.fn().mockReturnValue(asyncData(categories)),
      getAllMiReportsUserDefined: vi.fn().mockReturnValue(asyncData({ queries, total })),
    };

    await TestBed.configureTestingModule({
      imports: [CustomReportsListComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, queryParams) },
        { provide: MiReportsUserDefinedService, useValue: service },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(CustomReportsListComponent);
    component = fixture.componentInstance;
  };

  const setup = async (queryParams: Record<string, string> = {}, total = 0) => {
    await createFixture(queryParams, total);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should request data using the query params and expose the results', async () => {
    await setup({ categoryId: '2', term: 'search', favourites: 'true', page: '2', sort: 'DESC' }, 25);

    expect(service.getAllMiReportsUserDefined).toHaveBeenCalledWith(1, 10, {
      favourites: 'true',
      term: 'search',
      categoryId: '2',
      sortBy: 'REPORT_NAME',
      direction: 'DESC',
    });
    expect((component as any).data()).toEqual([{ id: 1, reportName: 'Report 1', categories: '' }]);
    expect((component as any).totalPages()).toBe(25);
  });

  it('should join the report category names into a comma separated list', async () => {
    await createFixture();
    service.getAllMiReportsUserDefined.mockReturnValue(
      asyncData({ queries: [{ id: 1, reportName: 'Report 1', categories }], total: 1 }) as any,
    );
    fixture = TestBed.createComponent(CustomReportsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect((component as any).data()).toEqual([
      { id: 1, reportName: 'Report 1', categories: 'Category 1, Category 2' },
    ]);
  });

  it('should prepend an "All" option to the available categories', async () => {
    await setup();

    expect((component as any).availableCategories()).toEqual([
      { text: 'All', value: null },
      { text: 'Category 1', value: 1 },
      { text: 'Category 2', value: 2 },
    ]);
  });

  describe('emptyTableText', () => {
    it('should be empty while the reports are loading', async () => {
      await setup();
      const pending = new Subject<{ queries: typeof queries; total: number }>();
      service.getAllMiReportsUserDefined.mockReturnValue(pending as any);

      (TestBed.inject(ActivatedRoute) as unknown as ActivatedRouteStub).setQueryParamMap({ page: '2' });

      expect((component as any).emptyTableText()).toBe('');

      pending.next({ queries: [], total: 0 });
      pending.complete();

      expect((component as any).emptyTableText()).toBe('There are no reports available');
    });

    it('should show the default message when no filters are applied', async () => {
      await setup();

      expect((component as any).emptyTableText()).toBe('There are no reports available');
    });

    it.each([{ term: 'report' }, { categoryId: '2' }, { favourites: 'true' }])(
      'should show search guidance when filters are applied: %o',
      async (queryParams) => {
        await setup(queryParams);

        expect((component as any).emptyTableText()).toContain('There are no matching reports.');
      },
    );
  });

  describe('sync filters to the URL', () => {
    it('should navigate with undefined categoryId and favourites on init when no filters are applied', async () => {
      await createFixture();
      const navigateSpy = vi.spyOn(router, 'navigate');

      fixture.detectChanges();
      await fixture.whenStable();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({
          queryParamsHandling: 'merge',
          preserveFragment: true,
          queryParams: { categoryId: undefined, favourites: undefined },
        }),
      );
    });

    it('should navigate with the selected categoryId', async () => {
      await setup();
      const navigateSpy = vi.spyOn(router, 'navigate');

      (component as any).formGroup.get('categoryId').setValue(2);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({
          queryParams: expect.objectContaining({ categoryId: 2 }),
        }),
      );
    });

    it('should navigate with favourites true when all favourite checkboxes are checked', async () => {
      await setup();
      const navigateSpy = vi.spyOn(router, 'navigate');

      (component as any).formGroup.get('favourites').setValue([true]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({
          queryParams: expect.objectContaining({ favourites: true }),
        }),
      );
    });

    it('should navigate with favourites undefined when not all favourite checkboxes are checked', async () => {
      await setup();
      const navigateSpy = vi.spyOn(router, 'navigate');

      (component as any).formGroup.get('favourites').setValue([false]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({
          queryParams: expect.objectContaining({ favourites: undefined }),
        }),
      );
    });
  });

  describe('onSearch', () => {
    beforeEach(async () => setup());

    it('should reset the page in the url so the results start from the first page', async () => {
      TestBed.resetTestingModule();
      await setup({ term: 'old', page: '3' });
      const navigateSpy = vi.spyOn(router, 'navigate');
      (component as any).formGroup.get('term').setValue('new');

      (component as any).onSearch();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({ queryParamsHandling: 'merge', queryParams: { term: 'new', page: undefined } }),
      );
    });

    it('should navigate with the trimmed search term', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      (component as any).formGroup.get('term').setValue('  search term  ');

      (component as any).onSearch();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({
          relativeTo: expect.anything(),
          queryParamsHandling: 'merge',
          preserveFragment: true,
          queryParams: { term: 'search term', page: undefined },
        }),
      );
    });

    it('should navigate with an undefined term when the search is empty', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      (component as any).formGroup.get('term').setValue('   ');

      (component as any).onSearch();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({ queryParams: { term: undefined, page: undefined } }),
      );
    });
  });

  describe('search while typing', () => {
    beforeEach(async () => {
      await setup();
      vi.useFakeTimers();
    });

    afterEach(() => vi.useRealTimers());

    it('should search once with the latest term after the user stops typing', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      const termCtrl = (component as any).formGroup.get('term');

      termCtrl.setValue('re');
      vi.advanceTimersByTime(100);
      termCtrl.setValue('report ');
      vi.advanceTimersByTime(299);

      expect(navigateSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(
        ['.'],
        expect.objectContaining({ queryParams: { term: 'report', page: undefined } }),
      );
    });

    it('should not search again when only surrounding whitespace changes', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      const termCtrl = (component as any).formGroup.get('term');

      termCtrl.setValue('report');
      vi.advanceTimersByTime(300);
      termCtrl.setValue('report  ');
      vi.advanceTimersByTime(300);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSort', () => {
    beforeEach(async () => setup());

    it('should navigate with sort DESC when sorting descending', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      (component as any).onSort({ column: 'reportName', direction: 'descending' });

      expect(navigateSpy).toHaveBeenCalledWith(['.'], expect.objectContaining({ queryParams: { sort: 'DESC' } }));
    });

    it('should navigate with sort undefined when sorting ascending', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      (component as any).onSort({ column: 'reportName', direction: 'ascending' });

      expect(navigateSpy).toHaveBeenCalledWith(['.'], expect.objectContaining({ queryParams: { sort: undefined } }));
    });
  });
});
