package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class EmpVariationSubmitRegulatorLedServiceTest {

    @InjectMocks
    private EmpVariationSubmitRegulatorLedService cut;

    @Test
    void saveEmpVariation() {

        EmpVariationRegulatorLedReason reason = EmpVariationRegulatorLedReason.builder()
                .type(EmpVariationRegulatorLedReasonType.FAILED_TO_COMPLY_OR_APPLY)
                .reasonOtherSummary("Some reason")
                .build();

        EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload taskActionPayload = EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload.builder()
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .abbreviations(EmpAbbreviations.builder()
                                .exist(true)
                                .build())
                        .build())
                .empSectionsCompleted(Map.of("ABBREV", "false"))
                .empVariationDetails(EmpVariationDetails.builder()
                        .reason("reason")
                        .build())
                .empVariationDetailsCompleted("true")
                .reasonRegulatorLed(reason)
                .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                        .build())
                .build();

        cut.saveEmpVariation(taskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isEqualTo(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                .emissionsMonitoringPlan(taskActionPayload.getEmissionsMonitoringPlan())
                .empSectionsCompleted(taskActionPayload.getEmpSectionsCompleted())
                .empVariationDetails(taskActionPayload.getEmpVariationDetails())
                .empVariationDetailsCompleted(taskActionPayload.getEmpVariationDetailsCompleted())
                .reasonRegulatorLed(taskActionPayload.getReasonRegulatorLed())
                .build());
    }

    @Test
    void saveReviewGroupDecision() {

        EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload requestTaskActionPayload =
                EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload.builder()
                        .decision(EmpAcceptedVariationDecisionDetails.builder()
                                .notes("notes2")
                                .variationScheduleItems(List.of("var1", "var2"))
                                .build())
                        .group(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS)
                        .empSectionsCompleted(Map.of("ABBR", "completed"))
                        .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                        .reviewGroupDecisions(new HashMap<>(Map.of(
                                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder()
                                        .notes("notes1")
                                        .variationScheduleItems(List.of("var1"))
                                        .build(),

                                EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpAcceptedVariationDecisionDetails.builder()
                                        .notes("notes")
                                        .build()
                        )))
                        .build())
                .build();

        cut.saveReviewGroupDecision(requestTaskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isEqualTo(
                EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                        .empSectionsCompleted(Map.of("ABBR", "completed"))
                        .reviewGroupDecisions(Map.of(
                                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder()
                                        .notes("notes2")
                                        .variationScheduleItems(List.of("var1", "var2"))
                                        .build(),
                                EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpAcceptedVariationDecisionDetails.builder()
                                        .notes("notes")
                                        .build()
                        ))
                        .build());
    }
}
