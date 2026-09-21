import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { map } from 'rxjs';

import { GovukSelectOption, LinkDirective, SelectComponent, WarningTextComponent } from '@netz/govuk-components';

import { IMPORT_DATA_WIZARD_STEP } from '@api-data-management/api-data-management.constants';
import { IMPORT_DATA_FORM_PROVIDER } from '@api-data-management/import-data';
import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { provideImportDataSelectTaskForm } from '@api-data-management/import-data/import-data-select-task-form/import-data-select-task-form.provider';
import { ApiDataManagementTaskTypeToTextPipe } from '@api-data-management/pipes';
import { ConfigService } from '@core/config';
import { WizardStepComponent } from '@shared/components';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-import-data-select-task-form',
  imports: [WizardStepComponent, WarningTextComponent, SelectComponent, RouterLink, LinkDirective, ReactiveFormsModule],
  templateUrl: './import-data-select-task-form.component.html',
  providers: [provideImportDataSelectTaskForm],
})
export class ImportDataSelectTaskFormComponent {
  private readonly store = inject(ImportDataStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly configService = inject(ConfigService);
  protected readonly formGroup = inject(IMPORT_DATA_FORM_PROVIDER);
  private readonly taskTypeToTextPipe = new ApiDataManagementTaskTypeToTextPipe();

  protected readonly availableTasks = toSignal(
    this.configService
      .getConfigProperty('minYearOfFirstMrtmActivity')
      .pipe(map((minYear) => this.buildTaskOptions(minYear))),
    { initialValue: [] },
  );

  protected onSubmit(): void {
    const [requestType, number] = this.formGroup.value.requestType.split('|');
    this.store.setState({
      ...this.store.state,
      requestType: requestType,
      year: isNil(number) ? undefined : Number(number),
    });

    this.router.navigate([`../${IMPORT_DATA_WIZARD_STEP.SELECT_OPERATOR_ACCOUNTS}`], { relativeTo: this.route });
  }

  private buildTaskOptions(minYearConfig: string): Array<GovukSelectOption> {
    const currentYear = new Date().getFullYear();
    const minYear = Number(minYearConfig);
    const startYear = Number.isFinite(minYear) ? minYear : currentYear;
    const years = Array.from({ length: Math.max(0, currentYear - startYear + 1) }, (_, index) => startYear + index);

    return [
      {
        value: 'EMP_ISSUANCE',
        text: this.taskTypeToTextPipe.transform('EMP_ISSUANCE'),
      },
      {
        value: 'EMP_VARIATION',
        text: this.taskTypeToTextPipe.transform('EMP_VARIATION'),
      },
      ...years.map((year) => ({
        value: `AER|${year}`,
        text: this.taskTypeToTextPipe.transform('AER', year),
      })),
    ].sort((a, b) => a.text.localeCompare(b.text, 'en-GB', { sensitivity: 'base' }));
  }
}
