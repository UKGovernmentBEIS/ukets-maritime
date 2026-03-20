import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-registry-integration-success',
  imports: [PanelComponent, ReturnToTaskOrActionPageComponent],
  standalone: true,
  templateUrl: './registry-integration-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryIntegrationSuccessComponent {}
