import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

import { ErrorPageComponent } from '../error-page';
import { BusinessErrorService } from './business-error.service';

@Component({
  selector: 'netz-business-error',
  imports: [LinkDirective, RouterLink, AsyncPipe, ErrorPageComponent],
  standalone: true,
  template: `
    @if (businessErrorService.error$ | async; as error) {
      <netz-error-page [heading]="error.heading">
        <p class="govuk-body">
          <a govukLink [routerLink]="error.link" [fragment]="error.fragment">{{ error.linkText }}</a>
        </p>
      </netz-error-page>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessErrorComponent implements OnDestroy {
  readonly businessErrorService = inject(BusinessErrorService);

  ngOnDestroy(): void {
    this.businessErrorService.clear();
  }
}
