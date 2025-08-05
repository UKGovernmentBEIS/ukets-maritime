package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper.EmpNotificationMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
public class EmpNotificationApplicationPeerReviewInitializer implements InitializeRequestTaskHandler {

    private static final EmpNotificationMapper empNotificationMapper = Mappers.getMapper(EmpNotificationMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        return empNotificationMapper.toApplicationReviewRequestTaskPayload(
                (EmpNotificationRequestPayload) request.getPayload(),
                MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEW_PAYLOAD
        );
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEW);
    }
}
