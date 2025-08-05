import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { VerificationBodiesService, VerifierAuthoritiesService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { VerificationBodyDetailsComponent } from '@verification-bodies/verification-body-details/verification-body-details.component';

describe('VerificationBodyDetailsComponent', () => {
  let component: VerificationBodyDetailsComponent;
  let fixture: ComponentFixture<VerificationBodyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationBodyDetailsComponent],
      providers: [
        { provide: VerificationBodiesService, useValue: mockClass(VerificationBodiesService) },
        { provide: VerifierAuthoritiesService, useValue: mockClass(VerifierAuthoritiesService) },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: CountryService, useClass: CountryServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationBodyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
