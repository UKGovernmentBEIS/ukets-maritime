import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map } from 'rxjs';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-data-supplier-appoint-success',
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink],
  templateUrl: './data-supplier-appoint-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSupplierAppointSuccessComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly dataSupplierName = toSignal(
    this.activatedRoute.queryParams.pipe(map((params) => params?.dataSupplierName)),
  );
}
