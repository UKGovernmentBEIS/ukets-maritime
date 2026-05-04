import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-task-content',
  imports: [WarningTextComponent],
  standalone: true,
  templateUrl: './task-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskContentComponent {}
