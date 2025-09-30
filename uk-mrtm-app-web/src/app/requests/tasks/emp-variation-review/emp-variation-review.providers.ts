import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { UPLOAD_SHIPS_XML_SERVICE } from '@requests/common/components/emissions/upload-ships';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { empCommonSubtaskStepsProvider } from '@requests/common/emp';
import { RETURN_FOR_AMENDS_SERVICE } from '@requests/common/emp/return-for-amends';
import {
  ABBREVIATIONS_SUB_TASK,
  AbbreviationsQuestionPayloadMutator,
  AbbreviationsReviewFlowManager,
} from '@requests/common/emp/subtasks/abbreviations';
import {
  AdditionalDocumentsReviewFlowManager,
  AdditionalDocumentsUploadPayloadMutator,
} from '@requests/common/emp/subtasks/additional-documents';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesCorrectionsAndCorrectivesPayloadMutator,
  ControlActivitiesDocumentationPayloadMutator,
  ControlActivitiesInternalReviewsPayloadMutator,
  ControlActivitiesOutsourcedActivitiesPayloadMutator,
  ControlActivitiesQualityAssurancePayloadMutator,
  ControlActivitiesReviewFlowManager,
} from '@requests/common/emp/subtasks/control-activities';
import {
  DATA_GAPS_SUB_TASK,
  DataGapsMethodPayloadMutator,
  DataGapsReviewFlowManager,
} from '@requests/common/emp/subtasks/data-gaps';
import {
  EMISSION_SOURCES_SUB_TASK,
  EmissionSourcesCompletionPayloadMutator,
  EmissionSourcesCompliancePayloadMutator,
  EmissionSourcesFactorsPayloadMutator,
  EmissionSourcesReviewFlowManager,
} from '@requests/common/emp/subtasks/emission-sources';
import {
  EmissionsReviewFlowManager,
  provideEmissionDependenciesSideEffect,
  provideEmpEmissionsSubtaskCommonPayloadMutators,
} from '@requests/common/emp/subtasks/emissions';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { EmpShipsXmlService } from '@requests/common/emp/subtasks/emissions/services';
import {
  GREENHOUSE_GAS_SUB_TASK,
  GreenhouseGasCrossChecksPayloadMutator,
  GreenhouseGasFuelPayloadMutator,
  GreenhouseGasInformationPayloadMutator,
  GreenhouseGasQaEquipmentPayloadMutator,
  GreenhouseGasReviewFlowManager,
  GreenhouseGasVoyagesPayloadMutator,
} from '@requests/common/emp/subtasks/greenhouse-gas';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresAdequacyPayloadMutator,
  ManagementProceduresDataFlowPayloadMutator,
  ManagementProceduresReviewFlowManager,
  ManagementProceduresRiskAssessmentPayloadMutator,
  ManagementProceduresRolesPayloadMutator,
} from '@requests/common/emp/subtasks/management-procedures';
import {
  LegalStatusOfOrganisationPayloadMutator,
  OperatorDetailsReviewFlowManager,
  OperatorDetailsStepPayloadMutator,
  OrganisationDetailsPayloadMutator,
  UndertakenActivitiesPayloadMutator,
} from '@requests/common/emp/subtasks/operator-details';
import { VariationDetailsPayloadMutator } from '@requests/common/emp/subtasks/variation-details';
import { provideEmpReviewSideEffect } from '@requests/common/emp/utils';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { empVariationReviewAmendsNeededGroupsProvider } from '@requests/tasks/emp-variation-review/emp-variation-review-amends-needed-groups.provider';
import { EmpVariationReviewApiService, EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { AbbreviationsVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/abbreviations';
import { AdditionalDocumentsVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/additional-documents';
import { ControlActivitiesVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/control-activities';
import { DataGapsVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/data-gaps';
import { EmissionSourcesVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/emission-sources';
import { ListOfShipsVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/emissions';
import { GreenhouseGasVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/greenhouse-gas';
import { ManagementProceduresVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/management-procedures';
import { OperatorDetailsVariationReviewDecisionPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/operator-details';
import {
  OverallDecisionActionsPayloadMutator,
  OverallDecisionFlowManager,
  OverallDecisionQuestionPayloadMutator,
  OverallDecisionVariationLogPayloadMutator,
} from '@requests/tasks/emp-variation-review/subtasks/overall-decision';
import { OverallDecisionVariationReviewSummaryPayloadMutator } from '@requests/tasks/emp-variation-review/subtasks/overall-decision/overall-decision-variation-review-summary/overall-decision-variation-review-summary.payload-mutator';
import { VariationDetailsReviewFlowManager } from '@requests/tasks/emp-variation-review/subtasks/variation-details';
import {
  VariationDetailsDecisionPayloadMutator,
  VariationDetailsDecisionSideEffect,
} from '@requests/tasks/emp-variation-review/subtasks/variation-details/variation-details-decision';
import { VariationDetailsSideEffect } from '@requests/tasks/emp-variation-review/subtasks/variation-details/variation-details-summary/variation-details.side-effect';

export function provideEmpVariationReviewPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Abbreviations
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AbbreviationsQuestionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AbbreviationsVariationReviewDecisionPayloadMutator },
    // Additional Documents
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AdditionalDocumentsUploadPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AdditionalDocumentsVariationReviewDecisionPayloadMutator },
    // Operator details
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OperatorDetailsStepPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UndertakenActivitiesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: LegalStatusOfOrganisationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OrganisationDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OperatorDetailsVariationReviewDecisionPayloadMutator },
    // Control Activities
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesQualityAssurancePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesInternalReviewsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesCorrectionsAndCorrectivesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesDocumentationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesOutsourcedActivitiesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesVariationReviewDecisionPayloadMutator },
    // Data Gaps
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsMethodPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsVariationReviewDecisionPayloadMutator },
    // Emission Sources
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesCompletionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesCompliancePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesFactorsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesVariationReviewDecisionPayloadMutator },
    // GreenhouseGas
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasCrossChecksPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasFuelPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasVoyagesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasQaEquipmentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasInformationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasVariationReviewDecisionPayloadMutator },
    // Management Procedures
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresRolesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresAdequacyPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresDataFlowPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresRiskAssessmentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresVariationReviewDecisionPayloadMutator },
    // Emissions
    ...provideEmpEmissionsSubtaskCommonPayloadMutators(),
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ListOfShipsVariationReviewDecisionPayloadMutator },
    // Variation Details
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: VariationDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: VariationDetailsDecisionPayloadMutator },
    // Overall Decision
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallDecisionActionsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallDecisionQuestionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallDecisionVariationReviewSummaryPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallDecisionVariationLogPayloadMutator },
  ]);
}

