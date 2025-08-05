package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import static org.assertj.core.api.Assertions.assertThat;
@ExtendWith(MockitoExtension.class)
class DoeApplicationSubmitInitializerTest {

    @InjectMocks
    private DoeApplicationSubmitInitializer handler;

    @Test
    void initializePayload_new() {
        DoeRequestPayload requestPayload = DoeRequestPayload.builder().build();
        Request request = Request.builder().payload(requestPayload).build();

        RequestTaskPayload result = handler.initializePayload(request);

        assertThat(result.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD);
        assertThat(result).isInstanceOf(DoeApplicationSubmitRequestTaskPayload.class);
        assertThat(result).isEqualTo(DoeApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD).build());
    }

    @Test
    void initializePayload_existing_Request_payload() {
        Doe doe = Doe.builder()
                .build();
        DoeRequestPayload requestPayload = DoeRequestPayload.builder()
                .doe(doe)
                .build();
        Request request = Request.builder().payload(requestPayload).build();

        RequestTaskPayload result = handler.initializePayload(request);

        assertThat(result.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD);
        assertThat(result).isInstanceOf(DoeApplicationSubmitRequestTaskPayload.class);
        assertThat(result).isEqualTo(DoeApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD).doe(doe).build());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactlyInAnyOrder(
                MrtmRequestTaskType.DOE_APPLICATION_SUBMIT);
    }
}
