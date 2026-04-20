import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { aerCommonSubtaskStepsProvider } from '@requests/common/aer/+state';
import { AerCommonApiService, AerCommonService } from '@requests/common/aer/services';
import {
  AerAdditionalDocumentsSummarySideEffect,
  AerAdditionalDocumentsUploadPayloadMutator,
} from '@requests/common/aer/subtasks/aer-additional-documents';
import {
  AerAggregatedDataAnnualEmissionsPayloadMutator,
  AerAggregatedDataDeletePayloadMutator,
  AerAggregatedDataFlowManager,
  AerAggregatedDataFuelConsumptionPayloadMutator,
  AerAggregatedDataListSummarySideEffect,
  AerAggregatedDataSelectShipPayloadMutator,
  AerAggregatedDataShipDeletedSideEffect,
  AerAggregatedDataShipSummaryPayloadMutator,
  AerAggregatedDataUploadPayloadMutator,
  AerFetchFromVoyagesAndPortsPayloadMutator,
  AerTotalEmissionsNeedsReviewOnAerAggregatedDataChangeSideEffect,
} from '@requests/common/aer/subtasks/aer-aggregated-data';
import {
  AerBasicShipDetailPayloadMutator,
  AerDeleteShipsPayloadMutator,
  AerDerogationsPayloadMutator,
  AerEmissionsFlowManager,
  AerEmissionSourcesAndFuelTypesUsedFormPayloadMutator,
  AerEmissionSourcesAndFuelTypesUsedListPayloadMutator,
  AerEmissionsSummarySideEffect,
  AerEmissionsWizardStep,
  AerFetchShipsFromEmpSideEffect,
  AerFuelsAndEmissionFactorsFormPayloadMutator,
  AerFuelsAndEmissionFactorsListPayloadMutator,
  AerShipSummaryPayloadMutator,
  AerUncertaintyLevelPayloadMutator,
  AerUploadShipsPayloadMutator,
  AerUploadShipsSideEffect,
  provideAerEmissionDependenciesSideEffect,
} from '@requests/common/aer/subtasks/aer-emissions';
import { AerShipsXmlService } from '@requests/common/aer/subtasks/aer-emissions/services';
import {
  AerLegalStatusOfOrganisationPayloadMutator,
  AerOperatorDetailsFlowManager,
  AerOperatorDetailsStepPayloadMutator,
  AerOperatorDetailsSummarySideEffect,
  AerOrganisationDetailsPayloadMutator,
} from '@requests/common/aer/subtasks/aer-operator-details';
import {
  AerPortAggregatedDataSideEffect,
  AerPortCallSummaryPayloadMutator,
  AerPortDeleteDirectEmissionPayloadMutator,
  AerPortDeleteFuelConsumptionPayloadMutator,
  AerPortDeletePayloadMutator,
  AerPortDetailsPayloadMutator,
  AerPortDirectEmissionPayloadMutator,
  AerPortEmissionShipDeletedSideEffect,
  AerPortFuelConsumptionPayloadMutator,
  AerPortSelectShipPayloadMutator,
  AerPortsFlowManager,
  AerPortsSummarySideEffect,
  AerPortsUploadPayloadMutator,
} from '@requests/common/aer/subtasks/aer-ports';
import {
  AerTotalEmissionsFlowManager,
  AerTotalEmissionsSummarySideEffect,
} from '@requests/common/aer/subtasks/aer-total-emissions';
import {
  AerVoyageAggregatedDataSideEffect,
  AerVoyageDeleteDirectEmissionPayloadMutator,
  AerVoyageDeleteFuelConsumptionPayloadMutator,
  AerVoyageDeletePayloadMutator,
  AerVoyageDetailsPayloadMutator,
  AerVoyageDirectEmissionPayloadMutator,
  AerVoyageEmissionShipDeletedSideEffect,
  AerVoyageEmissionSummaryPayloadMutator,
  AerVoyageFuelConsumptionPayloadMutator,
  AerVoyageSelectShipPayloadMutator,
  AerVoyagesFlowManager,
  AerVoyagesSummarySideEffect,
  AerVoyageUploadPayloadMutator,
} from '@requests/common/aer/subtasks/aer-voyages';
import {
  MonitoringPlanChangesFlowManager,
  MonitoringPlanChangesFormPayloadMutator,
  MonitoringPlanChangesSummarySideEffect,
} from '@requests/common/aer/subtasks/monitoring-plan-changes';
import {
  AerTotalEmissionsNeedsReviewOnReductionClaimChangeSideEffect,
  ReductionClaimDetailsPayloadMutator,
  ReductionClaimExistPayloadMutator,
  ReductionClaimFlowManager,
  ReductionClaimFuelPurchasePayloadMutator,
  ReductionClaimFuelPurchaseSideEffect,
  ReductionClaimInProgressSideEffect,
  ReductionClaimSummarySideEffect,
} from '@requests/common/aer/subtasks/reduction-claim';
import {
  ReportingObligationFlowManager,
  ReportingObligationFormPayloadMutator,
  ReportingObligationSummarySideEffect,
} from '@requests/common/aer/subtasks/reporting-obligation';
import { UPLOAD_SHIPS_XML_SERVICE } from '@requests/common/components/emissions/upload-ships';
import { AdditionalDocumentsFlowManager } from '@requests/common/utils/additional-documents';

