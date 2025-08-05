import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { UPLOAD_SHIPS_XML_SERVICE } from '@requests/common/components/emissions/upload-ships';
import { empCommonSubtaskStepsProvider } from '@requests/common/emp';
import {
  AbbreviationsQuestionPayloadMutator,
  AbbreviationsSummarySideEffect,
  AbbreviationsVariationRegulatorFlowManager,
} from '@requests/common/emp/subtasks/abbreviations';
import {
  AdditionalDocumentsSummarySideEffect,
  AdditionalDocumentsUploadPayloadMutator,
  AdditionalDocumentsVariationRegulatorFlowManager,
} from '@requests/common/emp/subtasks/additional-documents';
import {
  ControlActivitiesCorrectionsAndCorrectivesPayloadMutator,
  ControlActivitiesDocumentationPayloadMutator,
  ControlActivitiesInternalReviewsPayloadMutator,
  ControlActivitiesOutsourcedActivitiesPayloadMutator,
  ControlActivitiesQualityAssurancePayloadMutator,
  ControlActivitiesSummarySideEffect,
  ControlActivitiesVariationRegulatorFlowManager,
} from '@requests/common/emp/subtasks/control-activities';
import {
  DataGapsMethodPayloadMutator,
  DataGapsSummarySideEffect,
  DataGapsVariationRegulatorFlowManager,
} from '@requests/common/emp/subtasks/data-gaps';
import {
  EmissionSourcesCompletionPayloadMutator,
  EmissionSourcesFactorsPayloadMutator,
  EmissionSourcesSummarySideEffect,
  EmissionSourcesVariationRegulatorFlowManager,
} from '@requests/common/emp/subtasks/emission-sources';
import {
  EmissionsVariationRegulatorFlowManager,
  ListOfShipsSummarySideEffect,
  provideEmissionDependenciesSideEffect,
  provideEmpEmissionsSubtaskCommonPayloadMutators,
} from '@requests/common/emp/subtasks/emissions';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { EmpShipsXmlService } from '@requests/common/emp/subtasks/emissions/services';
import {
  GreenhouseGasCrossChecksPayloadMutator,
  GreenhouseGasFuelPayloadMutator,
  GreenhouseGasInformationPayloadMutator,
  GreenhouseGasQaEquipmentPayloadMutator,
  GreenhouseGasSummarySideEffect,
  GreenhouseGasVariationRegulatorFlowManager,
  GreenhouseGasVoyagesPayloadMutator,
} from '@requests/common/emp/subtasks/greenhouse-gas';
import {
  ManagementProceduresAdequacyPayloadMutator,
  ManagementProceduresDataFlowPayloadMutator,
  ManagementProceduresRiskAssessmentPayloadMutator,
  ManagementProceduresRolesPayloadMutator,
  ManagementProceduresSummarySideEffect,
  ManagementProceduresVariationRegulatorFlowManager,
} from '@requests/common/emp/subtasks/management-procedures';
import {
  DeclarationDocumentsPayloadMutator,
  LegalStatusOfOrganisationPayloadMutator,
  OperatorDetailsStepPayloadMutator,
  OperatorDetailsSummarySideEffect,
  OperatorDetailsVariationRegulatorFlowManager,
  OrganisationDetailsPayloadMutator,
  UndertakenActivitiesPayloadMutator,
} from '@requests/common/emp/subtasks/operator-details';
import {
  VariationDetailsPayloadMutator,
  VariationDetailsReasonNoticePayloadMutator,
  VariationDetailsSummarySideEffect,
  VariationRegulatorDetailsFlowManager,
} from '@requests/common/emp/subtasks/variation-details';
import { VariationDetailsSummaryFormPayloadMutator } from '@requests/common/emp/subtasks/variation-details/variation-details-summary-form';
import {
  EmpVariationRegulatorApiService,
  EmpVariationRegulatorService,
} from '@requests/tasks/emp-variation-regulator/services';
import { AbbreviationsVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/abbreviations';
import { AdditionalDocumentsVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/additional-documents';
import { ControlActivitiesVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/control-activities';
import { DataGapsVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/data-gaps';
import { EmissionSourcesVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/emission-sources';
import { ListOfShipsVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/emissions';
import { GreenhouseGasVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/greenhouse-gas';
import { ManagementProceduresVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/management-procedures';
import { OperatorDetailsVariationRegulatorDecisionPayloadMutator } from '@requests/tasks/emp-variation-regulator/subtasks/operator-details';

export function provideEmpVariationRegulatorPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Abbreviations
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AbbreviationsQuestionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AbbreviationsVariationRegulatorDecisionPayloadMutator },

    // Additional documents
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AdditionalDocumentsUploadPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AdditionalDocumentsVariationRegulatorDecisionPayloadMutator },

    // Management procedures
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresRolesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresAdequacyPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresDataFlowPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresRiskAssessmentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ManagementProceduresVariationRegulatorDecisionPayloadMutator },

    // Operator details
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OperatorDetailsStepPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UndertakenActivitiesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DeclarationDocumentsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: LegalStatusOfOrganisationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OrganisationDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OperatorDetailsVariationRegulatorDecisionPayloadMutator },

    // Control activities
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesQualityAssurancePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesInternalReviewsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesCorrectionsAndCorrectivesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesDocumentationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesOutsourcedActivitiesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ControlActivitiesVariationRegulatorDecisionPayloadMutator },

    // Data gaps
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsMethodPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsVariationRegulatorDecisionPayloadMutator },

    // Greenhouse gas
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasCrossChecksPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasFuelPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasVoyagesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasQaEquipmentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasInformationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: GreenhouseGasVariationRegulatorDecisionPayloadMutator },

    // Emission sources
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesCompletionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesFactorsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesVariationRegulatorDecisionPayloadMutator },

    // Emissions
    ...provideEmpEmissionsSubtaskCommonPayloadMutators(),
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ListOfShipsVariationRegulatorDecisionPayloadMutator },

    // Variation details
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: VariationDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: VariationDetailsReasonNoticePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: VariationDetailsSummaryFormPayloadMutator },
  ]);
}

export function provideEmpVariationRegulatorTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskService, useClass: EmpVariationRegulatorService },
    { provide: TaskApiService, useClass: EmpVariationRegulatorApiService },
    empCommonSubtaskStepsProvider,
    { provide: UPLOAD_SHIPS_XML_SERVICE, useClass: EmpShipsXmlService },
  ]);
}

export function provideEmpVariationRegulatorSideEffects(): EnvironmentProviders {
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
  ]);
}

export function provideEmpVariationRegulatorStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AbbreviationsVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AdditionalDocumentsVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ManagementProceduresVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: OperatorDetailsVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ControlActivitiesVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: DataGapsVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: GreenhouseGasVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EmissionSourcesVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EmissionsVariationRegulatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: VariationRegulatorDetailsFlowManager },
  ]);
}
