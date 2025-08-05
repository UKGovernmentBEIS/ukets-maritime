import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MiReportsListGuard } from '@mi-reports/core/mi-reports-list.guard';

describe('MiReportsListGuard', () => {
  let guard: MiReportsListGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    guard = TestBed.inject(MiReportsListGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });
});
