import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-email-link-invalid',
  imports: [PageHeadingComponent, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './email-link-invalid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailLinkInvalidComponent {}
