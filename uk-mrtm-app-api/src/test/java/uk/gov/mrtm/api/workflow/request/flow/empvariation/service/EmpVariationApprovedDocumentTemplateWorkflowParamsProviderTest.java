package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpVariationApprovedDocumentTemplateWorkflowParamsProviderTest {

    @InjectMocks
    private EmpVariationApprovedDocumentTemplateWorkflowParamsProvider provider;

    @Test
    void getContextActionType() {
        assertThat(provider.getContextActionType()).isEqualTo(
                MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_ACCEPTED);
    }

    @Test
    void constructParams() {
        EmpVariationRequestPayload payload = EmpVariationRequestPayload.builder()
                .empConsolidationNumber(5)
                .determination(EmpVariationDetermination.builder()
                        .type(EmpVariationDeterminationType.APPROVED)
                        .reason("Reason")
                        .build())
                .empVariationDetailsReviewDecision(EmpVariationReviewDecision.builder()
                        .details(EmpAcceptedVariationDecisionDetails.builder()
                                .variationScheduleItems(List.of("sch_var_details_1", "sch_var_details_2"))
                                .notes("notes")
                                .build())
                        .build())
                .reviewGroupDecisions(Map.of(
                        EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision.builder()
                                .type(EmpVariationReviewDecisionType.ACCEPTED)
                                .details(EmpAcceptedVariationDecisionDetails.builder()
                                        .variationScheduleItems(List.of("sch_abbr_1", "sch_abbr_2")).build()).build(),
                        EmpReviewGroup.MARITIME_OPERATOR_DETAILS, EmpVariationReviewDecision.builder()
                                .type(EmpVariationReviewDecisionType.ACCEPTED)
                                .details(EmpAcceptedVariationDecisionDetails.builder()
                                        .variationScheduleItems(List.of("sch_op_details_1")).build()).build(),
                        EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpVariationReviewDecision.builder()
                                .type(EmpVariationReviewDecisionType.REJECTED)
                                .details(ReviewDecisionDetails.builder().notes("notes").build()).build()
                ))
                .build();
//        String requestId = "1";

        Map<String, Object> result = provider.constructParams(payload);

        assertThat(result).containsExactlyInAnyOrderEntriesOf(Map.of(
                "empConsolidationNumber", 5,
                "variationScheduleItems", List.of("sch_var_details_1", "sch_var_details_2",
                        "sch_op_details_1",
                        "sch_abbr_1", "sch_abbr_2")
        ));
    }
}
