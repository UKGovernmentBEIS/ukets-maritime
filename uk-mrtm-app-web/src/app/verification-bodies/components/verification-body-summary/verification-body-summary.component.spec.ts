import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { VerificationBodyCreationDTO } from '@mrtm/api';

import { ActivatedRouteStub } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { VerificationBodySummaryComponent } from '@verification-bodies/components';
import { mockedVerificationBodyCreationDTO } from '@verification-bodies/testing/verification-bodies-data.mock';

@Component({
  selector: 'mrtm-test-parent',
  template: `
    <mrtm-verification-body-summary [summaryInfo]="summaryInfo"></mrtm-verification-body-summary>
  `,
})
class TestParentComponent {
  summaryInfo: VerificationBodyCreationDTO = mockedVerificationBodyCreationDTO;
}

describe('VerificationBodySummaryComponent', () => {
  let component: TestParentComponent;
  let fixture: ComponentFixture<TestParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestParentComponent],
      imports: [VerificationBodySummaryComponent],
      providers: [
        { provide: CountryService, useClass: CountryServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationBodySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
