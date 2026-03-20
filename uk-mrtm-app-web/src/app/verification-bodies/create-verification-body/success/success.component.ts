import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { map, take } from 'rxjs';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { selectNewVerificationBody } from '@verification-bodies/+state/verification-bodies.selectors';
import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

@Component({
  selector: 'mrtm-success',
  imports: [AsyncPipe, LinkDirective, PanelComponent, RouterLink],
  standalone: true,
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent {
  private readonly store = inject(VerificationBodiesStoreService);
  public readonly verificationBodyName$ = this.store.pipe(
    selectNewVerificationBody,
    map((state) => state.name),
    take(1),
  );
}
