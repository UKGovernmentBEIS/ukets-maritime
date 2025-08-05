import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';

import { BackToTopComponent } from '@shared/components';

@Component({
  selector: 'mrtm-legislation',
  standalone: true,
  templateUrl: './legislation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent, BackToTopComponent],
})
export class LegislationComponent {}