export function provideAerSubmitPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Reporting Obligation
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ReportingObligationFormPayloadMutator },

    // Operator Details
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerOperatorDetailsStepPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerLegalStatusOfOrganisationPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerOrganisationDetailsPayloadMutator },

    // Monitoring Plan Changes
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: MonitoringPlanChangesFormPayloadMutator },

    // Emissions (Ships)
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerBasicShipDetailPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerFuelsAndEmissionFactorsListPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerFuelsAndEmissionFactorsFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerEmissionSourcesAndFuelTypesUsedListPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerEmissionSourcesAndFuelTypesUsedFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerDerogationsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerDeleteShipsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerUncertaintyLevelPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerUploadShipsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerShipSummaryPayloadMutator },

    // Ports
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortDeleteDirectEmissionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortDeleteFuelConsumptionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortSelectShipPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortDirectEmissionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortFuelConsumptionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortCallSummaryPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerPortsUploadPayloadMutator },

    // Voyages
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageDeleteDirectEmissionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageDeleteFuelConsumptionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageSelectShipPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageDirectEmissionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageFuelConsumptionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageEmissionSummaryPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerVoyageUploadPayloadMutator },

    // Aggregated Data
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerAggregatedDataSelectShipPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerAggregatedDataDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerAggregatedDataFuelConsumptionPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerAggregatedDataAnnualEmissionsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerAggregatedDataShipSummaryPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerFetchFromVoyagesAndPortsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerAggregatedDataUploadPayloadMutator },

    // Reduction Claim
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ReductionClaimExistPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ReductionClaimFuelPurchasePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ReductionClaimDetailsPayloadMutator },

    // Additional Documents
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: AerAdditionalDocumentsUploadPayloadMutator },
  ]);
}

export function provideAerSubmitTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: AerCommonApiService },
    { provide: TaskService, useClass: AerCommonService },
    aerCommonSubtaskStepsProvider,
    { provide: UPLOAD_SHIPS_XML_SERVICE, useClass: AerShipsXmlService },
  ]);
}

export function provideAerSubmitSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: ReportingObligationSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerOperatorDetailsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: MonitoringPlanChangesSummarySideEffect },

    // Emissions (Ships)
    { provide: SIDE_EFFECTS, multi: true, useClass: AerEmissionsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerFetchShipsFromEmpSideEffect },
    provideAerEmissionDependenciesSideEffect(AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST),
    provideAerEmissionDependenciesSideEffect(AerEmissionsWizardStep.FUELS_AND_EMISSIONS_FORM),
    provideAerEmissionDependenciesSideEffect(AerEmissionsWizardStep.EMISSION_SOURCES_FORM),
    provideAerEmissionDependenciesSideEffect(AerEmissionsWizardStep.EMISSION_SOURCES_LIST),
    { provide: SIDE_EFFECTS, multi: true, useClass: AerUploadShipsSideEffect },

    // Ports
    { provide: SIDE_EFFECTS, multi: true, useClass: AerPortsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerPortAggregatedDataSideEffect },

    // Voyages
    { provide: SIDE_EFFECTS, multi: true, useClass: AerVoyagesSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerVoyageAggregatedDataSideEffect },

    // Ports & Voyages Emissions dependencies(ships)
    { provide: SIDE_EFFECTS, multi: true, useClass: AerPortEmissionShipDeletedSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerVoyageEmissionShipDeletedSideEffect },

    // Aggregated Data
    { provide: SIDE_EFFECTS, multi: true, useClass: AerAggregatedDataListSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerAggregatedDataShipDeletedSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerTotalEmissionsNeedsReviewOnAerAggregatedDataChangeSideEffect },

    // Reduction Claim
    { provide: SIDE_EFFECTS, multi: true, useClass: ReductionClaimSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ReductionClaimInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ReductionClaimFuelPurchaseSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AerTotalEmissionsNeedsReviewOnReductionClaimChangeSideEffect },

    // Additional Documents
    { provide: SIDE_EFFECTS, multi: true, useClass: AerAdditionalDocumentsSummarySideEffect },

    // Total Emissions
    { provide: SIDE_EFFECTS, multi: true, useClass: AerTotalEmissionsSummarySideEffect },
  ]);
}

export function provideAerSubmitStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ReportingObligationFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AerOperatorDetailsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: MonitoringPlanChangesFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AerEmissionsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AdditionalDocumentsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AerPortsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AerVoyagesFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AerAggregatedDataFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ReductionClaimFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AerTotalEmissionsFlowManager },
  ]);
}
