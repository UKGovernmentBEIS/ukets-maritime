import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';

import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { mockEmpIssuanceSubmitRequestTask } from '@requests/common/emp/testing/emp-data.mock';
import { ReviewDecisionComponent } from '@requests/tasks/emp-variation-review/components/review-decision/review-decision.component';
import { VARIATION_REVIEW_DECISION_FORM } from '@requests/tasks/emp-variation-review/components/review-decision/review-decision-form.token';
import { ReviewDecisionFormModel } from '@requests/tasks/emp-variation-review/components/review-decision/review-decision-form-model.type';
import { reviewEmpSubtaskDecisionFormProvider } from '@requests/tasks/emp-variation-review/components/review-decision/review-emp-subtask-decision-form.provider';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';

@Component({
  selector: 'mrtm-test',
  template: `
    <form [formGroup]="form">
      <mrtm-review-decision></mrtm-review-decision>
    </form>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ReviewDecisionComponent],
  providers: [reviewEmpSubtaskDecisionFormProvider(ABBREVIATIONS_SUB_TASK)],
})
class TestComponent {
  form = inject<ReviewDecisionFormModel>(VARIATION_REVIEW_DECISION_FORM);
}

describe('ReviewDecisionComponent', () => {
  beforeEach(async () => {
    await render(TestComponent, {
      providers: [provideHttpClient(), provideHttpClientTesting(), RequestTaskStore],
      configureTestBed: (testbed) => {
        const store = testbed.inject(RequestTaskStore);
        store.setState(mockEmpIssuanceSubmitRequestTask);
      },
    });
  });

  it('should display controls', () => {
    expect(screen.getByLabelText('Accepted')).toBeInTheDocument();
    expect(screen.getByLabelText('Rejected')).toBeInTheDocument();
    expect(screen.getByLabelText('Operator amends needed')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
  });

  it('should show prepopulated form', async () => {
    screen.getByLabelText('Operator amends needed').click();
    expect(screen.getByLabelText('Operator amends needed')).toBeChecked();
    expect(screen.getByText('Required change 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload a file')).toBeInTheDocument();

    screen.getByLabelText('Accepted').click();
    expect(screen.getByLabelText('Accepted')).toBeChecked();
    expect(screen.getByRole('button', { name: /Add item/ })).toBeInTheDocument();
    screen.getByRole('button', { name: /Add item/ }).click();
  });
});
