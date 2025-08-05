package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class EmpVariationAmendSubmitMapperTest {

    private final EmpVariationAmendSubmitMapper empVariationAmendSubmitMapper = Mappers.getMapper(EmpVariationAmendSubmitMapper.class);

    @Test
    void toEmpVariationApplicationReturnedForAmendsRequestActionPayload() {
        final UUID attachment1 = UUID.randomUUID();
        final UUID attachment2 = UUID.randomUUID();
        final UUID attachment3 = UUID.randomUUID();
        String returnedForAmendsPayloadType = MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_RETURNED_FOR_AMENDS_PAYLOAD;
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = buildReviewGroupDecisions(attachment1);
        Map<EmpReviewGroup, EmpVariationReviewDecision> expectedReviewGroupDecisions = Map.of(
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision
                        .builder()
                        .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                        .details(ChangesRequiredDecisionDetails.builder()
                                .requiredChanges(
                                        List.of(
                                                ReviewDecisionRequiredChange.builder()
                                                        .reason("reason")
                                                        .files(Set.of(attachment1))
                                                        .build()
                                        )
                                )
                                .build()
                        )
                        .build());
        final EmpVariationApplicationReviewRequestTaskPayload taskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_REVIEW_PAYLOAD)
                        .emissionsMonitoringPlan(buildEmp())
                        .empVariationDetailsReviewDecision(EmpVariationReviewDecision.builder()
                                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                                .details(ChangesRequiredDecisionDetails.builder()
                                        .requiredChanges(
                                                List.of(
                                                        ReviewDecisionRequiredChange.builder()
                                                                .reason("reason")
                                                                .files(Set.of(attachment2))
                                                                .build()
                                                )
                                        )
                                        .notes("notes")
                                        .build()
                                )
                                .build())
                        .empAttachments(Map.of(attachment3, "att3"))
                        .reviewAttachments(Map.of(attachment1, "att1", attachment2, "att2"))
                        .empSectionsCompleted(Map.of("section1", "true"))
                        .reviewGroupDecisions(reviewGroupDecisions)
                        .build();

        final EmpVariationApplicationReturnedForAmendsRequestActionPayload result =
                empVariationAmendSubmitMapper.toEmpVariationApplicationReturnedForAmendsRequestActionPayload(taskPayload, returnedForAmendsPayloadType);

        assertThat(result.getPayloadType()).isEqualTo(returnedForAmendsPayloadType);
        assertThat(result.getReviewGroupDecisions()).isEqualTo(expectedReviewGroupDecisions);
        assertThat(result.getReviewAttachments().keySet()).containsExactlyInAnyOrder(attachment1, attachment2);
    }

    @Test
    void toEmpVariationApplicationAmendsSubmitRequestTaskPayload() {

        final UUID attachment1 = UUID.randomUUID();
        String amendsSubmitPayloadType = MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_AMENDS_SUBMIT_PAYLOAD;
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = buildReviewGroupDecisions(attachment1);
        EmissionsMonitoringPlan emissionsMonitoringPlan = buildEmp();

        EmpVariationReviewDecision empVariationDetailsReviewDecision = EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder()
                        .notes("notes")
                        .requiredChanges(List.of(
                                ReviewDecisionRequiredChange.builder().reason("reason1").files(Set.of(attachment1)).build()
                        ))
                        .build())
                .build();

        final EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empAttachments(Map.of(attachment1, "att1"))
                .empSectionsCompleted(Map.of("section1", "true"))
                .reviewGroupDecisions(reviewGroupDecisions)
                .empVariationDetails(EmpVariationDetails.builder().reason("reason").build())
                .empVariationDetailsCompleted("true")
                .reviewAttachments(Map.of(attachment1, "attachment1"))
                .empVariationDetailsReviewDecision(empVariationDetailsReviewDecision)
                .build();
        Map<EmpReviewGroup, EmpVariationReviewDecision> expectedReviewGroupDecisions = Map.of(
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision
                        .builder()
                        .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                        .details(ChangesRequiredDecisionDetails.builder()
                                .requiredChanges(
                                        List.of(
                                                ReviewDecisionRequiredChange.builder()
                                                        .reason("reason")
                                                        .files(Set.of(attachment1))
                                                        .build()
                                        )
                                )
                                .build()
                        )
                        .build());

        final EmpVariationApplicationAmendsSubmitRequestTaskPayload result =
                empVariationAmendSubmitMapper.toEmpVariationApplicationAmendsSubmitRequestTaskPayload(
                        requestPayload, amendsSubmitPayloadType);

        assertThat(result.getPayloadType()).isEqualTo(amendsSubmitPayloadType);
        assertThat(result.getReviewGroupDecisions()).isEqualTo(expectedReviewGroupDecisions);
        assertThat(result.getReviewAttachments()).isEqualTo(Map.of(attachment1, "attachment1"));
        assertThat(result.getEmpVariationDetails()).isEqualTo(requestPayload.getEmpVariationDetails());
        assertThat(result.getEmpAttachments()).isEqualTo(requestPayload.getEmpAttachments());
        assertThat(result.getEmpSectionsCompleted()).isEmpty();
        assertThat(result.getEmpVariationDetailsCompleted()).isEqualTo(requestPayload.getEmpVariationDetailsCompleted());
        assertThat(result.getEmpVariationDetailsReviewDecision()).isEqualTo(EmpVariationReviewDecision.builder()
                .type(empVariationDetailsReviewDecision.getType())
                .details(ChangesRequiredDecisionDetails.builder()
                        .requiredChanges(((ChangesRequiredDecisionDetails) empVariationDetailsReviewDecision.getDetails()).getRequiredChanges()).build())
                .build());
    }

    private EmissionsMonitoringPlan buildEmp() {
        return EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName("empOperatorDetailsOperatorName")
                        .build())
                .build();
    }

    private Map<EmpReviewGroup, EmpVariationReviewDecision> buildReviewGroupDecisions(UUID attachment) {
        return Map.of(
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision
                        .builder()
                        .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                        .details(ChangesRequiredDecisionDetails.builder()
                                .requiredChanges(
                                        List.of(
                                                ReviewDecisionRequiredChange.builder()
                                                        .reason("reason")
                                                        .files(Set.of(attachment))
                                                        .build()
                                        )
                                )
                                .notes("notes")
                                .build()
                        )
                        .build(),
                EmpReviewGroup.MONITORING_APPROACH, EmpVariationReviewDecision.builder().type(EmpVariationReviewDecisionType.ACCEPTED).build()
        );
    }
}
