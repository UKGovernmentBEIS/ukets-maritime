import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  Signal,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { DetailsComponent, SafeHtmlPipe } from '@netz/govuk-components';

import { IncludesPipe } from '@shared/pipes';
import { NestedMessageValidationError, XmlValidationError } from '@shared/types';

@Component({
  selector: 'mrtm-xml-error-summary',
  imports: [DetailsComponent, IncludesPipe, SafeHtmlPipe],
  standalone: true,
  templateUrl: './xml-error-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmlErrorSummaryComponent implements AfterViewInit {
  private readonly title: Title = inject(Title);
  readonly xmlErrors = input<XmlValidationError[]>();
  readonly container = viewChild<ElementRef<HTMLElement>>('container');
  readonly xmlErrorList: Signal<NestedMessageValidationError[]> = computed(() => this.getGroupedErrors());
  readonly formatNestedErrorDetails: Signal<(error: NestedMessageValidationError) => string | undefined> =
    input<(error: NestedMessageValidationError) => string | undefined>();

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

      if (hasErrors) {
        this.tryScrollAndFocus(this.container()?.nativeElement);
      }
    });
  }

  ngAfterViewInit(): void {
    this.tryScrollAndFocus(this.container()?.nativeElement);
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
