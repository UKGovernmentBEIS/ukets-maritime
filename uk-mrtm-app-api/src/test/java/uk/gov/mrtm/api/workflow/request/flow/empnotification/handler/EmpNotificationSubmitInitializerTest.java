package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpNotificationSubmitInitializerTest {

    @InjectMocks
    private EmpNotificationSubmitInitializer empNotificationSubmitInitializer;

    @Test
    void initializePayload() {
        Request request = Request.builder().build();
        EmpNotificationApplicationSubmitRequestTaskPayload expected = EmpNotificationApplicationSubmitRequestTaskPayload
            .builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMIT_PAYLOAD)
            .build();

        RequestTaskPayload actual = empNotificationSubmitInitializer.initializePayload(request);

        assertEquals(expected, actual);
    }


    @Test
    void getRequestTaskTypes() {
        assertEquals(Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_SUBMIT),
            empNotificationSubmitInitializer.getRequestTaskTypes());
    }
}