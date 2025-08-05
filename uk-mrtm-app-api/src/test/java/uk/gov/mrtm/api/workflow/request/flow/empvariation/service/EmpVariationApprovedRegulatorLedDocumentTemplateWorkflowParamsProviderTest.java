package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpVariationApprovedRegulatorLedDocumentTemplateWorkflowParamsProviderTest {

    @InjectMocks
    private EmpVariationApprovedRegulatorLedDocumentTemplateWorkflowParamsProvider provider;

    @Test
    void getContextActionType() {
        assertThat(provider.getContextActionType()).isEqualTo(
            MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_REGULATOR_LED_APPROVED);
    }

    @ParameterizedTest
    @MethodSource("regulatorReasonType")
    void constructParams(EmpVariationRegulatorLedReasonType type, String reasonOtherSummary, String expectedReason) {
        EmpVariationRequestPayload payload = EmpVariationRequestPayload.builder()
            .empConsolidationNumber(5)
            .reasonRegulatorLed(EmpVariationRegulatorLedReason.builder().type(type).reasonOtherSummary(reasonOtherSummary).build())
            .reviewGroupDecisionsRegulatorLed(Map.of(
                EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
                EmpAcceptedVariationDecisionDetails.builder().variationScheduleItems(List.of("1", "2")).build(),
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                EmpAcceptedVariationDecisionDetails.builder().variationScheduleItems(List.of("3", "4")).build()
            ))
            .build();
        Map<String, Object> result = provider.constructParams(payload);

        assertThat(result).containsExactlyInAnyOrderEntriesOf(Map.of(
            "empConsolidationNumber", 5,
            "reason", expectedReason,
            "variationScheduleItems", List.of("1", "2", "3", "4")
        ));
    }


    private static Stream<Arguments> regulatorReasonType() {
        return Stream.of(
            Arguments.of(EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT, null,
                EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT.getDescription()),
            Arguments.of(EmpVariationRegulatorLedReasonType.FAILED_TO_COMPLY_OR_APPLY, null,
                EmpVariationRegulatorLedReasonType.FAILED_TO_COMPLY_OR_APPLY.getDescription()),
            Arguments.of(EmpVariationRegulatorLedReasonType.OTHER, "other reason",
                "The Environment Agency has varied your emissions monitoring plan other reason")
        );
    }
}