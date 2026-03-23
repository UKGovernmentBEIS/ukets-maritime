import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerMaterialityLevel } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { AER_ACCREDITATION_REFERENCE_DOCUMENT_TYPES } from '@requests/common/aer/aer.consts';
import { MaterialityLevelStep } from '@requests/common/aer/subtasks/materiality-level/materiality-level.helpers';
import { materialityLevelMap } from '@requests/common/aer/subtasks/materiality-level/materiality-level-subtask-list.map';
import { NotProvidedDirective } from '@shared/directives';
import { AccreditationReferenceDocumentTypesPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-materiality-level-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NotProvidedDirective,
    AccreditationReferenceDocumentTypesPipe,
  ],
  templateUrl: './materiality-level-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialityLevelSummaryTemplateComponent {
  readonly data = input<AerMaterialityLevel>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = MaterialityLevelStep;
  readonly map = materialityLevelMap;
  readonly accreditationReferenceDocumentTypes = computed(() =>
    AER_ACCREDITATION_REFERENCE_DOCUMENT_TYPES.filter(
      (type) => type !== 'OTHER' && this.data()?.accreditationReferenceDocumentTypes?.includes(type),
    ),
  );
}
