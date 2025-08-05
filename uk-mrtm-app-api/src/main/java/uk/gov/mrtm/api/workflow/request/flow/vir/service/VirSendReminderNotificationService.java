package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.ExpirationReminderType;
import uk.gov.netz.api.workflow.request.flow.common.constants.NotificationTemplateWorkflowTaskType;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationReminderService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.NotificationTemplateExpirationReminderParams;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class VirSendReminderNotificationService {

    private final RequestService requestService;
    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final RequestExpirationReminderService requestExpirationReminderService;

    public void sendFirstReminderNotification(final String requestId, final Date deadline) {
        sendReminderNotification(requestId, deadline, ExpirationReminderType.FIRST_REMINDER,
                NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.VIR));
    }

    public void sendSecondReminderNotification(final String requestId, final Date deadline) {
        sendReminderNotification(requestId, deadline, ExpirationReminderType.SECOND_REMINDER,
                NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.VIR));
    }

    public void sendRespondFirstReminderNotification(final String requestId, final Date deadline) {
        sendReminderNotification(requestId, deadline, ExpirationReminderType.FIRST_REMINDER,
                NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS));
    }

    public void sendRespondSecondReminderNotification(final String requestId, final Date deadline) {
        sendReminderNotification(requestId, deadline, ExpirationReminderType.SECOND_REMINDER,
                NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS));
    }

    private void sendReminderNotification(final String requestId, final Date deadline, final ExpirationReminderType expirationType,
                                          final String workflowTaskType) {

        final Request request = requestService.findRequestById(requestId);
        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));

        requestExpirationReminderService.sendExpirationReminderNotification(requestId,
                NotificationTemplateExpirationReminderParams.builder()
                        .workflowTask(workflowTaskType)
                        .recipient(accountPrimaryContact)
                        .expirationTime(expirationType.getDescription())
                        .expirationTimeLong(expirationType.getDescriptionLong())
                        .deadline(deadline)
                        .build());
    }
}
