import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { DataSuppliersStore } from '@service-access/data-suppliers/+state';
import { RegulatorDataSuppliersTabComponent } from '@service-access/data-suppliers/regulator-data-suppliers-tab';
import { DataSuppliersService } from '@service-access/data-suppliers/services/data-suppliers.service';
import { mockDataSuppliers } from '@service-access/data-suppliers/testing/data-suppliers.mock';

describe('RegulatorDataSuppliersTabComponent', () => {
  class Page extends BasePage<RegulatorDataSuppliersTabComponent> {}

  let component: RegulatorDataSuppliersTabComponent;
  let fixture: ComponentFixture<RegulatorDataSuppliersTabComponent>;
  let page: Page;
  let store: DataSuppliersStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegulatorDataSuppliersTabComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: DataSuppliersService, useValue: { loadItems: () => of(true) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegulatorDataSuppliersTabComponent);
    store = TestBed.inject(DataSuppliersStore);
    store.setIsEditable(true);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.tableContents).toEqual(['Data supplier name', 'Public key URL', 'Client ID', 'No items to display']);
    expect(page.query('a[govukbutton]').textContent).toEqual('Add a new data supplier');
    store.setItems(mockDataSuppliers);
    fixture.detectChanges();
    expect(page.tableContents).toEqual([
      'Data supplier name',
      'Public key URL',
      'Client ID',
      'Maritime Analytics Ltd',
      'https://www.myapi1.com',
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'Ocean Data Solutions',
      'https://myapi2.com',
      'f7e8d9c0-b1a2-3456-789a-bcdef0123456',
    ]);
  });
});
