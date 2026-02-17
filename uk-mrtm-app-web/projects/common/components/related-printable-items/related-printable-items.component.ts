import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { RequestActionReportService } from '@netz/common/services';
import { LinkDirective } from '@netz/govuk-components';

import { PrintComponent } from './print';

@Component({
  selector: 'netz-related-printable-items',
  imports: [LinkDirective, RouterLink, PrintComponent],
  standalone: true,
  template: `
    <aside class="app-related-items" role="complementary">
      <h2 class="govuk-heading-m" id="related-printable-items-section">Related actions</h2>
      <nav role="navigation" aria-labelledby="related-printable-items-section">
        <ul class="govuk-list govuk-!-font-size-16">
          <li>
            <a govukLink (click)="printRequestAction()" routerLink=".">Download PDF of workflow</a>
          </li>
        </ul>
        <netz-print #printComp>
          <ng-template #printContainerRef></ng-template>
        </netz-print>
      </nav>
    </aside>
  `,
  styleUrl: './related-printable-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedPrintableItemsComponent implements OnDestroy {
  private readonly requestActionReportService: RequestActionReportService = inject(RequestActionReportService);

  readonly dataComponent = input.required<any>();
  readonly printContainerRef = viewChild.required('printContainerRef', { read: ViewContainerRef });
  readonly printComponent = viewChild.required<PrintComponent>('printComp');

  private printSubscription: Subscription = this.requestActionReportService.printReport$
    .pipe(filter((print) => !!print))
    .subscribe((filename) => this.printComponent().print(filename));

  printRequestAction() {
    this.printContainerRef().clear();
    this.printContainerRef().createComponent(this.dataComponent());
  }

  ngOnDestroy(): void {
    this.requestActionReportService.clear();
    this.printSubscription.unsubscribe();
  }
}
