package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpVariationWaitForReviewInitializerTest {

    @InjectMocks
    private EmpVariationWaitForReviewInitializer initializer;

    @Test
    void initializePayload() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder().build();
        EmpVariationRequestPayload empVariationRequestPayload = EmpVariationRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();
        Request request = Request.builder()
            .id("1").requestResources(List.of(RequestResource.builder().resourceId(String.valueOf("1")).resourceType(ResourceType.ACCOUNT).build()))
            .payload(empVariationRequestPayload)
            .build();

        RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertThat(requestTaskPayload.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.EMP_VARIATION_WAIT_FOR_REVIEW_PAYLOAD);
        assertThat(requestTaskPayload).isInstanceOf(EmpVariationApplicationSubmitRequestTaskPayload.class);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactly(MrtmRequestTaskType.EMP_VARIATION_WAIT_FOR_REVIEW);
    }
}