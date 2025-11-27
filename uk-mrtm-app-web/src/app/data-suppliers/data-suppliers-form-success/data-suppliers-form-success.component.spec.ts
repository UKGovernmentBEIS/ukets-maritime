import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { DataSuppliersStore } from '@data-suppliers/+state';
import { DataSuppliersFormSuccessComponent } from '@data-suppliers/data-suppliers-form-success/data-suppliers-form-success.component';
import { singleDataSupplierItemCreateDTO } from '@data-suppliers/testing/data-suppliers.mock';

describe('DataSuppliersFormSuccessComponent', () => {
  class Page extends BasePage<DataSuppliersFormSuccessComponent> {}

  let component: DataSuppliersFormSuccessComponent;
  let fixture: ComponentFixture<DataSuppliersFormSuccessComponent>;
  let store: DataSuppliersStore;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSuppliersFormSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataSuppliersFormSuccessComponent);
    store = TestBed.inject(DataSuppliersStore);
    store.setNewItem(singleDataSupplierItemCreateDTO);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading1.textContent).toContain(`Data supplier ${singleDataSupplierItemCreateDTO.name} has been added`);
    expect(page.query('a[govukLink]').textContent).toEqual('Return to: Manage data suppliers');
  });
});
