import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

import { BasePage } from '@netz/common/testing';

import { CompletedWorkFormComponent, completedWorkFormProvider } from '@mi-reports/components';
import { MI_REPORT_FORM_GROUP } from '@mi-reports/core/mi-report.providers';

describe('CompletedWorkFormComponent', () => {
  @Component({
    imports: [CompletedWorkFormComponent, ReactiveFormsModule],
    standalone: true,
    template: `
      <form [formGroup]="formGroup()"><mrtm-completed-work-form /></form>
    `,
    providers: [completedWorkFormProvider],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {
    readonly formGroup: () => FormGroup | UntypedFormGroup = inject(MI_REPORT_FORM_GROUP);
  }

  class Page extends BasePage<TestComponent> {
    get allInputs() {
      return this.queryAll<HTMLInputElement>('input').map((el) => el.name);
    }
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all applicable inputs', () => {
    expect(page.allInputs).toHaveLength(6);
  });
});
