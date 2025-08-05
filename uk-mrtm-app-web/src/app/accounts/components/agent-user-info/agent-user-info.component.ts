import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-agent-user-info',
  standalone: true,
  imports: [WarningTextComponent],
  templateUrl: './agent-user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentUserInfoComponent {}
