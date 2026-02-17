import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { BasePage } from '@netz/common/testing';

import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
  variationRegulatorDecisionFormProvider,
} from '@requests/tasks/emp-variation-regulator/components';

describe('VariationRegulatorDecisionComponent', () => {
  let page: Page;
  let fixture: ComponentFixture<TestComponent>;

  class Page extends BasePage<TestComponent> {
    get heading2() {
      return this.query('h2');
    }

    get hint() {
      return this.query('p.govuk-hint');
    }

    get legends() {
      return this.queryAll<HTMLLegendElement>('legend');
    }

    get removeButtons() {
      return this.queryAll<HTMLButtonElement>('button[govukSecondaryButton]').filter(
        (el) => el.textContent.trim() === 'Remove',
      );
    }

    get addItemButton() {
      return this.queryAll<HTMLButtonElement>('button[govukSecondaryButton]').find(
        (el) => el.textContent.trim() === 'Add item',
      );
    }

    get notesLabel() {
      return this.queryAll('label').find((el) => el.textContent.trim() === 'Notes (optional)');
    }
  }

  @Component({
    selector: 'mrtm-test',
    imports: [ReactiveFormsModule, VariationRegulatorDecisionComponent],
    standalone: true,
    template: `
      <form [formGroup]="form">
        <mrtm-variation-regulator-decision></mrtm-variation-regulator-decision>
      </form>
    `,
    providers: [variationRegulatorDecisionFormProvider(ABBREVIATIONS_SUB_TASK)],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {
    form = inject<VariationRegulatorDecisionFormModel>(VARIATION_REGULATOR_DECISION_FORM);
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestComponent);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should display HTML elements', () => {
    expect(page.heading2).toBeTruthy();
    expect(page.hint).toBeTruthy();
    expect(page.addItemButton).toBeTruthy();
    expect(page.notesLabel).toBeTruthy();
  });

  it('should show populated form', async () => {
    page.addItemButton.click();
    fixture.detectChanges();
    expect(page.removeButtons).toHaveLength(1);
    expect(page.legends.map((item) => item.textContent.trim())).toEqual(['Item 1']);
  });
});
