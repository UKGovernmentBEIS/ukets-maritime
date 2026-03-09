import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { DataSuppliersFormSummaryComponent } from '@data-suppliers//data-suppliers-form-summary/data-suppliers-form-summary.component';
import { DataSuppliersStore } from '@data-suppliers/+state';
import { DataSuppliersService } from '@data-suppliers/services/data-suppliers.service';
import { singleDataSupplierItemCreateDTO } from '@data-suppliers/testing/data-suppliers.mock';

describe('DataSuppliersFormSummaryComponent', () => {
  class Page extends BasePage<DataSuppliersFormSummaryComponent> {}
  let component: DataSuppliersFormSummaryComponent;
  let fixture: ComponentFixture<DataSuppliersFormSummaryComponent>;
  let store: DataSuppliersStore;
  let service: DataSuppliersService;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSuppliersFormSummaryComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataSuppliersFormSummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    store = TestBed.inject(DataSuppliersStore);
    service = TestBed.inject(DataSuppliersService);
    store.setNewItem(singleDataSupplierItemCreateDTO);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading1.textContent).toContain('Check your answers');
    expect(page.summariesContents).toEqual(['Name of data supplier', 'Vessel Tracking Systems Inc', 'Change']);
    expect(page.submitButton.textContent).toContain('Submit');
  });

  it('should submit new data supplier', () => {
    const serviceSpy = jest.spyOn(service, 'addNewItem');
    page.submitButton.click();
    fixture.detectChanges();
    expect(serviceSpy).toHaveBeenCalledWith(singleDataSupplierItemCreateDTO);
  });
});
