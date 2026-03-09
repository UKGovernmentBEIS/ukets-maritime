import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrtmAccountViewDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';

import { OperatorAccountSummaryInfoComponent } from '@accounts/components';

@Component({
  selector: 'mrtm-test-parent',
  template: `
    <netz-create-operator-account-summary [summaryInfo]="summaryInfo"></netz-create-operator-account-summary>
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
      declarations: [TestParentComponent],
      imports: [GovukDatePipe, OperatorAccountSummaryInfoComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
