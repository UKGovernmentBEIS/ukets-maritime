import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SkipLinkFocusDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-user-registration',
  template: `
    <router-outlet mrtmSkipLinkFocus></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, SkipLinkFocusDirective],
})
export class UserRegistrationComponent {}