export function provideEmpVariationReviewTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskService, useClass: EmpVariationReviewService },
    { provide: TaskApiService, useClass: EmpVariationReviewApiService },
    { provide: RETURN_FOR_AMENDS_SERVICE, useClass: EmpVariationReviewService },
    empVariationReviewAmendsNeededGroupsProvider,
    empCommonSubtaskStepsProvider,
    { provide: UPLOAD_SHIPS_XML_SERVICE, useClass: EmpShipsXmlService },
  ]);
}

export function provideEmpVariationReviewSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM),
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST),
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.EMISSION_SOURCES_FORM),
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.EMISSION_SOURCES_LIST),
    provideEmpReviewSideEffect(ABBREVIATIONS_SUB_TASK),
    provideEmpReviewSideEffect(ADDITIONAL_DOCUMENTS_SUB_TASK),
    provideEmpReviewSideEffect(CONTROL_ACTIVITIES_SUB_TASK),
    provideEmpReviewSideEffect(DATA_GAPS_SUB_TASK),
    provideEmpReviewSideEffect(EMISSION_SOURCES_SUB_TASK),
    provideEmpReviewSideEffect(EMISSIONS_SUB_TASK),
    provideEmpReviewSideEffect(GREENHOUSE_GAS_SUB_TASK),
    provideEmpReviewSideEffect(MANAGEMENT_PROCEDURES_SUB_TASK),
    provideEmpReviewSideEffect(OPERATOR_DETAILS_SUB_TASK),
    { provide: SIDE_EFFECTS, multi: true, useClass: VariationDetailsDecisionSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: VariationDetailsSideEffect },
  ]);
}

export function provideEmpVariationReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AbbreviationsReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AdditionalDocumentsReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ManagementProceduresReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: OperatorDetailsReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ControlActivitiesReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: DataGapsReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: GreenhouseGasReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EmissionSourcesReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EmissionsReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: VariationDetailsReviewFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: OverallDecisionFlowManager },
  ]);
}
