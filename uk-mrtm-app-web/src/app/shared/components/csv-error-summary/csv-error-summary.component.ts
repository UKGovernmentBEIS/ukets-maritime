import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  viewChild,
} from '@angular/core';
import { AbstractControl, FormControlStatus, NgForm, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { map, Observable, startWith, tap } from 'rxjs';

import { DetailsComponent, FormService } from '@netz/govuk-components';

import { NestedMessageValidationError } from '@shared/types';

@Component({
  selector: 'mrtm-csv-error-summary',
  imports: [AsyncPipe, DetailsComponent],
  standalone: true,
  templateUrl: './csv-error-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsvErrorSummaryComponent implements OnChanges, AfterViewInit {
  private readonly formService: FormService = inject(FormService);
  private readonly title: Title = inject(Title);

  readonly form = input<UntypedFormGroup | NgForm>();
  readonly container = viewChild<ElementRef<HTMLElement>>('container');

  errorList$: Observable<NestedMessageValidationError[]>;
  private formControl: UntypedFormGroup | NgForm;

  ngOnChanges(): void {
    this.formControl = this.form() instanceof UntypedFormGroup ? this.form() : (this.form() as NgForm).control;

    const statusChanges: Observable<FormControlStatus> = this.form().statusChanges;
    this.errorList$ = statusChanges.pipe(
      startWith(this.form().status),
      map((status) =>
        status === 'INVALID' ? this.getAbstractControlErrors(this.formControl as UntypedFormGroup) : null,
      ),
      tap((errors) => {
        const currentTitle = this.title.getTitle();
        const prefix = 'Error: ';

        if (errors && !currentTitle.startsWith(prefix)) {
          this.title.setTitle(prefix.concat(currentTitle));
        } else if (!errors) {
          this.title.setTitle(currentTitle.replace(prefix, ''));
        }

        if (errors?.length > 0) {
          this.tryScrollAndFocus(this.container()?.nativeElement);
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    this.tryScrollAndFocus(this.container()?.nativeElement);
  }

  private getAbstractControlErrors(control: AbstractControl, path: string[] = []): NestedMessageValidationError[] {
    let childControlErrors = [];

    if (control instanceof UntypedFormGroup) {
      childControlErrors = Object.entries(control.controls)
        .map(([key, value]) => this.getAbstractControlErrors(value, path.concat([key])))
        .reduce((errors, controlErrors) => errors.concat(controlErrors), []);
    } else if (control instanceof UntypedFormArray) {
      childControlErrors = control.controls
        .map((arrayControlItem, index) => this.getAbstractControlErrors(arrayControlItem, path.concat([String(index)])))
        .reduce((errors, controlErrors) => errors.concat(controlErrors), []);
    }

    const errors = control.errors;

    if (errors) {
      const errorEntries = Object.keys(errors).map((key) => ({
        type: key,
        path: this.formService.getIdentifier(path),
        ...errors[key],
      }));
      return childControlErrors.concat(errorEntries);
    }

    return childControlErrors;
  }

  getRowIndexes(rows: any[]): number[] {
    return rows.map((row) => row.rowIndex);
  }

  private tryScrollAndFocus(element: HTMLElement) {
    if (element?.scrollIntoView) {
      element.scrollIntoView();
    }
    if (element?.focus) {
      element.focus();
    }
  }
}
