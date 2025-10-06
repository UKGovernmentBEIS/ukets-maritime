package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmNotificationTemplateWorkflowTaskType;
import uk.gov.netz.api.account.domain.dto.AccountInfoDTO;
import uk.gov.netz.api.account.service.AccountQueryService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.constants.NotificationTemplateWorkflowTaskType;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerSubmissionWindowReminderDateReachedHandlerFlowableTest {

    @InjectMocks
    private AerSubmissionWindowReminderDateReachedHandlerFlowable handler;

    @Mock
    private RequestService requestService;
    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;
    @Mock
    private AccountQueryService accountQueryService;
    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @Test
    void test() throws Exception {
        new MrtmNotificationTemplateWorkflowTaskType();

        String requestId = "1";
        long accountId = 2L;
        String name = "name";
        String businessId = "businessId";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        AccountInfoDTO account = AccountInfoDTO.builder().businessId(businessId).name(name).build();
        String userEmail = "userEmail";
        UserInfoDTO userInfoDTO = UserInfoDTO.builder().email(userEmail).firstName("a").lastName("b").build();
        String description = "description";
        Year year = Year.now();
        Request request = Request.builder()
            .type(RequestType.builder().description(description).build())
            .metadata(AerRequestMetadata.builder().year(year).build())
            .requestResources(List.of(
                RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build(),
                RequestResource.builder().resourceId(competentAuthority.name()).resourceType(ResourceType.CA).build()))
            .build();

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(NotificationTemplateConstants.WORKFLOW, description);
        templateParams.put(NotificationTemplateConstants.WORKFLOW_TASK, NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.AER));
        templateParams.put(NotificationTemplateConstants.WORKFLOW_EXPIRATION_TIME, "3 months");
        templateParams.put(NotificationTemplateConstants.WORKFLOW_USER, userInfoDTO.getFullName());
        templateParams.put(NotificationTemplateConstants.ACCOUNT_NAME, name);
        templateParams.put(NotificationTemplateConstants.ACCOUNT_BUSINESS_ID, businessId);
        templateParams.put(MrtmEmailNotificationTemplateConstants.AER_YEAR, year);


        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .competentAuthority(request.getCompetentAuthority())
                .templateName(MrtmNotificationTemplateName.AER_SUBMISSION_WINDOW_EXPIRATION_REMINDER_TEMPLATE)
                .templateParams(templateParams)
                .build())
            .build();

        DelegateExecution execution = mock(DelegateExecution.class);

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.ofNullable(userInfoDTO));
        when(accountQueryService.getAccountInfoDTOById(accountId)).thenReturn(account);

        handler.execute(execution);

        verify(notificationEmailService).notifyRecipient(emailData, userEmail);
        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(requestService).findRequestById(requestId);
        verify(requestAccountContactQueryService).getRequestAccountPrimaryContact(request);
        verify(accountQueryService).getAccountInfoDTOById(accountId);

        verifyNoMoreInteractions(requestService, requestAccountContactQueryService,
            accountQueryService, notificationEmailService);
    }

    @Test
    void test_throws_exception_when_primary_contact_not_found() {
        String requestId = "1";
        Request request = Request.builder()
            .build();

        DelegateExecution execution = mock(DelegateExecution.class);

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.empty());

        BusinessException be = assertThrows(BusinessException.class, () -> {
            handler.execute(execution);
        });

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND);

        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(requestService).findRequestById(requestId);
        verify(requestAccountContactQueryService).getRequestAccountPrimaryContact(request);

        verifyNoMoreInteractions(requestService, requestAccountContactQueryService);
        verifyNoInteractions(accountQueryService, notificationEmailService);
    }
}