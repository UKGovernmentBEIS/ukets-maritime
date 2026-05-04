import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';

import { BackToTopComponent } from '@shared/components';

@Component({
  selector: 'mrtm-legislation',
  imports: [PageHeadingComponent, BackToTopComponent],
  standalone: true,
  templateUrl: './legislation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegislationComponent {}
