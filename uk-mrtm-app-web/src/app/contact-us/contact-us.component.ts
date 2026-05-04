import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';

@Component({
  selector: 'mrtm-contact-us',
  imports: [PageHeadingComponent],
  standalone: true,
  templateUrl: './contact-us.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUsComponent {}
