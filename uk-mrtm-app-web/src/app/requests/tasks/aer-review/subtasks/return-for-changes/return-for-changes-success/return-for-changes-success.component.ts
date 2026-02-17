import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-return-for-changes-success',
  imports: [LinkDirective, RouterLink, PanelComponent],
  standalone: true,
  templateUrl: './return-for-changes-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnForChangesSuccessComponent {}
