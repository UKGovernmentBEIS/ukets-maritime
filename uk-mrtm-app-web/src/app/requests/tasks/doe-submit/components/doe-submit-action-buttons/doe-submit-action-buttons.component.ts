import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { doeCommonQuery } from '@requests/common/doe';

@Component({
  selector: 'mrtm-doe-submit-action-buttons',
  imports: [ButtonDirective, RouterLink],
  standalone: true,
  templateUrl: './doe-submit-action-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoeSubmitActionButtonsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  public readonly canProcessActions = computed(() => {
    const editable = this.store.select(requestTaskQuery.selectIsEditable)();
    const sectionsStatus = this.store.select(doeCommonQuery.selectIsSubtaskCompleted('maritimeEmissions'))();

    return editable && sectionsStatus;
  });
}
