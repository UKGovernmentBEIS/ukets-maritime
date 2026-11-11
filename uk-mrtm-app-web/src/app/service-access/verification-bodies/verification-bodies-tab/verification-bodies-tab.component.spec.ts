import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { VerificationBodiesService, VerifierAuthoritiesService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { VerificationBodiesStoreService } from '@service-access/verification-bodies/+state/verification-bodies-store.service';
import { mockedVerificationBodies } from '@service-access/verification-bodies/testing/verification-bodies-data.mock';
import { VerificationBodiesTabComponent } from '@service-access/verification-bodies/verification-bodies-tab/verification-bodies-tab.component';

describe('VerificationBodiesTabComponent', () => {
  let component: VerificationBodiesTabComponent;
  let fixture: ComponentFixture<VerificationBodiesTabComponent>;
  let store: VerificationBodiesStoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationBodiesTabComponent],
      providers: [
        { provide: VerificationBodiesService, useValue: mockClass(VerificationBodiesService) },
        { provide: VerifierAuthoritiesService, useValue: mockClass(VerifierAuthoritiesService) },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();
    const verificationBodiesService = TestBed.inject(VerificationBodiesService);
    (verificationBodiesService.getVerificationBodies as ReturnType<typeof vi.fn>).mockReturnValue(
      of({ verificationBodies: mockedVerificationBodies, editable: true }),
    );
    // The store is intentionally not pre-populated: rendered inside a lazy
    // tab, the component is created before any data is loaded and triggers
    // the load itself
    store = TestBed.inject(VerificationBodiesStoreService);
    fixture = TestBed.createComponent(VerificationBodiesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the verification bodies and build a form row per item', () => {
    expect(store.getState().verificationBodiesList.items).toEqual(mockedVerificationBodies);
    expect(component.formGroup.get('verificationBodies').value).toEqual(
      mockedVerificationBodies.map(({ id, status }) => ({ id, status })),
    );
  });
});
