package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceApplicationPeerReviewInitializerTest {

    @InjectMocks
    private EmpIssuanceApplicationPeerReviewInitializer initializer;

    @Test
    void initializePayload() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .operatorDetails(EmpOperatorDetails.builder()
                .operatorName("name")
                .build())
            .build();
        EmpIssuanceRequestPayload empIssuanceRequestPayload = EmpIssuanceRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();
        Request request = Request.builder()
            .id("1").requestResources(List.of(RequestResource.builder().resourceId("1").resourceType(ResourceType.ACCOUNT).build()))
            .payload(empIssuanceRequestPayload)
            .build();

        RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertThat(requestTaskPayload.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW_PAYLOAD);
        assertThat(requestTaskPayload).isInstanceOf(EmpIssuanceApplicationReviewRequestTaskPayload.class);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactly(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW);
    }

    @Test
    void getRequestTaskPayloadType() {
        assertEquals(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW_PAYLOAD, initializer.getRequestTaskPayloadType());
    }
}