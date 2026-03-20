import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DataSupplierTabComponent } from '@verification-bodies/components/data-supplier-tab/data-supplier-tab.component';

describe('DataSupplierTabComponent', () => {
  let component: DataSupplierTabComponent;
  let fixture: ComponentFixture<DataSupplierTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSupplierTabComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DataSupplierTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
