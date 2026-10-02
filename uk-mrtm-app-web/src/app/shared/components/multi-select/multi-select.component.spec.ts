import { Component, forwardRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';
import { GovukValidators } from '@netz/govuk-components';

import { MultiSelectComponent, MultiSelectItemComponent, WizardStepComponent } from '@shared/components';

describe('MultiSelectComponent', () => {
  @Component({
    imports: [ReactiveFormsModule, MultiSelectComponent, forwardRef(() => MultiSelectItemComponent)],
    standalone: true,
    template: `
      <form [formGroup]="form">
        <div mrtm-multi-select formControlName="test" label="Test label">
          <div mrtm-multi-select-item itemValue="1" label="Test label 1"></div>
          <div mrtm-multi-select-item itemValue="2" label="Test label 2"></div>
        </div>
      </form>
    `,
  })
  class TestComponent {
    form: FormGroup = new FormGroup({
      test: new FormControl(null),
    });
  }

  let component: MultiSelectComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;
  let page: Page;

  class Page extends BasePage<TestComponent> {
    get button() {
      return this.query<HTMLButtonElement>('button');
    }
    get checkboxes() {
      return this.queryAll<HTMLInputElement>('input');
    }
    get labels() {
      return this.queryAll<HTMLLabelElement>('label');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(MultiSelectComponent)).componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign value', () => {
    page.button.click();
    fixture.detectChanges();

    expect(page.checkboxes[0].checked).toBeFalsy();
    expect(page.checkboxes[1].checked).toBeFalsy();
    expect(page.button.textContent.trim()).toEqual('0 selected');

    hostComponent.form.get('test').setValue(['2']);
    fixture.detectChanges();

    expect(page.checkboxes[0].checked).toBeFalsy();
    expect(page.checkboxes[1].checked).toBeTruthy();
    expect(page.button.textContent.trim()).toEqual('1 selected');

    hostComponent.form.get('test').setValue(['1', '2']);
    fixture.detectChanges();

    expect(page.checkboxes[0].checked).toBeTruthy();
    expect(page.checkboxes[1].checked).toBeTruthy();
    expect(page.button.textContent.trim()).toEqual('2 selected');
  });

  it('should emit value', () => {
    expect(hostComponent.form.get('test').value).toEqual(null);

    page.button.click();
    fixture.detectChanges();
    page.checkboxes[0].click();

    expect(hostComponent.form.get('test').value).toEqual(['1']);

    page.checkboxes[0].click();
    page.checkboxes[1].click();

    expect(hostComponent.form.get('test').value).toEqual(['2']);

    page.checkboxes[0].click();

    expect(hostComponent.form.get('test').value).toEqual(['1', '2']);
  });

  it('should assign indexes to items', () => {
    page.button.click();
    fixture.detectChanges();

    expect(page.checkboxes.map((checkbox) => checkbox.id)).toEqual(['test-0', 'test-1']);
    expect(page.labels.map((checkbox) => checkbox.htmlFor)).toEqual(['test', 'test-0', 'test-1']);
  });

  describe('when the form is submitted', () => {
    @Component({
      imports: [
        ReactiveFormsModule,
        WizardStepComponent,
        MultiSelectComponent,
        forwardRef(() => MultiSelectItemComponent),
      ],
      standalone: true,
      template: `
        <mrtm-wizard-step [formGroup]="form" heading="Heading">
          <div mrtm-multi-select formControlName="test" label="Test label">
            <div mrtm-multi-select-item itemValue="1" label="Test label 1"></div>
          </div>
        </mrtm-wizard-step>
      `,
    })
    class SubmitTestComponent {
      form = new FormGroup({
        test: new FormControl(null, GovukValidators.required('Select at least one category')),
      });
    }

    it('should display the error message without further interaction', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [SubmitTestComponent], providers: [provideRouter([])] });
      const submitFixture = TestBed.createComponent(SubmitTestComponent);
      submitFixture.autoDetectChanges();
      await submitFixture.whenStable();

      submitFixture.nativeElement.querySelector('#wizard-step__button-submit').click();
      await submitFixture.whenStable();

      expect(submitFixture.nativeElement.querySelector('.govuk-error-message')?.textContent).toContain(
        'Select at least one category',
      );
    });
  });

  describe('when options are loaded after the initial value', () => {
    @Component({
      imports: [ReactiveFormsModule, MultiSelectComponent, forwardRef(() => MultiSelectItemComponent)],
      standalone: true,
      template: `
        <form [formGroup]="form">
          <div mrtm-multi-select formControlName="test" label="Test label">
            @for (option of options(); track option.value) {
              <div mrtm-multi-select-item [itemValue]="option.value" [label]="option.text"></div>
            }
          </div>
        </form>
      `,
    })
    class AsyncOptionsTestComponent {
      readonly options = signal<Array<{ value: string; text: string }>>([]);
      form = new FormGroup({ test: new FormControl(['2']) });
    }

    it('should display the labels of the selected items', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [AsyncOptionsTestComponent] });
      const asyncFixture = TestBed.createComponent(AsyncOptionsTestComponent);
      asyncFixture.autoDetectChanges();
      await asyncFixture.whenStable();

      asyncFixture.componentInstance.options.set([
        { value: '1', text: 'Category 1' },
        { value: '2', text: 'Category 2' },
      ]);
      await asyncFixture.whenStable();

      const selected = [...asyncFixture.nativeElement.querySelectorAll('.selected')].map((el: HTMLElement) =>
        el.textContent.trim(),
      );
      expect(selected).toEqual(['Category 2']);
      expect(asyncFixture.nativeElement.querySelector('button').textContent.trim()).toEqual('1 selected');
    });

    it('should check the selected items when the dropdown is opened', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [AsyncOptionsTestComponent] });
      const asyncFixture = TestBed.createComponent(AsyncOptionsTestComponent);
      asyncFixture.autoDetectChanges();
      await asyncFixture.whenStable();

      asyncFixture.componentInstance.options.set([
        { value: '1', text: 'Category 1' },
        { value: '2', text: 'Category 2' },
      ]);
      await asyncFixture.whenStable();

      asyncFixture.nativeElement.querySelector('button').click();
      await asyncFixture.whenStable();

      const checked = [...asyncFixture.nativeElement.querySelectorAll('input[type="checkbox"]')].map(
        (el: HTMLInputElement) => el.checked,
      );
      expect(checked).toEqual([false, true]);
    });
  });
});
