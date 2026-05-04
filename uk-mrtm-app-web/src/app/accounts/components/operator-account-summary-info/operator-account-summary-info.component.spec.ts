import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MrtmAccountViewDTO } from '@mrtm/api';

import { ActivatedRouteStub } from '@netz/common/testing';

import { OperatorAccountSummaryInfoComponent } from '@accounts/components';

@Component({
  selector: 'mrtm-test-parent',
  imports: [OperatorAccountSummaryInfoComponent],
  template: `
    <mrtm-operator-account-summary-info [summaryInfo]="summaryInfo" />
  `,
})
class TestParentComponent {
  summaryInfo: MrtmAccountViewDTO = {
    name: 'TEST',
    imoNumber: '1231234',
    firstMaritimeActivityDate: '1978-03-25',
    line1: 'TestLine1',
    country: 'PL',
    city: 'Jelenia Góra',
  };
}

describe('OperatorAccountSummaryInfoComponent', () => {
  let component: TestParentComponent;
  let fixture: ComponentFixture<TestParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
