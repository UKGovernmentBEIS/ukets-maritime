package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
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
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceApplicationAmendsSubmitInitializerTest {

    @InjectMocks
    private EmpIssuanceApplicationAmendsSubmitInitializer initializer;

    @Test
    void initializePayload() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = mock(EmissionsMonitoringPlan.class);
        UUID uuid = UUID.randomUUID();
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
        reviewGroupDecisions.put(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpIssuanceReviewDecision.builder()
            .type(EmpReviewDecisionType.ACCEPTED)
            .details(ReviewDecisionDetails.builder().notes("notes").build())
            .build());
        reviewGroupDecisions.put(EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder()
            .type(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .details(ChangesRequiredDecisionDetails.builder().requiredChanges(List.of(
                ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(uuid)).build())).build())
            .build());

        String filename = "test";
        EmpIssuanceRequestPayload empIssuanceRequestPayload = EmpIssuanceRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .reviewAttachments(Map.of(uuid, filename))
            .reviewGroupDecisions(reviewGroupDecisions)
            .empSectionsCompleted(Map.of("section", "COMPLETED"))
            .build();
        Request request = Request.builder()
            .type(RequestType.builder().code(MrtmRequestType.EMP_ISSUANCE).build())
            .payload(empIssuanceRequestPayload)
            .build();

        RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertThat(requestTaskPayload).isInstanceOf(EmpIssuanceApplicationAmendsSubmitRequestTaskPayload.class);
        assertThat(requestTaskPayload.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMIT_PAYLOAD);
        assertThat(((EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload).getReviewAttachments()).hasSize(1);
        assertThat(((EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload)
            .getReviewGroupDecisions().get(EmpReviewGroup.ADDITIONAL_DOCUMENTS))
            .isEqualTo(reviewGroupDecisions.get(EmpReviewGroup.ADDITIONAL_DOCUMENTS));
        assertThat(((EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload).getReviewAttachments())
            .containsExactlyInAnyOrderEntriesOf(Map.of(uuid, filename));
        assertThat(((EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTaskPayload)
            .getEmpSectionsCompleted()).isEmpty();
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactly(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMIT);
    }
}