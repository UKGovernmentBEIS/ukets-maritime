import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VerifierDataSuppliersTabComponent } from '@service-access/data-suppliers/verifier-data-suppliers-tab/verifier-data-suppliers-tab.component';

describe('VerifierDataSuppliersTabComponent', () => {
  let component: VerifierDataSuppliersTabComponent;
  let fixture: ComponentFixture<VerifierDataSuppliersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifierDataSuppliersTabComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifierDataSuppliersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
