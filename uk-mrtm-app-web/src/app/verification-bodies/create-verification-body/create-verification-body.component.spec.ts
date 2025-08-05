import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { VerificationBodiesService, VerifierAuthoritiesService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { CreateVerificationBodyComponent } from '@verification-bodies//create-verification-body/create-verification-body.component';

describe('CreateVerificationBodyComponent', () => {
  let component: CreateVerificationBodyComponent;
  let fixture: ComponentFixture<CreateVerificationBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVerificationBodyComponent],
      providers: [
        { provide: VerificationBodiesService, useValue: mockClass(VerificationBodiesService) },
        { provide: VerifierAuthoritiesService, useValue: mockClass(VerifierAuthoritiesService) },
        { provide: CountryService, useClass: CountryServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVerificationBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
