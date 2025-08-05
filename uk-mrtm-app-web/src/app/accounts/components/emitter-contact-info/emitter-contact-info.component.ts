import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-emitter-contact-info',
  standalone: true,
  imports: [WarningTextComponent],
  templateUrl: './emitter-contact-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmitterContactInfoComponent {}
