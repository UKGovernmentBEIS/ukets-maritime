import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-return-for-amends-success',
  standalone: true,
  imports: [LinkDirective, RouterLink, PanelComponent],
  templateUrl: './return-for-amends-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnForAmendsSuccessComponent {
  private readonly store = inject(RequestTaskStore);
  public readonly isEmpVariation = computed(() =>
    this.store.select(requestTaskQuery.selectRequestTaskType)()?.includes('EMP_VARIATION'),
  );
}
