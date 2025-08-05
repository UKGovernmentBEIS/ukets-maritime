package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class VirDeadlineService {

    private final RequestService requestService;
    private final VirRespondToRegulatorCommentsNotificationService virRespondToRegulatorCommentsNotificationService;

    public void sendDeadlineNotification(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        virRespondToRegulatorCommentsNotificationService.sendDeadlineResponseToRegulatorCommentsNotificationToRegulator(request);
    }
}
