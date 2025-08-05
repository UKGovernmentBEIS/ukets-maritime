package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmNotificationTemplateWorkflowTaskType;
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

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirSendReminderNotificationServiceTest {

    @InjectMocks
    private VirSendReminderNotificationService service;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Mock
    private RequestExpirationReminderService requestExpirationReminderService;

    @BeforeAll
    static void setUp() {
        new MrtmNotificationTemplateWorkflowTaskType();
    }

    @Test
    void sendFirstReminderNotification() {
        final String requestId = "AEM-001";
        final Date deadline = new Date();
        final Request request = Request.builder().id(requestId).build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().userId("userId").build();

        final NotificationTemplateExpirationReminderParams params = NotificationTemplateExpirationReminderParams.builder()
                .workflowTask(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.VIR))
                .recipient(accountPrimaryContact)
                .expirationTime(ExpirationReminderType.FIRST_REMINDER.getDescription())
                .expirationTimeLong(ExpirationReminderType.FIRST_REMINDER.getDescriptionLong())
                .deadline(deadline)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
            .thenReturn(Optional.of(accountPrimaryContact));

        // Invoke
        service.sendFirstReminderNotification(requestId, deadline);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1))
                .getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1))
                .sendExpirationReminderNotification(requestId, params);
    }

    @Test
    void sendSecondReminderNotification() {
        final String requestId = "AEM-001";
        final Date deadline = new Date();
        final Request request = Request.builder().id(requestId).build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().userId("userId").build();

        final NotificationTemplateExpirationReminderParams params = NotificationTemplateExpirationReminderParams.builder()
                .workflowTask(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.VIR))
                .recipient(accountPrimaryContact)
                .expirationTime(ExpirationReminderType.SECOND_REMINDER.getDescription())
                .expirationTimeLong(ExpirationReminderType.SECOND_REMINDER.getDescriptionLong())
                .deadline(deadline)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
            .thenReturn(Optional.of(accountPrimaryContact));
        // Invoke
        service.sendSecondReminderNotification(requestId, deadline);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1))
                .getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1))
                .sendExpirationReminderNotification(requestId, params);
    }

    @Test
    void sendRespondFirstReminderNotification() {
        final String requestId = "AEM-001";
        final Date deadline = new Date();
        final Request request = Request.builder().id(requestId).build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().userId("userId").build();

        final NotificationTemplateExpirationReminderParams params = NotificationTemplateExpirationReminderParams.builder()
                .workflowTask(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS))
                .recipient(accountPrimaryContact)
                .expirationTime(ExpirationReminderType.FIRST_REMINDER.getDescription())
                .expirationTimeLong(ExpirationReminderType.FIRST_REMINDER.getDescriptionLong())
                .deadline(deadline)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(accountPrimaryContact));
        // Invoke
        service.sendRespondFirstReminderNotification(requestId, deadline);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1))
                .getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1))
                .sendExpirationReminderNotification(requestId, params);
    }

    @Test
    void sendRespondSecondReminderNotification() {
        final String requestId = "AEM-001";
        final Date deadline = new Date();
        final Request request = Request.builder().id(requestId).build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().userId("userId").build();

        final NotificationTemplateExpirationReminderParams params = NotificationTemplateExpirationReminderParams.builder()
                .workflowTask(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS))
                .recipient(accountPrimaryContact)
                .expirationTime(ExpirationReminderType.SECOND_REMINDER.getDescription())
                .expirationTimeLong(ExpirationReminderType.SECOND_REMINDER.getDescriptionLong())
                .deadline(deadline)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(accountPrimaryContact));

        // Invoke
        service.sendRespondSecondReminderNotification(requestId, deadline);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1))
                .getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1))
                .sendExpirationReminderNotification(requestId, params);
    }
}
