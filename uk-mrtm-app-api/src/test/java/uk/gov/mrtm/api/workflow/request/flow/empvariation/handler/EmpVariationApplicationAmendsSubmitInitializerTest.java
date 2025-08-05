package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class EmpVariationApplicationAmendsSubmitInitializerTest {

    @InjectMocks
    private EmpVariationApplicationAmendsSubmitInitializer initializer;

    @Test
    void initializePayload() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName("name")
                        .build())
                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .build();

        UUID uuid = UUID.randomUUID();
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        reviewGroupDecisions.put(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.REJECTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .build());
        reviewGroupDecisions.put(EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().requiredChanges(List.of(
                        ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(uuid)).build())).build())
                .build());

        String reason = "reason";
        EmpVariationReviewDecision detailsReviewDecision = EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().requiredChanges(List.of(
                        ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(uuid)).build())).build())
                .build();
        EmpVariationRequestPayload empVariationRequestPayload = EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empVariationDetails(EmpVariationDetails.builder().reason(reason).build())
                .empVariationDetailsReviewDecision(detailsReviewDecision)
                .reviewAttachments(Map.of(uuid, "test"))
                .reviewGroupDecisions(reviewGroupDecisions)
                .empSectionsCompleted(Map.of("section", "COMPLETED"))
                .build();
        Request request = Request.builder()
                .type(RequestType.builder().resourceType(MrtmRequestType.EMP_VARIATION).build())
                .payload(empVariationRequestPayload)
                .build();

        RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertThat(requestTaskPayload).isInstanceOf(EmpVariationApplicationAmendsSubmitRequestTaskPayload.class);
        assertThat(requestTaskPayload.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_AMENDS_SUBMIT_PAYLOAD);
        assertThat(((EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload).getEmpVariationDetailsReviewDecision()).isEqualTo(detailsReviewDecision);
        assertThat(((EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload).getEmpVariationDetails().getReason()).isEqualTo(reason);
        assertThat(((EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload).getReviewAttachments()).hasSize(1);
        assertThat(((EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload).getReviewGroupDecisions()).hasSize(1);
        assertThat(((EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload).getEmpSectionsCompleted()).isEmpty();
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactly(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_AMENDS_SUBMIT);
    }
}
