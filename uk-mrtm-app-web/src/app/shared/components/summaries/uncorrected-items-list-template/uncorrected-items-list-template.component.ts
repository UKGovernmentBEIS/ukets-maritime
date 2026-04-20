import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { UncorrectedItem } from '@mrtm/api';

import { ButtonDirective, GovukTableColumn, LinkDirective, TableComponent } from '@netz/govuk-components';

import {
  AER_VERIFIER_FINDINGS_STEP_ITEM_DELETE,
  AER_VERIFIER_FINDINGS_STEP_ITEM_FORM_ADD,
  AER_VERIFIER_FINDINGS_STEP_ITEM_FORM_EDIT,
} from '@requests/common/aer/aer.consts';

@Component({
  selector: 'mrtm-uncorrected-items-list-template',
  standalone: true,
  imports: [RouterLink, ButtonDirective, LinkDirective, TableComponent],
  templateUrl: './uncorrected-items-list-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedItemsListTemplateComponent {
  readonly data = input.required<UncorrectedItem[]>();
  readonly description = input.required<string>();
  readonly isEditable = input<boolean>(false);
  readonly editLinkPrefix = input<string>('../');
  readonly queryParams = input<Params>();

  readonly STEP_ITEM_FORM_ADD = AER_VERIFIER_FINDINGS_STEP_ITEM_FORM_ADD;
  readonly STEP_ITEM_FORM_EDIT = AER_VERIFIER_FINDINGS_STEP_ITEM_FORM_EDIT;
  readonly STEP_ITEM_DELETE = AER_VERIFIER_FINDINGS_STEP_ITEM_DELETE;
  readonly columns: Array<GovukTableColumn> = [
    { field: 'reference', header: 'Reference', widthClass: 'app-column-width-15-per' },
    { field: 'explanation', header: 'Explanation' },
    { field: 'materialEffect', header: 'Impact', widthClass: 'app-column-width-15-per' },
    { field: 'actionLinks', header: '' },
  ];
}
