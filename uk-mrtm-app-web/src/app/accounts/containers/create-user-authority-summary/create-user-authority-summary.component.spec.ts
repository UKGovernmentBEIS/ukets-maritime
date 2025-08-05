import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { throwError } from 'rxjs';

import { OperatorUsersInvitationService, OperatorUsersService } from '@mrtm/api';

import { ErrorCodes } from '@netz/common/error';
import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { CreateUserAuthoritySummaryComponent } from '@accounts/containers/create-user-authority-summary/create-user-authority-summary.component';
import {
  selectIsInitiallySubmitted,
  selectIsSubmitted,
  selectSubmissionErrors,
} from '@accounts/store/user-authority.selectors';
import { UserAuthorityStore } from '@accounts/store/user-authority.store';

describe('CreateUserAuthoritySummaryComponent', () => {
  let component: CreateUserAuthoritySummaryComponent;
  let fixture: ComponentFixture<CreateUserAuthoritySummaryComponent>;
  let service: OperatorUsersInvitationService;
  let router: Router;
  let store: UserAuthorityStore;

  const route = new ActivatedRouteStub({
    accountId: 1,
    userType: 'operator_admin',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserAuthoritySummaryComponent],
      providers: [
        UserAuthorityStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: OperatorUsersInvitationService, useValue: mockClass(OperatorUsersInvitationService) },
        { provide: OperatorUsersService, useValue: mockClass(OperatorUsersService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserAuthoritySummaryComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OperatorUsersInvitationService);
    router = TestBed.inject(Router);
    store = TestBed.inject(UserAuthorityStore);
    fixture.detectChanges();
  });

  const commonMailAssertions = fakeAsync((errorCode: ErrorCodes) => {
    const inviteOperatorUserToAccountSpy = jest.spyOn(service, 'inviteOperatorUserToAccount');
    const navigateSpy = jest.spyOn(router, 'navigate');
    inviteOperatorUserToAccountSpy.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: errorCode } })),
    );
    component.handleSubmit();
    fixture.detectChanges();
    flush();
    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: route });
    store
      .pipe(selectSubmissionErrors)
      .subscribe((submissionErrors) => expect(submissionErrors.length).toBeGreaterThan(0));
    store.pipe(selectIsInitiallySubmitted).subscribe((initiallySubmitted) => expect(initiallySubmitted).toBeFalsy());
    store.pipe(selectIsSubmitted).subscribe((submitted) => expect(submitted).toBeFalsy());
    flush();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call inviteOperatorUserToAccount', async () => {
    const inviteOperatorUserToAccountSpy = jest.spyOn(service, 'inviteOperatorUserToAccount');
    component.handleSubmit();
    await fixture.whenStable();

    expect(inviteOperatorUserToAccountSpy).toHaveBeenCalledTimes(1);
  });

  it('should redirect to the create-user-authority form when the email address of the new user already exists at maritime', () =>
    commonMailAssertions(ErrorCodes.AUTHORITY1005));

  it('should redirect to the create-user-authority form when the email address is already linked to a non-operator account', () =>
    commonMailAssertions(ErrorCodes.USER1003));
});
