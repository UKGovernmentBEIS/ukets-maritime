package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.ExpirationReminderType;
import uk.gov.netz.api.workflow.request.flow.common.constants.NotificationTemplateWorkflowTaskType;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestExpirationReminderService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.NotificationTemplateExpirationReminderParams;

import java.util.Date;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class AerSendReminderNotificationService {

    private final RequestService requestService;
    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final RequestExpirationReminderService requestExpirationReminderService;

    public void sendFirstReminderNotification(final String requestId, final Date deadline) {
        sendReminderNotification(requestId, deadline, ExpirationReminderType.FIRST_REMINDER);
    }

    public void sendSecondReminderNotification(final String requestId, final Date deadline) {
        sendReminderNotification(requestId, deadline, ExpirationReminderType.SECOND_REMINDER);
    }

    private void sendReminderNotification(final String requestId, final Date deadline,
                                          final ExpirationReminderType expirationType) {

        final Request request = requestService.findRequestById(requestId);
        final Optional<UserInfoDTO> accountPrimaryContact =
            requestAccountContactQueryService.getRequestAccountPrimaryContact(request);

        if (accountPrimaryContact.isEmpty()) {
            log.warn("Skipping AER reminder notification: primary contact not found "
                    + "[requestId='{}', accountId={}, reminderType={}]",
                requestId, request.getAccountId(), expirationType);
            return;
        }

        requestExpirationReminderService.sendExpirationReminderNotification(requestId,
            NotificationTemplateExpirationReminderParams.builder()
                .workflowTask(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.AER))
                .recipient(accountPrimaryContact.get())
                .expirationTime(expirationType.getDescription())
                .expirationTimeLong(expirationType.getDescriptionLong())
                .deadline(deadline)
                .build());
    }
}
