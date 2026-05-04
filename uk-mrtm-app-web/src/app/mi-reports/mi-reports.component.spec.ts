import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { miReportTypeDescriptionMap } from '@mi-reports/core/mi-report';
import { MiReportsComponent } from '@mi-reports/mi-reports.component';

describe('MiReportsComponent', () => {
  let component: MiReportsComponent;
  let fixture: ComponentFixture<MiReportsComponent>;
  let page: Page;

  const miReports = [
    { id: 1, miReportType: 'LIST_OF_ACCOUNTS_USERS_CONTACTS' },
    { id: 2, miReportType: 'CUSTOM' },
  ];

  class Page extends BasePage<MiReportsComponent> {
    get cells(): HTMLTableCellElement[] {
      return Array.from(this.queryAll<HTMLTableCellElement>('td'));
    }
  }

  const routeStub = new ActivatedRouteStub(null, null, {
    miReports: miReports,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiReportsComponent, PageHeadingComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: routeStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiReportsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create table with expected content', () => {
    const cells = page.cells;
    expect(cells.length).toEqual(2);

    const reportDescriptions = cells.map((c) => c.textContent);
    const expectedDescriptions = miReports
      .map((r) => miReportTypeDescriptionMap[r.miReportType])
      .sort((a, b) => a.localeCompare(b));
    reportDescriptions.forEach((value, index) => {
      expect(value).toEqual(expectedDescriptions[index]);
    });
  });
});
