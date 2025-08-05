import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';

import {
  SummaryListColumnDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '../directives';
import { SummaryItem } from './summary-list.interface';

/*
  eslint-disable
  @angular-eslint/component-selector
 */
@Component({
  selector: 'dl[govuk-summary-list]',
  standalone: true,
  imports: [SummaryListRowKeyDirective, SummaryListRowDirective, NgTemplateOutlet, SummaryListRowValueDirective],
  templateUrl: './summary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryListComponent {
  @Input() details: SummaryItem[];
  @Input() hasBorders = true;
  @Input() hasBottomMargin = true;

  @ContentChildren(SummaryListRowDirective) rows: QueryList<SummaryListRowDirective>;
  @ContentChildren(SummaryListColumnDirective) columns: QueryList<SummaryListColumnDirective>;
  @ContentChild('keyTemplate') keyTemplate: TemplateRef<any>;
  @ContentChild('valueTemplate') valueTemplate: TemplateRef<any>;

  @HostBinding('class.govuk-summary-list') readonly govukSummaryList = true;
  @HostBinding('class.govuk-!-margin-bottom-9') get hasBottomMarginClass(): boolean {
    return this.hasBottomMargin;
  }
  @HostBinding('class.govuk-summary-list--no-border') get govukSummaryListNoBorderClass(): boolean {
    return !this.hasBorders;
  }
}
