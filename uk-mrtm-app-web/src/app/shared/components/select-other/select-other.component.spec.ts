import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { BasePage } from '@netz/common/testing';
import { GovukComponentsModule } from '@netz/govuk-components';

import { SelectOtherComponent } from '@shared/components';

describe('SelectOtherComponent', () => {
  let component: SelectOtherComponent;
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  @Component({
    template: `
      <form [formGroup]="form">
        <mrtm-select-other formControlName="control">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="OTHER">Other</option>
          <div govukConditionalContent>
            <div govuk-text-input formControlName="conditional"></div>
          </div>
        </mrtm-select-other>
      </form>
    `,
  })
  class TestComponent {
    private readonly formBuilder = inject(FormBuilder);

    form = this.formBuilder.group({ control: [], conditional: [] });
  }

  class Page extends BasePage<TestComponent> {
    get conditionalContent() {
      return this.query<HTMLDivElement>('.govuk-checkboxes__conditional');
    }

    get select() {
      return this.query('select');
    }

    set selectValue(value: string) {
      this.setInputValue('select', value);
    }

    get form() {
      return this.query<HTMLFormElement>('form');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukComponentsModule, ReactiveFormsModule, SelectOtherComponent],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(SelectOtherComponent)).componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide and disable the conditional content if other is not selected', () => {
    expect(page.conditionalContent.classList.contains('govuk-checkboxes__conditional--hidden')).toBeTruthy();
    expect(page.select.getAttribute('aria-expanded')).toEqual('false');
    expect(hostComponent.form.get('conditional').disabled).toBeTruthy();

    page.selectValue = '1';
    fixture.detectChanges();

    expect(page.conditionalContent.classList.contains('govuk-checkboxes__conditional--hidden')).toBeTruthy();
    expect(page.select.getAttribute('aria-expanded')).toEqual('false');
    expect(hostComponent.form.get('conditional').disabled).toBeTruthy();
  });

  it('should reveal and enable the conditional content when other is selected', () => {
    page.selectValue = 'OTHER';
    fixture.detectChanges();

    expect(page.conditionalContent.classList.contains('govuk-checkboxes__conditional--hidden')).toBeFalsy();
    expect(component.currentValue).toBe('OTHER');
    expect(page.select.getAttribute('aria-expanded')).toEqual('true');
    expect(hostComponent.form.get('conditional').disabled).toBeFalsy();
  });

  it('should emit values', () => {
    page.selectValue = '1';
    fixture.detectChanges();

    page.form.submit();
    fixture.detectChanges();

    expect(hostComponent.form.get('control').value).toEqual('1');
  });

  it('should start with the content revealed if other is preselected', () => {
    hostComponent.form.get('control').setValue('OTHER');
    fixture.detectChanges();

    expect(page.conditionalContent.classList.contains('govuk-checkboxes__conditional--hidden')).toBeFalsy();
    expect(hostComponent.form.get('conditional').disabled).toBeFalsy();
  });

  it('should apply name and id attributes', () => {
    expect(page.select.getAttribute('aria-expanded')).toEqual('false');
    expect(page.select.getAttribute('aria-controls')).toEqual('control-conditional');
    expect(page.select.id).toEqual('control');
    expect(page.select.name).toEqual('control');
  });
});
