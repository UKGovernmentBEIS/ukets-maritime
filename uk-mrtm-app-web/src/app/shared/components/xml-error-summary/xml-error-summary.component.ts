import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  inject,
  input,
  Signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { DetailsComponent } from '@netz/govuk-components';

import { IncludesPipe } from '@shared/pipes';
import { NestedMessageValidationError, XmlValidationError } from '@shared/types';

@Component({
  selector: 'mrtm-xml-error-summary',
  standalone: true,
  imports: [DetailsComponent, IncludesPipe],
  templateUrl: './xml-error-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmlErrorSummaryComponent implements AfterViewInit {
  private readonly title: Title = inject(Title);

  xmlErrors = input<XmlValidationError[]>();
  container = contentChild<ElementRef<HTMLDivElement>>('container');
  xmlErrorList: Signal<NestedMessageValidationError[]> = computed(() => this.getGroupedErrors());

  /**
   * Transforms XmlValidationError[] to NestedMessageValidationError[]
   * Groups by error.message
   */
  getGroupedErrors() {
    return this.xmlErrors()?.reduce((acc: NestedMessageValidationError[], error) => {
      const existingError = acc.find((item) => item.message.includes(error.message));
      if (existingError) {
        existingError.rows.push(error.row);
      } else {
        acc.push({
          path: '',
          type: 'ship',
          rows: [error.row],
          columns: [error.column],
          message: error.message,
        });
      }
      return acc;
    }, []);
  }

  constructor() {
    effect(() => {
      const hasErrors = this.xmlErrorList()?.length > 0;
      const currentTitle = this.title.getTitle();
      const prefix = 'Error: ';

      if (hasErrors && !currentTitle.startsWith(prefix)) {
        this.title.setTitle(prefix.concat(currentTitle));
      } else if (!hasErrors) {
        this.title.setTitle(currentTitle.replace(prefix, ''));
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.container()?.nativeElement?.scrollIntoView) {
      this.container().nativeElement.scrollIntoView();
    }
    if (this.container()?.nativeElement?.focus) {
      this.container().nativeElement.focus();
    }
  }
}
