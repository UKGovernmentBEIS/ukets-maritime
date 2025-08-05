package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class EmpNotificationSubmitInitializer implements InitializeRequestTaskHandler {

	@Override
    public RequestTaskPayload initializePayload(Request request) {

        return EmpNotificationApplicationSubmitRequestTaskPayload
        		.builder()
        		.payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMIT_PAYLOAD)
        		.build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_SUBMIT);
    }
}
