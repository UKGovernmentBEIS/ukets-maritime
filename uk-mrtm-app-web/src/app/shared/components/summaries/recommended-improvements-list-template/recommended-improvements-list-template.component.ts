import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { VerifierComment } from '@mrtm/api';

import { ButtonDirective, GovukTableColumn, LinkDirective, TableComponent } from '@netz/govuk-components';

import { RecommendedImprovementsStep } from '@requests/common/aer/subtasks/recommended-improvements/recommended-improvements.helpers';
import { recommendedImprovementsMap } from '@requests/common/aer/subtasks/recommended-improvements/recommended-improvements-subtask-list.map';

@Component({
  selector: 'mrtm-recommended-improvements-list-template',
  standalone: true,
  imports: [RouterLink, ButtonDirective, LinkDirective, TableComponent],
  templateUrl: './recommended-improvements-list-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedImprovementsListTemplateComponent {
  readonly data = input.required<VerifierComment[]>();
  readonly isEditable = input<boolean>(false);
  readonly editLinkPrefix = input<string>('../');
  readonly queryParams = input<Params>();

  readonly wizardStep = RecommendedImprovementsStep;
  readonly map = recommendedImprovementsMap;
  readonly columns: Array<GovukTableColumn> = [
    { field: 'reference', header: 'Reference', widthClass: 'app-column-width-15-per' },
    { field: 'explanation', header: 'Explanation' },
    { field: 'actionLinks', header: 'Actions', hiddenHeader: true },
  ];
}
