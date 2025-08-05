package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class NonComplianceNoticeOfIntentInitializerTest {

    @InjectMocks
    private NonComplianceNoticeOfIntentInitializer initializer;

    @Test
    void initializePayload() {

        final UUID noticeOfIntent = UUID.randomUUID();
        final Request request = Request.builder().payload(NonComplianceRequestPayload.builder()
            .noticeOfIntent(noticeOfIntent).build()).build();

        final RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertEquals(requestTaskPayload, NonComplianceNoticeOfIntentRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_NOTICE_OF_INTENT_PAYLOAD)
            .noticeOfIntent(noticeOfIntent)
            .build());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
            .containsExactlyInAnyOrder(MrtmRequestTaskType.NON_COMPLIANCE_NOTICE_OF_INTENT);
    }
}
