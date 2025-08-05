import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AerShipEmissions, EmpShipEmissions } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  GovukTableColumn,
  LinkDirective,
  TableComponent,
  WarningTextComponent,
} from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { emissionsSubtaskMap } from '@requests/common/components/emissions';
import { EMISSIONS_SUB_TASK, UPLOAD_SHIPS_STEP } from '@requests/common/components/emissions/emissions.helpers';
import { LIST_OF_SHIPS_STEP } from '@requests/common/components/emissions/emissions.helpers';
import { ShipTypePipe } from '@requests/common/components/emissions/pipes';
import { uploadShipsFormProvider } from '@requests/common/components/emissions/upload-ships/upload-ships.form-provider';
import { UPLOAD_SHIPS_XML_SERVICE } from '@requests/common/components/emissions/upload-ships/upload-ships-xml-service.token';
import { TASK_FORM } from '@requests/common/task-form.token';
import { DataParserWizardStepComponent } from '@shared/components';
import { ShipEmissionTableListItem, XmlValidationError } from '@shared/types';
import { isAer } from '@shared/utils';

@Component({
  selector: 'mrtm-upload-ships',
  standalone: true,
  imports: [
    LinkDirective,
    RouterLink,
    DataParserWizardStepComponent,
    ButtonDirective,
    TableComponent,
    ShipTypePipe,
    WarningTextComponent,
  ],
  templateUrl: './upload-ships.component.html',
  providers: [uploadShipsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadShipsComponent {
  protected readonly formGroup = inject<UntypedFormGroup>(TASK_FORM);
  private readonly store = inject(RequestTaskStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly service = inject(TaskService);
  private readonly xmlService = inject(UPLOAD_SHIPS_XML_SERVICE);
  private readonly commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
  private readonly taskType = this.store.select(requestTaskQuery.selectRequestTaskType);

  @ViewChild(DataParserWizardStepComponent) wizardStep: DataParserWizardStepComponent;

  readonly isAer = computed(() => isAer(this.taskType()));
  readonly taskMap = emissionsSubtaskMap;
  readonly tableColumns: GovukTableColumn<Omit<ShipEmissionTableListItem, 'status'>>[] = [
    { field: 'imoNumber', header: 'IMO number', widthClass: 'govuk-!-width-one-third' },
    { field: 'name', header: 'Name', widthClass: 'govuk-!-width-one-third' },
    { field: 'type', header: 'Type', widthClass: 'govuk-!-width-one-third' },
  ];
  readonly fileCtrl = this.formGroup.controls.file;
  readonly listOfShipsStep = LIST_OF_SHIPS_STEP;
  readonly reportingYear = computed(() =>
    this.isAer() ? this.store.select(aerCommonQuery.selectReportingYear)() : null,
  );
  readonly existingShips = this.store.select(this.commonSubtaskStepsQuery.selectListOfShips);
  readonly xmlErrors: WritableSignal<XmlValidationError[]> = signal([]);
  readonly shipEmissionListItems: WritableSignal<Omit<ShipEmissionTableListItem, 'status'>[]> = signal([]);
  readonly listOfShips: WritableSignal<AerShipEmissions[] | EmpShipEmissions[]> = signal([]);
  uploadedFile: File;

  async onFileSelect(event: any) {
    this.wizardStep.isSummaryDisplayedSubject.next(false);
    this.xmlErrors.set([]);
    this.shipEmissionListItems.set([]);
    this.listOfShips.set([]);
    this.uploadedFile = event.target.files[0];
    this.fileCtrl.setValue(this.uploadedFile);

    if (this.fileCtrl.valid) {
      const xmlText = await this.uploadedFile.text();
      const shipsXml = this.xmlService.parse(xmlText, this.reportingYear());
      this.xmlErrors.set(shipsXml?.errors);
      if (shipsXml?.data?.length > 0) {
        const shipEmissionTableListItems = shipsXml.data.map((ship) => ({
          uniqueIdentifier: ship.uniqueIdentifier,
          ...ship.details,
        }));
        this.shipEmissionListItems.set(shipEmissionTableListItems);
        this.listOfShips.set(shipsXml?.data);
      }
    }

    this.wizardStep.isSummaryDisplayedSubject.next(true);
    event.target.value = '';
  }

  /**
   * Set custom error when no file is uploaded but submit is clicked
   */
  private setNoFileUploadedError() {
    this.xmlErrors.set([
      {
        row: null,
        column: null,
        message: 'Upload the ships and emission details file',
      },
    ]);
    this.wizardStep.isSummaryDisplayedSubject.next(true);
  }

  onSubmit() {
    if (!this.xmlErrors()?.length && !this.listOfShips()?.length) {
      this.setNoFileUploadedError();
    } else if (this.listOfShips()?.length) {
      this.service
        .saveSubtask(EMISSIONS_SUB_TASK, UPLOAD_SHIPS_STEP, this.activatedRoute, this.listOfShips())
        .subscribe();
    }
  }
}
