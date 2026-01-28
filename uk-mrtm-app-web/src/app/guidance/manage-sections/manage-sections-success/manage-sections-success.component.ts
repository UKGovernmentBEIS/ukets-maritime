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
  readonly title = computed(() => {
    switch (this.manageOperationType()) {
      case 'CREATE':
        return 'The section has been added';
      case 'UPDATE':
        return 'The section has been updated';
      case 'DELETE':
        return 'The section has been deleted';
      default:
        return '';
    }
  });
  readonly body = computed(() => {
    switch (this.manageOperationType()) {
      case 'CREATE':
        return 'The section will appear in the guidance page.';
      case 'UPDATE':
        return 'The section will appear updated according to the new changes.';
      case 'DELETE':
        return 'The section will not be available in the guidance page.';
      default:
        return '';
    }
  });
}
