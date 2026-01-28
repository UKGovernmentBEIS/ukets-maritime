import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';

@Component({
  selector: 'mrtm-manage-documents-success',
  standalone: true,
  imports: [LinkDirective, PanelComponent, RouterLink],
  templateUrl: './manage-documents-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageDocumentsSuccessComponent {
  readonly store = inject(GuidanceStore);
  readonly manageOperationType = computed(() => this.store.select(guidanceQuery.selectManageGuidance)()?.type);
  readonly title = computed(() => {
    switch (this.manageOperationType()) {
      case 'CREATE':
        return 'The file has been added';
      case 'UPDATE':
        return 'The file has been updated';
      case 'DELETE':
        return 'The file has been deleted';
      default:
        return '';
    }
  });
  readonly body = computed(() => {
    switch (this.manageOperationType()) {
      case 'CREATE':
        return 'The file will be available in the list of the files.';
      case 'UPDATE':
        return 'The updated file will be available in the list of files.';
      case 'DELETE':
        return 'The file will not be available in the list of files.';
      default:
        return '';
    }
  });
}
