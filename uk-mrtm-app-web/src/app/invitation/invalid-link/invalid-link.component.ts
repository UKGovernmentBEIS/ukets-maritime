import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { PageHeadingComponent } from '@netz/common/components';

@Component({
  selector: 'mrtm-invalid-link',
  imports: [PageHeadingComponent, AsyncPipe],
  standalone: true,
  templateUrl: './invalid-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvalidLinkComponent {
  private readonly route = inject(ActivatedRoute);

  errorCode$ = this.route.queryParamMap.pipe(map((queryParamMap) => queryParamMap.get('code')));
}
