package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.application.taskview.RequestInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceApplicationSubmitInitializerTest {

    @InjectMocks
    private NonComplianceApplicationSubmitInitializer initializer;

    @Mock
    private RequestQueryService requestQueryService;

    @Test
    void initializePayload() {
        final Long accountId = 1L;
        final Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder().resourceId(accountId.toString()).resourceType(ResourceType.ACCOUNT).build()))
            .build();

        final List<RequestInfoDTO> availableRequests = List.of(
                RequestInfoDTO.builder().id("req1").type("type1").build(),
                RequestInfoDTO.builder().id("req2").type("type2").build());

        when(requestQueryService.findByResourceTypeAndResourceIdAndTypeNotIn(List.of(MrtmRequestType.NON_COMPLIANCE), ResourceType.ACCOUNT, accountId.toString()))
            .thenReturn(availableRequests);

        final RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertEquals(requestTaskPayload, NonComplianceApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_APPLICATION_SUBMIT_PAYLOAD)
            .availableRequests(availableRequests)
            .build());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
            .containsExactlyInAnyOrder(MrtmRequestTaskType.NON_COMPLIANCE_APPLICATION_SUBMIT);
    }

}
