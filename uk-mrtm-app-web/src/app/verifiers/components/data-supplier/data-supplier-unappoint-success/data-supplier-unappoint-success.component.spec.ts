import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { DataSupplierUnappointSuccessComponent } from '@verifiers/components/data-supplier/data-supplier-unappoint-success/data-supplier-unappoint-success.component';

describe('DataSupplierUnappointSuccessComponent', () => {
  class Page extends BasePage<DataSupplierUnappointSuccessComponent> {}

  let component: DataSupplierUnappointSuccessComponent;
  let fixture: ComponentFixture<DataSupplierUnappointSuccessComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSupplierUnappointSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DataSupplierUnappointSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.query('.govuk-panel__title').textContent).toEqual('You have no data supplier appointed');
    expect(page.query('.govuk-link').textContent).toEqual('Return to: Manage users');
  });
});
