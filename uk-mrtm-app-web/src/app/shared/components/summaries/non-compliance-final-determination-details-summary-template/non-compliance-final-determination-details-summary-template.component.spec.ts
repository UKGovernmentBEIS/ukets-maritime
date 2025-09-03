import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthStore } from '@netz/common/auth';
import { BasePage } from '@netz/common/testing';

import { mockNonComplianceFinalDetermination } from '@requests/common/non-compliance/testing';
import { NonComplianceFinalDeterminationDetailsSummaryTemplateComponent } from '@shared/components';

describe('NonComplianceFinalDeterminationDetailsSummaryTemplateComponent', () => {
  let component: NonComplianceFinalDeterminationDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<NonComplianceFinalDeterminationDetailsSummaryTemplateComponent>;
  let page: Page;
  let authStore: AuthStore;

  class Page extends BasePage<NonComplianceFinalDeterminationDetailsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceFinalDeterminationDetailsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      ...authStore.state.userState,
      roleType: 'REGULATOR',
      userId: 'regTestId',
      status: 'ENABLED',
    });

    fixture = TestBed.createComponent(NonComplianceFinalDeterminationDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockNonComplianceFinalDetermination);
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Has compliance been restored?',
      'Yes',
      'Change',
      'When did the operator become compliant?',
      '20 Jun 2026',
      'Change',
      'Your comments on the status of compliance',
      'GG',
      'Change',
      'Do you need to withdraw and reissue a penalty notice?',
      'No',
      'Change',
      'Has the operator paid this penalty?',
      'Yes',
      'Change',
      'When did the operator pay?',
      '21 Jun 2026',
      'Change',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Has compliance been restored?',
      'Yes',
      'When did the operator become compliant?',
      '20 Jun 2026',
      'Your comments on the status of compliance',
      'GG',
      'Do you need to withdraw and reissue a penalty notice?',
      'No',
      'Has the operator paid this penalty?',
      'Yes',
      'When did the operator pay?',
      '21 Jun 2026',
    ]);
  });
});
