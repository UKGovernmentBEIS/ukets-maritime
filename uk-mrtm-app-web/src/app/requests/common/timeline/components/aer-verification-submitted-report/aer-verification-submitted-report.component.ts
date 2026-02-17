import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import {
  AerComplianceMonitoringReporting,
  AerDataGapsMethodologies,
  AerEtsComplianceRules,
  AerMaterialityLevel,
  AerMonitoringPlanChanges,
  AerMonitoringPlanVersion,
  AerOpinionStatement,
  AerRecommendedImprovements,
  AerTotalEmissions,
  AerUncorrectedMisstatements,
  AerUncorrectedNonCompliances,
  AerUncorrectedNonConformities,
  AerVerificationDecision,
} from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { GovukDatePipe } from '@netz/common/pipes';
import { RequestActionReportService } from '@netz/common/services';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';
import { getYearFromRequestId } from '@netz/common/utils';

import { timelineCommonQuery } from '@requests/common';
import { AerVerifierDetails } from '@requests/common/aer/aer.types';
import { complianceMonitoringReportingMap } from '@requests/common/aer/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting-subtask-list.map';
import { dataGapsMethodologiesMap } from '@requests/common/aer/subtasks/data-gaps-methodologies/data-gaps-methodologies-subtask-list.map';
import { etsComplianceRulesMap } from '@requests/common/aer/subtasks/ets-compliance-rules/ets-compliance-rules-subtask-list.map';
import { materialityLevelMap } from '@requests/common/aer/subtasks/materiality-level/materiality-level-subtask-list.map';
import { opinionStatementMap } from '@requests/common/aer/subtasks/opinion-statement/opinion-statement-subtask-list.map';
import { overallVerificationDecisionMap } from '@requests/common/aer/subtasks/overall-verification-decision/overall-verification-decision-subtask-list.map';
import { recommendedImprovementsMap } from '@requests/common/aer/subtasks/recommended-improvements/recommended-improvements-subtask-list.map';
import { uncorrectedMisstatementsMap } from '@requests/common/aer/subtasks/uncorrected-misstatements/uncorrected-misstatements-subtask-list.map';
import { uncorrectedNonCompliancesMap } from '@requests/common/aer/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-subtask-list.map';
import { uncorrectedNonConformitiesMap } from '@requests/common/aer/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-subtask-list.map';
import { verifierDetailsMap } from '@requests/common/aer/subtasks/verifier-details/verifier-details-subtask-list.map';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AerSubmittedReportComponent } from '@requests/common/timeline/components/aer-submitted-report';
import {
  AerOverallVerificationDecisionSummaryTemplateComponent,
  ComplianceMonitoringReportingSummaryTemplateComponent,
  DataGapsMethodologiesSummaryTemplateComponent,
  EtsComplianceRulesSummaryTemplateComponent,
  MaterialityLevelSummaryTemplateComponent,
  OpinionStatementSummaryTemplateComponent,
  RecommendedImprovementsSummaryTemplateComponent,
  UncorrectedMisstatementsSummaryTemplateComponent,
  UncorrectedNonCompliancesSummaryTemplateComponent,
  UncorrectedNonConformitiesSummaryTemplateComponent,
  VerifierDetailsSummaryTemplateComponent,
} from '@shared/components';
import { SubTaskListMap } from '@shared/types';
import { itemActionToTitleTransformer } from '@shared/utils';

interface ViewModel {
  title: string;
  creationDate: string;
  reportingYear: string;
  verifierDetails: AerVerifierDetails;
  verifierDetailsSubtaskMap: SubTaskListMap<unknown>;
  opinionStatement: AerOpinionStatement;
  totalEmissions: AerTotalEmissions;
  monitoringPlanVersion: AerMonitoringPlanVersion;
  monitoringPlanChanges: AerMonitoringPlanChanges;
  opinionStatementSubtaskMap: SubTaskListMap<unknown>;
  etsComplianceRules: AerEtsComplianceRules;
  etsComplianceRulesSubtaskMap: SubTaskListMap<unknown>;
  complianceMonitoringReporting: AerComplianceMonitoringReporting;
  complianceMonitoringReportingSubtaskMap: SubTaskListMap<unknown>;
  overallVerificationDecision: AerVerificationDecision;
  overallVerificationDecisionSubtaskMap: SubTaskListMap<unknown>;
  uncorrectedMisstatements: AerUncorrectedMisstatements;
  uncorrectedMisstatementsSubtaskMap: SubTaskListMap<unknown>;
  uncorrectedNonConformities: AerUncorrectedNonConformities;
  uncorrectedNonConformitiesSubtaskMap: SubTaskListMap<unknown>;
  uncorrectedNonCompliances: AerUncorrectedNonCompliances;
  uncorrectedNonCompliancesSubtaskMap: SubTaskListMap<unknown>;
  recommendedImprovements: AerRecommendedImprovements;
  recommendedImprovementsSubtaskMap: SubTaskListMap<unknown>;
  dataGapsMethodologies: AerDataGapsMethodologies;
  dataGapsMethodologiesSubtaskMap: SubTaskListMap<unknown>;
  materialityLevel: AerMaterialityLevel;
  materialityLevelSubtaskMap: SubTaskListMap<unknown>;
}

