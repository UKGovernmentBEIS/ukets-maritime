import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { ReviewDecisionComponent } from '@requests/tasks/emp-variation-review/components/review-decision/review-decision.component';
import { VARIATION_REVIEW_DECISION_FORM } from '@requests/tasks/emp-variation-review/components/review-decision/review-decision-form.token';
import { ReviewDecisionFormModel } from '@requests/tasks/emp-variation-review/components/review-decision/review-decision-form-model.type';
import { reviewEmpSubtaskDecisionFormProvider } from '@requests/tasks/emp-variation-review/components/review-decision/review-emp-subtask-decision-form.provider';

@Component({
  selector: 'mrtm-test',
  imports: [ReactiveFormsModule, ReviewDecisionComponent],
  standalone: true,
  template: `
    <form [formGroup]="form">
      <mrtm-review-decision />
    </form>
  `,
  providers: [reviewEmpSubtaskDecisionFormProvider(ABBREVIATIONS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  form = inject<ReviewDecisionFormModel>(VARIATION_REVIEW_DECISION_FORM);
}

describe('ReviewDecisionComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  class Page extends BasePage<TestComponent> {
    get labels(): string[] {
      return this.queryAll('label').map((label) => label.textContent.trim());
    }

    get legends(): string[] {
      return this.queryAll('legend').map((legend) => legend.textContent.trim());
    }

    get operatorAmendsNeededLabel(): HTMLElement {
      return this.queryAll('label').find((label) => label.textContent.includes('Operator amends needed'));
    }

    get acceptedLabel(): HTMLElement {
      return this.queryAll('label').find((label) => label.textContent.includes('Accepted'));
    }

    get addButton(): HTMLButtonElement {
      return this.queryAll<HTMLButtonElement>('button').find((button) => button.textContent.includes('Add item'));
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
    expect(page.labels).toContain('Accepted');
    expect(page.labels).toContain('Rejected');
    expect(page.labels).toContain('Operator amends needed');
    expect(page.labels).toContain('Notes (optional)');
  });

  it('should show prepopulated form', async () => {
    page.operatorAmendsNeededLabel.click();
    fixture.detectChanges();

    expect(page.query<HTMLInputElement>('input[value="OPERATOR_AMENDS_NEEDED"]').checked).toBeTruthy();
    expect(page.legends).toContain('Required change 1');
    expect(page.labels).toContain('Upload a file');

    page.acceptedLabel.click();
    fixture.detectChanges();

    expect(page.query<HTMLInputElement>('input[value="ACCEPTED"]').checked).toBeTruthy();
    expect(page.addButton).toBeTruthy();
    page.addButton.click();
    fixture.detectChanges();

    expect(page.legends).toContain('Required change 1');
  });
});
