import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { ReviewDecisionComponent } from '@requests/tasks/emp-review/components/review-decision/review-decision.component';
import { reviewDecisionFormProvider } from '@requests/tasks/emp-review/components/review-decision/review-decision.form-provider';
import { REVIEW_DECISION_FORM } from '@requests/tasks/emp-review/components/review-decision/review-decision-form.token';
import { ReviewDecisionFormModel } from '@requests/tasks/emp-review/components/review-decision/review-decision-form-model.type';

@Component({
  selector: 'mrtm-test',
  imports: [ReactiveFormsModule, ReviewDecisionComponent],
  standalone: true,
  template: `
    <form [formGroup]="form">
      <mrtm-review-decision />
    </form>
  `,
  providers: [reviewDecisionFormProvider(ABBREVIATIONS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  form = inject<ReviewDecisionFormModel>(REVIEW_DECISION_FORM);
}

describe('ReviewDecisionComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  class Page extends BasePage<TestComponent> {
    get labels(): string[] {
      return this.labelsElement.map((item) => item.textContent.trim());
    }

    get operatorAmendsNeededLabel(): HTMLElement {
      return this.labelsElement.find((label) => label.textContent.includes('Operator amends needed'));
    }

    get labelsElement(): HTMLElement[] {
      return this.queryAll('label');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), RequestTaskStore],
    });

    fixture = TestBed.createComponent(TestComponent);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should display controls', () => {
    expect(page.labels).toEqual([
      'Accepted',
      'Operator amends needed',
      'Reason for required change 1',
      'Upload a file (Optional)',
      'Choose files',
      'Notes (optional)',
    ]);
  });

  it('should show prepopulated form', async () => {
    page.operatorAmendsNeededLabel.click();
    fixture.detectChanges();

    expect(page.query<HTMLInputElement>('input[value="OPERATOR_AMENDS_NEEDED"]').checked).toBeTruthy();
    expect(page.labels).toEqual([
      'Accepted',
      'Operator amends needed',
      'Reason for required change 1',
      'Upload a file (Optional)',
      'Choose files',
      'Notes (optional)',
    ]);
  });
});
