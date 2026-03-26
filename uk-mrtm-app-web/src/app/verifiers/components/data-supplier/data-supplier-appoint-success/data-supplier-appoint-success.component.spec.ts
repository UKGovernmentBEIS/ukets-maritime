import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { BasePage } from '@netz/common/testing';

import { DataSupplierAppointSuccessComponent } from '@verifiers/components/data-supplier/data-supplier-appoint-success/data-supplier-appoint-success.component';

describe('DataSupplierAppointSuccessComponent', () => {
  class Page extends BasePage<DataSupplierAppointSuccessComponent> {}

  let component: DataSupplierAppointSuccessComponent;
  let fixture: ComponentFixture<DataSupplierAppointSuccessComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSupplierAppointSuccessComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              dataSupplierName: 'test',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataSupplierAppointSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.query('.govuk-panel__title').textContent).toEqual('You have appointed a data supplier');
    expect(page.query('.govuk-panel__body').textContent).toEqual('test');
    expect(page.query('.govuk-link').textContent).toEqual('Return to: Manage users');
  });
});
