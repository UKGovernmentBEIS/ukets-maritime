package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.netz.api.account.domain.dto.AccountInfoDTO;
import uk.gov.netz.api.account.service.AccountCaSiteContactService;
import uk.gov.netz.api.account.service.AccountQueryService;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.core.service.AuthorityService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.config.WebAppProperties;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirSendRespondToRegulatorCommentsNotificationServiceTest {
    private static final String BUSINESS_ID = "MA12345";

    @InjectMocks
    private VirRespondToRegulatorCommentsNotificationService service;

    @Mock
    private NotificationEmailService notificationEmailService;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private AuthorityService authorityService;

    @Mock
    private AccountCaSiteContactService accountCaSiteContactService;

    @Mock
    private AccountQueryService accountQueryService;

    @Mock
    private WebAppProperties webAppProperties;

    private static final String homeUrl = "url";

    @Test
    void sendSubmittedResponseToRegulatorCommentsNotificationToRegulator() {
        final long accountId = 1L;
        final String requestId = "MAVIR001-2025";

        final String reviewer = "reviewer";
        final String reviewerEmail = "regulator@test.gr";
        final UserInfoDTO reviewerUser = UserInfoDTO.builder().userId(reviewer).email(reviewerEmail).build();

        final Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                        .resourceType(ResourceType.ACCOUNT)
                        .resourceId(String.valueOf(accountId))
                        .build()))
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .payload(VirRequestPayload.builder()
                        .regulatorReviewer(reviewer)
                        .build())
                .build();

        final String siteContact = "siteContact";
        final String siteContactEmail = "regulator2@test.gr";
        final UserInfoDTO siteContactUser = UserInfoDTO.builder().userId(siteContact).email(siteContactEmail).build();

        final String installationName = "Installation Name";
        final AccountInfoDTO accountInfoDTO = AccountInfoDTO.builder()
                .name(installationName)
                .businessId(BUSINESS_ID)
                .build();
        final EmailData notifyInfo = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(MrtmNotificationTemplateName.VIR_NOTIFICATION_OPERATOR_RESPONSE)
                        .templateParams(Map.of(
                                NotificationTemplateConstants.ACCOUNT_NAME, installationName,
                                NotificationTemplateConstants.HOME_URL, homeUrl,
                                MrtmEmailNotificationTemplateConstants.EMITTER_ID, BUSINESS_ID
                        ))
                        .build())
                .build();

        when(authorityService.findStatusByUsers(List.of(reviewer))).thenReturn(Map.of(reviewer, AuthorityStatus.ACTIVE));
        when(userAuthService.getUserByUserId(reviewer)).thenReturn(reviewerUser);
        when(accountCaSiteContactService.findCASiteContactByAccount(accountId)).thenReturn(Optional.of(siteContact));
        when(userAuthService.getUserByUserId(siteContact)).thenReturn(siteContactUser);
        when(accountQueryService.getAccountInfoDTOById(accountId)).thenReturn(accountInfoDTO);
        when(webAppProperties.getUrl()).thenReturn(homeUrl);

        // Invoke
        service.sendSubmittedResponseToRegulatorCommentsNotificationToRegulator(request);

        // Verify
        verify(authorityService, times(1)).findStatusByUsers(List.of(reviewer));
        verify(userAuthService, times(1)).getUserByUserId(reviewer);
        verify(accountCaSiteContactService, times(1)).findCASiteContactByAccount(accountId);
        verify(userAuthService, times(1)).getUserByUserId(siteContact);
        verify(accountQueryService, times(1)).getAccountInfoDTOById(accountId);
        verify(notificationEmailService, times(1))
                .notifyRecipients(notifyInfo, List.of(reviewerEmail, siteContactEmail), List.of());
    }

    @Test
    void sendSubmittedResponseToRegulatorCommentsNotificationToRegulator_only_reviewer() {
        final long accountId = 1L;
        final String requestId = "MAVIR001-2025";

        final String reviewer = "reviewer";
        final String reviewerEmail = "regulator@test.gr";
        final UserInfoDTO reviewerUser = UserInfoDTO.builder().userId(reviewer).email(reviewerEmail).build();

        final Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                        .resourceType(ResourceType.ACCOUNT)
                        .resourceId(String.valueOf(accountId))
                        .build()))
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .payload(VirRequestPayload.builder()
                        .regulatorReviewer(reviewer)
                        .build())
                .build();

        final String installationName = "Installation Name";
        final AccountInfoDTO accountInfoDTO = AccountInfoDTO.builder()
            .name(installationName)
            .businessId(BUSINESS_ID)
            .build();
        final EmailData notifyInfo = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(MrtmNotificationTemplateName.VIR_NOTIFICATION_OPERATOR_RESPONSE)
                        .templateParams(Map.of(
                                NotificationTemplateConstants.ACCOUNT_NAME, installationName,
                                NotificationTemplateConstants.HOME_URL, homeUrl,
                                MrtmEmailNotificationTemplateConstants.EMITTER_ID, BUSINESS_ID
                        ))
                        .build())
                .build();

        when(authorityService.findStatusByUsers(List.of(reviewer))).thenReturn(Map.of(reviewer, AuthorityStatus.ACTIVE));
        when(userAuthService.getUserByUserId(reviewer)).thenReturn(reviewerUser);
        when(accountCaSiteContactService.findCASiteContactByAccount(accountId)).thenReturn(Optional.empty());
        when(accountQueryService.getAccountInfoDTOById(accountId)).thenReturn(accountInfoDTO);
        when(webAppProperties.getUrl()).thenReturn(homeUrl);

        // Invoke
        service.sendSubmittedResponseToRegulatorCommentsNotificationToRegulator(request);

        // Verify
        verify(authorityService, times(1)).findStatusByUsers(List.of(reviewer));
        verify(userAuthService, times(1)).getUserByUserId(reviewer);
        verify(accountCaSiteContactService, times(1)).findCASiteContactByAccount(accountId);
        verify(accountQueryService, times(1)).getAccountInfoDTOById(accountId);
        verify(notificationEmailService, times(1))
                .notifyRecipients(notifyInfo, List.of(reviewerEmail), List.of());
        verifyNoMoreInteractions(userAuthService);
    }

    @Test
    void sendSubmittedResponseToRegulatorCommentsNotificationToRegulator_only_site_contact() {
        final long accountId = 1L;
        final String requestId = "MAVIR001-2025";
        final String reviewer = "reviewer";

        final String siteContact = "siteContact";
        final String siteContactEmail = "regulator2@test.gr";
        final UserInfoDTO siteContactUser = UserInfoDTO.builder().userId(siteContact).email(siteContactEmail).build();

        final Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                        .resourceType(ResourceType.ACCOUNT)
                        .resourceId(String.valueOf(accountId))
                        .build()))
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .payload(VirRequestPayload.builder()
                        .regulatorReviewer(reviewer)
                        .build())
                .build();

        final String installationName = "Installation Name";
        final AccountInfoDTO accountInfoDTO = AccountInfoDTO.builder()
            .name(installationName)
            .businessId(BUSINESS_ID)
            .build();
        final EmailData notifyInfo = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(MrtmNotificationTemplateName.VIR_NOTIFICATION_OPERATOR_RESPONSE)
                        .templateParams(Map.of(
                                NotificationTemplateConstants.ACCOUNT_NAME, installationName,
                                NotificationTemplateConstants.HOME_URL, homeUrl,
                                MrtmEmailNotificationTemplateConstants.EMITTER_ID, BUSINESS_ID
                        ))
                        .build())
                .build();

        when(authorityService.findStatusByUsers(List.of(reviewer))).thenReturn(Map.of(reviewer, AuthorityStatus.DISABLED));
        when(accountCaSiteContactService.findCASiteContactByAccount(accountId)).thenReturn(Optional.of(siteContact));
        when(userAuthService.getUserByUserId(siteContact)).thenReturn(siteContactUser);
        when(accountQueryService.getAccountInfoDTOById(accountId)).thenReturn(accountInfoDTO);
        when(webAppProperties.getUrl()).thenReturn(homeUrl);

        // Invoke
        service.sendSubmittedResponseToRegulatorCommentsNotificationToRegulator(request);

        // Verify
        verify(authorityService, times(1)).findStatusByUsers(List.of(reviewer));
        verify(accountCaSiteContactService, times(1)).findCASiteContactByAccount(accountId);
        verify(userAuthService, times(1)).getUserByUserId(siteContact);
        verify(accountQueryService, times(1)).getAccountInfoDTOById(accountId);
        verify(notificationEmailService, times(1))
                .notifyRecipients(notifyInfo, List.of(siteContactEmail), List.of());
        verifyNoMoreInteractions(userAuthService);
    }

    @Test
    void sendSubmittedResponseToRegulatorCommentsNotificationToRegulator_no_recipients() {
        final long accountId = 1L;
        final String reviewer = "reviewer";
        final String requestId = "MAVIR001-2025";

        final Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                        .resourceType(ResourceType.ACCOUNT)
                        .resourceId(String.valueOf(accountId))
                        .build()))
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .payload(VirRequestPayload.builder()
                        .regulatorReviewer(reviewer)
                        .build())
                .build();

        when(authorityService.findStatusByUsers(List.of(reviewer))).thenReturn(Map.of());
        when(accountCaSiteContactService.findCASiteContactByAccount(accountId)).thenReturn(Optional.empty());

        // Invoke
        service.sendSubmittedResponseToRegulatorCommentsNotificationToRegulator(request);

        // Verify
        verify(authorityService, times(1)).findStatusByUsers(List.of(reviewer));
        verify(accountCaSiteContactService, times(1)).findCASiteContactByAccount(accountId);
        verifyNoInteractions(userAuthService, accountQueryService, notificationEmailService, webAppProperties);
    }

    @Test
    void sendDeadlineResponseToRegulatorCommentsNotificationToRegulator() {
        final long accountId = 1L;
        final String requestId = "MAVIR001-2025";

        final String reviewer = "reviewer";
        final String reviewerEmail = "regulator@test.gr";
        final UserInfoDTO reviewerUser = UserInfoDTO.builder().userId(reviewer).email(reviewerEmail).build();

        final Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                        .resourceType(ResourceType.ACCOUNT)
                        .resourceId(String.valueOf(accountId))
                        .build()))
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .payload(VirRequestPayload.builder()
                        .regulatorReviewer(reviewer)
                        .build())
                .build();

        final String siteContact = "siteContact";
        final String siteContactEmail = "regulator2@test.gr";
        final UserInfoDTO siteContactUser = UserInfoDTO.builder().userId(siteContact).email(siteContactEmail).build();

        final String installationName = "Installation Name";
        final AccountInfoDTO accountInfoDTO = AccountInfoDTO.builder()
            .name(installationName)
            .businessId(BUSINESS_ID)
            .build();
        final EmailData notifyInfo = EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                        .templateName(MrtmNotificationTemplateName.VIR_NOTIFICATION_OPERATOR_MISSES_DEADLINE)
                        .templateParams(Map.of(
                                NotificationTemplateConstants.ACCOUNT_NAME, installationName,
                                NotificationTemplateConstants.HOME_URL, homeUrl,
                                MrtmEmailNotificationTemplateConstants.EMITTER_ID, BUSINESS_ID
                        ))
                        .build())
                .build();

        when(authorityService.findStatusByUsers(List.of(reviewer))).thenReturn(Map.of(reviewer, AuthorityStatus.ACTIVE));
        when(userAuthService.getUserByUserId(reviewer)).thenReturn(reviewerUser);
        when(accountCaSiteContactService.findCASiteContactByAccount(accountId)).thenReturn(Optional.of(siteContact));
        when(userAuthService.getUserByUserId(siteContact)).thenReturn(siteContactUser);
        when(accountQueryService.getAccountInfoDTOById(accountId)).thenReturn(accountInfoDTO);
        when(webAppProperties.getUrl()).thenReturn(homeUrl);

        // Invoke
        service.sendDeadlineResponseToRegulatorCommentsNotificationToRegulator(request);

        // Verify
        verify(authorityService, times(1)).findStatusByUsers(List.of(reviewer));
        verify(userAuthService, times(1)).getUserByUserId(reviewer);
        verify(accountCaSiteContactService, times(1)).findCASiteContactByAccount(accountId);
        verify(userAuthService, times(1)).getUserByUserId(siteContact);
        verify(accountQueryService, times(1)).getAccountInfoDTOById(accountId);
        verify(notificationEmailService, times(1))
                .notifyRecipients(notifyInfo, List.of(reviewerEmail, siteContactEmail), List.of());
    }
}
