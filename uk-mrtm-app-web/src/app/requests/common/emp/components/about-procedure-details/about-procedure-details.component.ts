import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DetailsComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-about-procedure-details',
  imports: [DetailsComponent],
  standalone: true,
  templateUrl: './about-procedure-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutProcedureDetailsComponent {}
