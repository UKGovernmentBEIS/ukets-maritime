import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-task-content',
  standalone: true,
  imports: [WarningTextComponent],
  templateUrl: './task-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskContentComponent {}
