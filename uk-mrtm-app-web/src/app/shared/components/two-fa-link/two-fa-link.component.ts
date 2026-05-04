import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-two-fa-link',
  imports: [LinkDirective, RouterLink],
  standalone: true,
  template: `
    <div class="govuk-button-group">
      <a
        govukLink
        [routerLink]="link()"
        [relativeTo]="route"
        [state]="{ userId: userId(), accountId: accountId(), userName: userName(), role: role() }">
        {{ title() }}
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFaLinkComponent {
  protected route = inject(ActivatedRoute);

  readonly title = input<string>();
  readonly link = input<string[]>();
  readonly userId = input<string>();
  readonly accountId = input<number>();
  readonly userName = input<string>();
  readonly role = input<string>();
}
