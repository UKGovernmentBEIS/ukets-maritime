import { computed, Provider } from '@angular/core';

import { LimitedCompanyOrganisation } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages';
import { MONITORING_PLAN_CHANGES_SUB_TASK } from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { AER_REDUCTION_CLAIM_SUB_TASK, reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { AER_REVIEW_SUBTASK_DETAILS } from '@requests/tasks/aer-review/aer-review.constants';
import { AerReviewSummaryDetailsSection, AerReviewTaskPayload } from '@requests/tasks/aer-review/aer-review.types';
import {
  AdditionalDocumentsSummaryTemplateComponent,
  AerTotalEmissionsSummaryTemplateComponent,
  AggregatedDataListSummaryTemplateComponent,
  ListOfShipsSummaryTemplateComponent,
  MonitoringPlanChangesSummaryTemplateComponent,
  OperatorDetailsSummaryTemplateComponent,
  PortCallsListSummaryTemplateComponent,
  ReductionClaimSubmittedSummaryTemplateComponent,
  VoyagesListSummaryTemplateComponent,
} from '@shared/components';

const provideOperatorSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: OperatorDetailsSummaryTemplateComponent,
      inputs: computed(() => {
        const operatorDetails = store.select(aerCommonQuery.selectAerOperatorDetails)();

        return {
          operatorDetails,
          files: store.select(
            aerCommonQuery.selectAttachedFiles(
              (operatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
            ),
          ),
        };
      }),
    };
  },
};

const provideMonitoringPlanChangesSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: MonitoringPlanChangesSummaryTemplateComponent,
      inputs: computed(() => ({
        monitoringPlanChanges: store.select(aerCommonQuery.selectMonitoringPlanChanges)(),
        monitoringPlanVersion: store.select(aerCommonQuery.selectMonitoringPlanVersion)(),
      })),
    };
  },
};

const provideEmissionSourceSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: ListOfShipsSummaryTemplateComponent,
      inputs: computed(() => ({
        data: store.select(aerCommonQuery.selectListOfShips)(),
        editUrl: '.',
      })),
    };
  },
};

const provideReductionClaimSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: ReductionClaimSubmittedSummaryTemplateComponent,
      inputs: computed(() => ({
        data: store.select(aerCommonQuery.selectReductionClaim)(),
        wizardMap: reductionClaimMap,
        fuelPurchases: store.select(aerCommonQuery.selectReductionClaimDetailsListItems)(),
        dataSupplierName: store.select(aerCommonQuery.selectThirdPartyDataProviderName)(),
      })),
    };
  },
};

const provideAdditionalDocumentSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: AdditionalDocumentsSummaryTemplateComponent,
      inputs: computed(() => {
        const additionalDocuments = store.select(aerCommonQuery.selectAerAdditionalDocuments)();
        const files = store.select(aerCommonQuery.selectAttachedFiles(additionalDocuments?.documents))();

        return {
          additionalDocuments,
          additionalDocumentsMap: aerAdditionalDocumentsMap,
          files,
        };
      }),
    };
  },
};

const provideTotalEmissionsSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: AerTotalEmissionsSummaryTemplateComponent,
      inputs: computed(() => ({
        totalEmissions: store.select(aerCommonQuery.selectTotalEmissions)(),
      })),
    };
  },
};

const provideAerAggregatedDataSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: AggregatedDataListSummaryTemplateComponent,
      inputs: computed(() => ({
        data: store
          .select(aerCommonQuery.selectAggregatedDataList)()
          .map((item) => ({
            ...item,
            status: TaskItemStatus.COMPLETED,
          })),
      })),
    };
  },
};

const provideVoyagesSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: VoyagesListSummaryTemplateComponent,
      inputs: computed(() => ({
        data: store
          .select(aerCommonQuery.selectVoyagesList)()
          .map((item) => ({ ...item, status: TaskItemStatus.COMPLETED })),
      })),
    };
  },
};

const providePortsSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: PortCallsListSummaryTemplateComponent,
      inputs: computed(() => ({
        data: store
          .select(aerCommonQuery.selectPortsList)()
          .map((item) => ({ ...item, status: TaskItemStatus.COMPLETED })),
      })),
    };
  },
};

export const operatorSideSummariesProvidersMap: Partial<Record<keyof AerReviewTaskPayload['aer'] | string, Provider>> =
  {
    [OPERATOR_DETAILS_SUB_TASK]: provideOperatorSubtaskSummary,
    [MONITORING_PLAN_CHANGES_SUB_TASK]: provideMonitoringPlanChangesSubtaskSummary,
    [EMISSIONS_SUB_TASK]: provideEmissionSourceSubtaskSummary,
    [AER_REDUCTION_CLAIM_SUB_TASK]: provideReductionClaimSubtaskSummary,
    [ADDITIONAL_DOCUMENTS_SUB_TASK]: provideAdditionalDocumentSubtaskSummary,
    [AER_TOTAL_EMISSIONS_SUB_TASK]: provideTotalEmissionsSubtaskSummary,
    [AER_AGGREGATED_DATA_SUB_TASK]: provideAerAggregatedDataSubtaskSummary,
    [AER_VOYAGES_SUB_TASK]: provideVoyagesSubtaskSummary,
    [AER_PORTS_SUB_TASK]: providePortsSubtaskSummary,
  };
