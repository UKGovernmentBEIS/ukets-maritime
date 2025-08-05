package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType.VIR;

@ExtendWith(MockitoExtension.class)
class VirApplicationSubmitInitializerTest {

    @InjectMocks
    private VirApplicationSubmitInitializer initializer;

    @Test
    void initializePayload() {

        final VirVerificationData virVerificationData = VirVerificationData.builder()
            .uncorrectedNonConformities(Map.of(
                "A1",
                UncorrectedItem.builder()
                    .explanation("Explanation")
                    .reference("A1")
                    .materialEffect(true)
                    .build()))
            .build();
        final Request request = Request.builder()
            .type(RequestType.builder().code(VIR).build())
            .payload(VirRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.VIR_REQUEST_PAYLOAD)
                .verificationData(virVerificationData)
                .build())
            .build();

        final VirApplicationSubmitRequestTaskPayload expected =
            VirApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.VIR_APPLICATION_SUBMIT_PAYLOAD)
                .verificationData(virVerificationData)
                .build();

        // Invoke
        final RequestTaskPayload actual = initializer.initializePayload(request);

        // Verify
        assertThat(actual).isInstanceOf(VirApplicationSubmitRequestTaskPayload.class).isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
            .containsExactly(MrtmRequestTaskType.VIR_APPLICATION_SUBMIT);
    }
}
