package uk.gov.mrtm.api.workflow.request.flow.common.service.docgen.async;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.account.domain.dto.AccountInfoDTO;
import uk.gov.netz.api.account.service.AccountQueryService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.config.WebAppProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName.DOCUMENT_GENERATION_FAILED_TEMPLATE;

@ExtendWith(MockitoExtension.class)
class DocumentGenerationFailedNotificationServiceTest {

    @InjectMocks
    private DocumentGenerationFailedNotificationService service;

    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    @Mock
    private AccountQueryService accountQueryService;
    @Mock
    private WebAppProperties webAppProperties;
    @Mock
    private UserAuthService userAuthService;
    @Mock
    private CompetentAuthorityService competentAuthorityService;

    @Test
    void notifyRegulator() {
        String requestId = "requestId";
        Long accountId = 1L;
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        String accountName = "name";
        String businessId = "businessId";
        AccountInfoDTO accountInfoDTO = AccountInfoDTO.builder().businessId(businessId).name(accountName).build();
        Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(
                RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(String.valueOf(accountId)).build(),
                RequestResource.builder().resourceType(ResourceType.CA).resourceId(String.valueOf(competentAuthority)).build()
            )).build();
        String url = "url";
        String assignee = "assignee";
        String email = "email";
        String caEmail = "caEmail";
        String caName = "caName";
        CompetentAuthorityDTO competentAuthorityDTO = CompetentAuthorityDTO.builder().email(caEmail).name(caName).build();
        UserInfoDTO userInfoDTO = UserInfoDTO.builder().email(email).build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .assignee(assignee)
            .build();

        EmailData<EmailNotificationTemplateData> notifyInfo = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(DOCUMENT_GENERATION_FAILED_TEMPLATE)
                .templateParams(Map.of(
                    NotificationTemplateConstants.HOME_URL, url,
                    NotificationTemplateConstants.ACCOUNT_NAME, accountName,
                    NotificationTemplateConstants.ACCOUNT_BUSINESS_ID, businessId,
                    NotificationTemplateConstants.WORKFLOW_ID, requestId,
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, caEmail,
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME, caName
                ))
                .build())
            .build();

        when(webAppProperties.getUrl()).thenReturn(url);
        when(accountQueryService.getAccountInfoDTOById(accountId)).thenReturn(accountInfoDTO);
        when(userAuthService.getUserByUserId(assignee)).thenReturn(userInfoDTO);
        when(competentAuthorityService.getCompetentAuthorityDTO(competentAuthority)).thenReturn(competentAuthorityDTO);

        service.notifyRegulator(requestTask);

        verify(webAppProperties).getUrl();
        verify(accountQueryService).getAccountInfoDTOById(accountId);
        verify(userAuthService).getUserByUserId(assignee);
        verify(competentAuthorityService).getCompetentAuthorityDTO(competentAuthority);
        verify(notificationEmailService).notifyRecipients(notifyInfo, List.of(userInfoDTO.getEmail()));

        verifyNoMoreInteractions(accountQueryService, userAuthService, webAppProperties,
            competentAuthorityService, notificationEmailService);
    }
}