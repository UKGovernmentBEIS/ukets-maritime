import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { UPLOAD_SHIPS_XML_SERVICE } from '@requests/common/components/emissions/upload-ships';
import { empCommonSubtaskStepsProvider } from '@requests/common/emp';
import {
  AbbreviationsFlowManager,
  AbbreviationsQuestionPayloadMutator,
  AbbreviationsSummarySideEffect,
} from '@requests/common/emp/subtasks/abbreviations';
import {
  AdditionalDocumentsSummarySideEffect,
  AdditionalDocumentsUploadPayloadMutator,
} from '@requests/common/emp/subtasks/additional-documents';
import {
  ControlActivitiesCorrectionsAndCorrectivesPayloadMutator,
  ControlActivitiesDocumentationPayloadMutator,
  ControlActivitiesFlowManager,
  ControlActivitiesInternalReviewsPayloadMutator,
  ControlActivitiesOutsourcedActivitiesPayloadMutator,
  ControlActivitiesQualityAssurancePayloadMutator,
  ControlActivitiesSummarySideEffect,
} from '@requests/common/emp/subtasks/control-activities';
import {
  DataGapsFlowManager,
  DataGapsMethodPayloadMutator,
  DataGapsSummarySideEffect,
} from '@requests/common/emp/subtasks/data-gaps';
import {
  EmissionSourceFlowManager,
  EmissionSourcesCompletionPayloadMutator,
  EmissionSourcesFactorsPayloadMutator,
  EmissionSourcesSummarySideEffect,
} from '@requests/common/emp/subtasks/emission-sources';
import {
  EmissionsFlowManager,
  ListOfShipsSummarySideEffect,
  provideEmissionDependenciesSideEffect,
  provideEmpEmissionsSubtaskCommonPayloadMutators,
} from '@requests/common/emp/subtasks/emissions';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { EmpShipsXmlService } from '@requests/common/emp/subtasks/emissions/services';
import {
  GreenhouseGasCrossChecksPayloadMutator,
  GreenhouseGasFlowManager,
  GreenhouseGasFuelPayloadMutator,
  GreenhouseGasInformationPayloadMutator,
  GreenhouseGasQaEquipmentPayloadMutator,
  GreenhouseGasSummarySideEffect,
  GreenhouseGasVoyagesPayloadMutator,
} from '@requests/common/emp/subtasks/greenhouse-gas';
import {
  ManagementProceduresAdequacyPayloadMutator,
  ManagementProceduresDataFlowPayloadMutator,
  ManagementProceduresFlowManager,
  ManagementProceduresRiskAssessmentPayloadMutator,
  ManagementProceduresRolesPayloadMutator,
  ManagementProceduresSummarySideEffect,
} from '@requests/common/emp/subtasks/management-procedures';
import {
  DeclarationDocumentsPayloadMutator,
  LegalStatusOfOrganisationPayloadMutator,
  OperatorDetailsFlowManager,
  OperatorDetailsStepPayloadMutator,
  OperatorDetailsSummarySideEffect,
  OrganisationDetailsPayloadMutator,
  UndertakenActivitiesPayloadMutator,
} from '@requests/common/emp/subtasks/operator-details';
import {
  VariationDetailsFlowManager,
  VariationDetailsPayloadMutator,
  VariationDetailsSummarySideEffect,
} from '@requests/common/emp/subtasks/variation-details';
import { provideEmpAmendResetReviewDecisionSubtaskSideEffect } from '@requests/common/emp/utils';
import { AdditionalDocumentsFlowManager } from '@requests/common/utils/additional-documents';
import { EmpVariationApiService, EmpVariationService } from '@requests/tasks/emp-variation/services';

export function provideEmpVariationPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AbbreviationsQuestionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AdditionalDocumentsUploadPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresRolesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresAdequacyPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresDataFlowPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresRiskAssessmentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OperatorDetailsStepPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UndertakenActivitiesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DeclarationDocumentsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: LegalStatusOfOrganisationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OrganisationDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesQualityAssurancePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesInternalReviewsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesCorrectionsAndCorrectivesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesDocumentationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesOutsourcedActivitiesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsMethodPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasCrossChecksPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasFuelPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasVoyagesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasQaEquipmentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasInformationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesCompletionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesFactorsPayloadMutator },
    ...provideEmpEmissionsSubtaskCommonPayloadMutators(),
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: VariationDetailsPayloadMutator },
  ]);
}

export function provideEmpVariationTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskService, useClass: EmpVariationService },
    { provide: TaskApiService, useClass: EmpVariationApiService },
    empCommonSubtaskStepsProvider,
    { provide: UPLOAD_SHIPS_XML_SERVICE, useClass: EmpShipsXmlService },
  ]);
}

export function provideEmpVariationSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: AbbreviationsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AdditionalDocumentsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ManagementProceduresSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: OperatorDetailsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ControlActivitiesSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: DataGapsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: GreenhouseGasSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: EmissionSourcesSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ListOfShipsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: VariationDetailsSummarySideEffect },
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM),
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST),
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.EMISSION_SOURCES_FORM),
    provideEmissionDependenciesSideEffect(EmissionsWizardStep.EMISSION_SOURCES_LIST),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('operatorDetails'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('abbreviations'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('dataGaps'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('emissions'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('sources'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('additionalDocuments'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('controlActivities'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('managementProcedures'),
    provideEmpAmendResetReviewDecisionSubtaskSideEffect('greenhouseGas'),
  ]);
}

export function provideEmpVariationStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AbbreviationsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AdditionalDocumentsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ManagementProceduresFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: OperatorDetailsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ControlActivitiesFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: DataGapsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: GreenhouseGasFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EmissionSourceFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EmissionsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: VariationDetailsFlowManager },
  ]);
}
