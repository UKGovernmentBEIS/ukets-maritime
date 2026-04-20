import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';

@Component({
  selector: 'mrtm-manage-sections-success',
  standalone: true,
  imports: [LinkDirective, PanelComponent, RouterLink],
  templateUrl: './manage-sections-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSectionsSuccessComponent {
  readonly store = inject(GuidanceStore);
  readonly manageOperationType = computed(() => this.store.select(guidanceQuery.selectManageGuidance)()?.type);
}
