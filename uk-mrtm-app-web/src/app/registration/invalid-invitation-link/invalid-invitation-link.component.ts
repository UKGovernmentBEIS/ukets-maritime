import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, map, tap } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';
import { ErrorCodes } from '@netz/common/error';

@Component({
  selector: 'mrtm-invalid-invitation-link',
  imports: [PageHeadingComponent, AsyncPipe],
  standalone: true,
  template: `
    <netz-page-heading>{{ title$ | async }}</netz-page-heading>

    @switch (error$ | async) {
      @case ('EMAIL1001') {
        <p class="govuk-body">Contact your administrator to receive a new link.</p>
      }
      @default {
        <p class="govuk-body">Please contact your admin for access.</p>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvalidInvitationLinkComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  title$ = new BehaviorSubject<string>('');

  error$ = this.activatedRoute.queryParamMap.pipe(
    map((params) => params.get('code')),
    tap((code) => {
      let title: string;

      if (code === ErrorCodes.EMAIL1001) {
        title = 'This link has expired';
      } else {
        title = 'This link is invalid';
      }

      this.title$.next(title);
      this.titleService.setTitle(title);
    }),
  );
}
