package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmNotificationTemplateWorkflowTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationFollowUpSendReminderNotificationService;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationFollowUpSendReminderNotificationServiceTest {

    @InjectMocks
    private EmpNotificationFollowUpSendReminderNotificationService service;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Mock
    private RequestExpirationReminderService requestExpirationReminderService;

    @BeforeEach
    void setUp() {
        new MrtmNotificationTemplateWorkflowTaskType();
    }

    @Test
    void sendFirstReminderNotification() {

        final String requestId = "1";
        final Date deadline = new Date();
        final Request request = Request.builder().build();
        final UserInfoDTO primaryContact =
                UserInfoDTO.builder().firstName("fn").lastName("ln").email("email@email").build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(primaryContact));

        service.sendFirstReminderNotification(requestId, deadline);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1))
                .getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1)).sendExpirationReminderNotification(requestId,
                NotificationTemplateExpirationReminderParams
                        .builder()
                        .workflowTask(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP))
                        .recipient(primaryContact)
                        .expirationTime(ExpirationReminderType.FIRST_REMINDER.getDescription())
                        .expirationTimeLong(ExpirationReminderType.FIRST_REMINDER.getDescriptionLong())
                        .deadline(deadline)
                        .build()
        );
    }

    @Test
    void sendSecondReminderNotification() {

        final String requestId = "1";
        final Date deadline = new Date();
        final Request request = Request.builder().build();
        final UserInfoDTO primaryContact =
                UserInfoDTO.builder().firstName("fn").lastName("ln").email("email@email").build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(primaryContact));

        service.sendSecondReminderNotification(requestId, deadline);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1))
                .getRequestAccountPrimaryContact(request);
        verify(requestExpirationReminderService, times(1)).sendExpirationReminderNotification(requestId,
                NotificationTemplateExpirationReminderParams
                        .builder()
                        .workflowTask(NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestTaskType.EMP_NOTIFICATION_FOLLOW_UP))
                        .recipient(primaryContact)
                        .expirationTime(ExpirationReminderType.SECOND_REMINDER.getDescription())
                        .expirationTimeLong(ExpirationReminderType.SECOND_REMINDER.getDescriptionLong())
                        .deadline(deadline)
                        .build()
        );
    }

    @Test
    void sendSecondReminderNotification_throws_exc_when_primary_contact_is_not_found() {

        final String requestId = "1";
        final Date deadline = new Date();
        final Request request = Request.builder().build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
            .thenReturn(Optional.empty());

        BusinessException be = assertThrows(BusinessException.class,
            () ->service.sendSecondReminderNotification(requestId, deadline));

        assertEquals(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND, be.getErrorCode());


        verify(requestService).findRequestById(requestId);
        verify(requestAccountContactQueryService).getRequestAccountPrimaryContact(request);
        verifyNoMoreInteractions(requestService, requestAccountContactQueryService);
        verifyNoInteractions(requestExpirationReminderService);
    }
}
