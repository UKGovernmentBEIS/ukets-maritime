import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { VerificationBodiesService, VerifierAuthoritiesService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';
import { mockedVerificationBodies } from '@verification-bodies/testing/verification-bodies-data.mock';
import { VerificationBodiesComponent } from '@verification-bodies/verification-bodies.component';

describe('VerificationBodiesComponent', () => {
  let component: VerificationBodiesComponent;
  let fixture: ComponentFixture<VerificationBodiesComponent>;
  let store: VerificationBodiesStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationBodiesComponent],
      providers: [
        { provide: VerificationBodiesService, useValue: mockClass(VerificationBodiesService) },
        { provide: VerifierAuthoritiesService, useValue: mockClass(VerifierAuthoritiesService) },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();
    store = TestBed.inject(VerificationBodiesStoreService);
    store.setState({
      ...store.getState(),
      verificationBodiesList: {
        items: mockedVerificationBodies,
        editable: true,
      },
    });
    fixture = TestBed.createComponent(VerificationBodiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
