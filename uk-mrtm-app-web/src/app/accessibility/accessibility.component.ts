import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';

import { environment } from '@environments/environment';
import { BackToTopComponent } from '@shared/components';

@Component({
  selector: 'mrtm-accessibility',
  imports: [PageHeadingComponent, BackToTopComponent],
  standalone: true,
  templateUrl: './accessibility.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityComponent {
  supportMETSEmail = environment.supportMETSEmail;
}
