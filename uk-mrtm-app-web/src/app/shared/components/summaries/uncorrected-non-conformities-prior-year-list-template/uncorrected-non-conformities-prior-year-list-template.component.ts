import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { VerifierComment } from '@mrtm/api';

import { ButtonDirective, GovukTableColumn, LinkDirective, TableComponent } from '@netz/govuk-components';

import { uncorrectedNonConformitiesMap, UncorrectedNonConformitiesStep } from '@requests/common/aer';

@Component({
  selector: 'mrtm-uncorrected-non-conformities-prior-year-list-template',
  standalone: true,
  imports: [RouterLink, ButtonDirective, LinkDirective, TableComponent],
  templateUrl: './uncorrected-non-conformities-prior-year-list-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedNonConformitiesPriorYearListTemplateComponent {
  readonly data = input.required<VerifierComment[]>();
  readonly isEditable = input<boolean>(false);
  readonly editLinkPrefix = input<string>('../');
  readonly queryParams = input<Params>();

  readonly wizardStep = UncorrectedNonConformitiesStep;
  readonly map = uncorrectedNonConformitiesMap;
  readonly columns: Array<GovukTableColumn> = [
    { field: 'reference', header: 'Reference', widthClass: 'app-column-width-15-per' },
    { field: 'explanation', header: 'Explanation' },
    { field: 'actionLinks', header: '' },
  ];
}
