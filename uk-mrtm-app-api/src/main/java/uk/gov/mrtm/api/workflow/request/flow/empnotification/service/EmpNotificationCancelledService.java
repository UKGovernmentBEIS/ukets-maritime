package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class EmpNotificationCancelledService {

    private final RequestService requestService;

    public void cancel(final String requestId) {
        final Request request = requestService.findRequestById(requestId);

        requestService.addActionToRequest(request, null,
                MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_CANCELLED,
                request.getPayload().getOperatorAssignee());
    }
}
