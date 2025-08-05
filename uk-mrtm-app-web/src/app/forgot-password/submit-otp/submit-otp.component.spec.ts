import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

import { ForgotPasswordService } from '@mrtm/api';

import { ErrorCodes } from '@netz/common/error';
import { BasePage, mockClass } from '@netz/common/testing';

import { AuthService } from '@core/services/auth.service';
import { ResetPasswordStore } from '@forgot-password/store/reset-password.store';
import { SubmitOtpComponent } from '@forgot-password/submit-otp/submit-otp.component';
import { BackToTopComponent, WizardStepComponent } from '@shared/components';

describe('SubmitOtpComponent', () => {
  let component: SubmitOtpComponent;
  let fixture: ComponentFixture<SubmitOtpComponent>;
  let page: Page;
  let router: Router;
  let resetPasswordStore: ResetPasswordStore;

  const forgotPasswordService = mockClass(ForgotPasswordService);
  const authService = mockClass(AuthService);

  class Page extends BasePage<SubmitOtpComponent> {
    set passwordValue(value: string) {
      this.setInputValue('#otp', value);
    }

    get link() {
      return this.query<HTMLAnchorElement>('.govuk-link');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitOtpComponent, WizardStepComponent, BackToTopComponent],
      providers: [
        provideRouter([]),
        KeycloakService,
        { provide: AuthService, useValue: authService },
        { provide: ForgotPasswordService, useValue: forgotPasswordService },
        { provide: APP_BASE_HREF, useValue: '/maritime/' },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SubmitOtpComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();

    resetPasswordStore = TestBed.inject(ResetPasswordStore);

    resetPasswordStore.setState({
      ...resetPasswordStore.getState(),
      password: 'password',
      token: 'token',
    });

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display errors for invalid otp codes', () => {
    expect(page.submitButton.disabled).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();
    expect(page.errorSummaryListContents).toEqual(['Enter the 6-digit code']);

    page.passwordValue = 'abcdef';
    page.submitButton.click();
    fixture.detectChanges();
    expect(page.errorSummaryListContents).toEqual(['Digit code must contain numbers only']);

    page.passwordValue = '123';
    page.submitButton.click();
    fixture.detectChanges();
    expect(page.errorSummaryListContents).toEqual(['Digit code must contain exactly 6 characters']);

    page.passwordValue = '1234567';
    page.submitButton.click();
    fixture.detectChanges();
    expect(page.errorSummaryListContents).toEqual(['Digit code must contain exactly 6 characters']);
  });

  it('should submit the forgot password request', () => {
    forgotPasswordService.resetPassword.mockReturnValueOnce(of({}));

    page.passwordValue = '123456';
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();

    expect(forgotPasswordService.resetPassword).toHaveBeenCalledTimes(1);
    expect(forgotPasswordService.resetPassword).toHaveBeenCalledWith({
      password: 'password',
      token: 'token',
      otp: '123456',
    });
  });

  it('should navigate to 404 if user status is invalid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    forgotPasswordService.resetPassword.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: ErrorCodes.USER1005 } })),
    );

    page.passwordValue = '123456';
    page.submitButton.click();
    fixture.detectChanges();

    expect(forgotPasswordService.resetPassword).toHaveBeenCalledTimes(1);
    expect(forgotPasswordService.resetPassword).toHaveBeenCalledWith({
      password: 'password',
      token: 'token',
      otp: '123456',
    });

    expect(navigateSpy).toHaveBeenCalledWith(['error', '404']);
  });

  it('should go to login after clicking link', () => {
    jest.spyOn(fixture.componentInstance, 'onSignInAgain');
    forgotPasswordService.resetPassword.mockReturnValueOnce(of({}));

    page.passwordValue = '123456';
    page.submitButton.click();
    fixture.detectChanges();
    expect(page.errorSummary).toBeFalsy();

    page.link.click();
    fixture.detectChanges();

    expect(component.onSignInAgain).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledTimes(1);
  });
});