@Component({
  selector: 'mrtm-aer-verification-submitted-report',
  imports: [
    PageHeadingComponent,
    VerifierDetailsSummaryTemplateComponent,
    GovukDatePipe,
    OpinionStatementSummaryTemplateComponent,
    EtsComplianceRulesSummaryTemplateComponent,
    ComplianceMonitoringReportingSummaryTemplateComponent,
    AerOverallVerificationDecisionSummaryTemplateComponent,
    UncorrectedMisstatementsSummaryTemplateComponent,
    UncorrectedNonCompliancesSummaryTemplateComponent,
    UncorrectedNonConformitiesSummaryTemplateComponent,
    RecommendedImprovementsSummaryTemplateComponent,
    DataGapsMethodologiesSummaryTemplateComponent,
    MaterialityLevelSummaryTemplateComponent,
    AerSubmittedReportComponent,
  ],
  standalone: true,
  templateUrl: './aer-verification-submitted-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVerificationSubmittedReportComponent implements AfterViewInit {
  private readonly store = inject(RequestActionStore);
  private readonly requestActionReportService = inject(RequestActionReportService);

  readonly vm: Signal<ViewModel> = computed(() => {
    const requestActionDTO = this.store.select(requestActionQuery.selectAction)();
    const reportingYear = this.store.select(timelineCommonQuery.selectReportingYear)();
    const title = itemActionToTitleTransformer(requestActionDTO?.type, reportingYear, requestActionDTO?.submitter);
    const creationDate = requestActionDTO?.creationDate;

    // Verifier Details
    const verifierDetails = this.store.select(aerTimelineCommonQuery.selectVerifierDetails)();
    const verifierDetailsSubtaskMap = verifierDetailsMap;

    // Opinion Statement
    const opinionStatement = this.store.select(aerTimelineCommonQuery.selectOpinionStatement)();
    const totalEmissions = this.store.select(aerTimelineCommonQuery.selectTotalEmissions)();
    const monitoringPlanVersion = this.store.select(aerTimelineCommonQuery.selectMonitoringPlanVersion)();
    const monitoringPlanChanges = this.store.select(aerTimelineCommonQuery.selectMonitoringPlanChanges)();
    const opinionStatementSubtaskMap = opinionStatementMap;

    // ETS Compliance Rules
    const etsComplianceRules = this.store.select(aerTimelineCommonQuery.selectEtsComplianceRules)();
    const etsComplianceRulesSubtaskMap = etsComplianceRulesMap;

    // Compliance Monitoring
    const complianceMonitoringReporting = this.store.select(
      aerTimelineCommonQuery.selectComplianceMonitoringReporting,
    )();
    const complianceMonitoringReportingSubtaskMap = complianceMonitoringReportingMap;

    // Overall Decision
    const overallVerificationDecision = this.store.select(aerTimelineCommonQuery.selectOverallVerificationDecision)();
    const overallVerificationDecisionSubtaskMap = overallVerificationDecisionMap;

    // Uncorrected Misstatements
    const uncorrectedMisstatements = this.store.select(aerTimelineCommonQuery.selectUncorrectedMisstatements)();
    const uncorrectedMisstatementsSubtaskMap = uncorrectedMisstatementsMap;

    // Uncorrected NonConformities
    const uncorrectedNonConformities = this.store.select(aerTimelineCommonQuery.selectUncorrectedNonConformities)();
    const uncorrectedNonConformitiesSubtaskMap = uncorrectedNonConformitiesMap;

    // Uncorrected NonCompliances
    const uncorrectedNonCompliances = this.store.select(aerTimelineCommonQuery.selectUncorrectedNonCompliances)();
    const uncorrectedNonCompliancesSubtaskMap = uncorrectedNonCompliancesMap;

    // Recommended Improvements
    const recommendedImprovements = this.store.select(aerTimelineCommonQuery.selectRecommendedImprovements)();
    const recommendedImprovementsSubtaskMap = recommendedImprovementsMap;

    // Datagaps Methodologies
    const dataGapsMethodologies = this.store.select(aerTimelineCommonQuery.selectDataGapsMethodologies)();
    const dataGapsMethodologiesSubtaskMap = dataGapsMethodologiesMap;

    // Materiality Level
    const materialityLevel = this.store.select(aerTimelineCommonQuery.selectMaterialityLevel)();
    const materialityLevelSubtaskMap = materialityLevelMap;
    return {
      title,
      creationDate,
      reportingYear,
      verifierDetails,
      verifierDetailsSubtaskMap,
      opinionStatement,
      totalEmissions,
      monitoringPlanVersion,
      monitoringPlanChanges,
      opinionStatementSubtaskMap,
      etsComplianceRules,
      etsComplianceRulesSubtaskMap,
      complianceMonitoringReporting,
      complianceMonitoringReportingSubtaskMap,
      overallVerificationDecision,
      overallVerificationDecisionSubtaskMap,
      uncorrectedMisstatements,
      uncorrectedMisstatementsSubtaskMap,
      uncorrectedNonConformities,
      uncorrectedNonConformitiesSubtaskMap,
      uncorrectedNonCompliances,
      uncorrectedNonCompliancesSubtaskMap,
      recommendedImprovements,
      recommendedImprovementsSubtaskMap,
      dataGapsMethodologies,
      dataGapsMethodologiesSubtaskMap,
      materialityLevel,
      materialityLevelSubtaskMap,
    };
  });

  ngAfterViewInit(): void {
    const requestActionDTO = this.store.select(requestActionQuery.selectAction)();
    const fileName = itemActionToTitleTransformer(
      requestActionDTO?.type,
      getYearFromRequestId(requestActionDTO?.requestId),
      null,
    );
    setTimeout(() => {
      this.requestActionReportService.print(fileName);
    }, 500);
  }
}
