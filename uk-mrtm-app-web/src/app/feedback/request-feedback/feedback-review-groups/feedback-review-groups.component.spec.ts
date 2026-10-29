import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { BasePage } from '@netz/common/testing';
import { GovukValidators } from '@netz/govuk-components';

import { FeedbackReviewGroupsComponent } from '@feedback/request-feedback/feedback-review-groups/feedback-review-groups.component';
import {
  FeedbackOption,
  FeedbackReviewGroup,
  REQUEST_FEEDBACK_CONFIG,
} from '@feedback/request-feedback/request-feedback.config';

@Component({
  imports: [ReactiveFormsModule, FeedbackReviewGroupsComponent],
  standalone: true,
  template: `
    <form [formGroup]="form">
      <mrtm-feedback-review-groups
        formControlName="feedbackReviewGroups"
        legend="Which sections?"
        hint="Select all that apply."
        [options]="options"
        [showErrors]="showErrors()" />
    </form>
  `,
})
class TestHostComponent {
  control = new FormControl<FeedbackReviewGroup[]>([], GovukValidators.required('Select the sections'));
  form = new FormGroup({ feedbackReviewGroups: this.control });
  options: FeedbackOption<FeedbackReviewGroup>[] = REQUEST_FEEDBACK_CONFIG.AER_VERIFICATION_SUBMIT.reviewGroups;
  readonly showErrors = signal(false);
}

describe('FeedbackReviewGroupsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let page: Page;

  class Page extends BasePage<TestHostComponent> {
    checkbox(value: string): HTMLInputElement {
      return this.query<HTMLInputElement>(`input[value="${value}"]`);
    }

    get headings(): string[] {
      return this.queryAll<HTMLHeadingElement>('h3').map((heading) => heading.textContent.trim());
    }

    get divider(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-checkboxes__divider');
    }

    get errorMessage(): HTMLSpanElement {
      return this.query<HTMLSpanElement>('.govuk-error-message');
    }
  }

  const click = (value: string) => {
    page.checkbox(value).click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should render legend, hint, group headings and the divider before the no feedback option', () => {
    expect(page.query('legend').textContent.trim()).toEqual('Which sections?');
    expect(page.query('legend').id).toEqual('l.feedbackReviewGroups');
    expect(page.query('fieldset').id).toEqual('feedbackReviewGroups');
    expect(page.query('.govuk-hint').textContent.trim()).toEqual('Select all that apply.');
    expect(page.headings).toEqual(['Verifier assessment', 'Verifier findings']);
    expect(page.divider.textContent.trim()).toEqual('or');
    expect(page.divider.nextElementSibling.querySelector('input').value).toEqual('NO_FEEDBACK');
  });

  it('should update the control value in option order', () => {
    click('OVERALL_DECISION');
    click('VERIFIER_DETAILS');

    expect(host.control.value).toEqual(['VERIFIER_DETAILS', 'OVERALL_DECISION']);
  });

  it('should keep the no feedback option exclusive', () => {
    click('VERIFIER_DETAILS');
    click('NO_FEEDBACK');

    expect(host.control.value).toEqual(['NO_FEEDBACK']);
    expect(page.checkbox('VERIFIER_DETAILS').checked).toBe(false);

    click('OPINION_STATEMENT');

    expect(host.control.value).toEqual(['OPINION_STATEMENT']);
    expect(page.checkbox('NO_FEEDBACK').checked).toBe(false);
  });

  it('should reflect values written to the control', () => {
    host.control.setValue(['UNCORRECTED_MISSTATEMENTS']);
    fixture.detectChanges();

    expect(page.checkbox('UNCORRECTED_MISSTATEMENTS').checked).toBe(true);
  });

  it('should display errors only when requested', () => {
    expect(page.errorMessage).toBeNull();

    host.showErrors.set(true);
    fixture.detectChanges();

    expect(page.errorMessage.textContent).toContain('Select the sections');
    expect(page.query('.govuk-form-group--error')).toBeTruthy();
  });
});
