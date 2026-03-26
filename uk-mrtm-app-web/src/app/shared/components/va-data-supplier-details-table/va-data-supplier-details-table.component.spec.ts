import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaDataSupplierDetailsTableComponent } from '@shared/components/va-data-supplier-details-table';

describe('VaDataSupplierDetailsTableComponent', () => {
  let component: VaDataSupplierDetailsTableComponent;
  let fixture: ComponentFixture<VaDataSupplierDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaDataSupplierDetailsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VaDataSupplierDetailsTableComponent);
    fixture.componentRef.setInput('data', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
