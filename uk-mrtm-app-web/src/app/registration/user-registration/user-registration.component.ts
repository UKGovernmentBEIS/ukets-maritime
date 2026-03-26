import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SkipLinkFocusDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-user-registration',
  imports: [RouterOutlet, SkipLinkFocusDirective],
  standalone: true,
  template: `
    <router-outlet mrtmSkipLinkFocus />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegistrationComponent {}
