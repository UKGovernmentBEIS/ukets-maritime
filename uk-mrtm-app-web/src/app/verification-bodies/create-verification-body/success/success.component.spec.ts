import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { VerificationBodiesService, VerifierAuthoritiesService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { screen } from '@testing-library/angular';
import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';
import { SuccessComponent } from '@verification-bodies/create-verification-body/success';
import { mockedVerificationBodyCreationDTO } from '@verification-bodies/testing/verification-bodies-data.mock';

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;
  let store: VerificationBodiesStoreService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessComponent],
      providers: [
        { provide: VerificationBodiesService, useValue: mockClass(VerificationBodiesService) },
        { provide: VerifierAuthoritiesService, useValue: mockClass(VerifierAuthoritiesService) },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(VerificationBodiesStoreService);
    store.setNewVerificationBody(mockedVerificationBodyCreationDTO);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct success text', () => {
    expect(screen.getByText(`Verification body ${mockedVerificationBodyCreationDTO.name} has been added`)).toBeTruthy();
  });
});
