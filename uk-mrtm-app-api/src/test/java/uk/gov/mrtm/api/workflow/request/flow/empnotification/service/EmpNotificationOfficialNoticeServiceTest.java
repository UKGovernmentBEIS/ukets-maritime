package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.OfficialNoticeGeneratorService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.OfficialNoticeSendService;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationOfficialNoticeServiceTest {

    @InjectMocks
    private EmpNotificationOfficialNoticeService service;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Mock
    private DecisionNotificationUsersService decisionNotificationUsersService;

    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @Mock
    private RequestService requestService;

    @Mock
    private OfficialNoticeSendService officialNoticeSendService;

    @Mock
    private OfficialNoticeGeneratorService officialNoticeGeneratorService;

    @Mock
    private CompetentAuthorityService competentAuthorityService;

    @Test
    void sendFollowUpOfficialNotice() {

        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        final EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload.builder()
            .followUpReviewDecisionNotification(DecisionNotification.builder()
                .operators(Set.of("operator1"))
                .signatory("signatory")
                .build())
            .build();
        final Request request = Request.builder()
            .id("requestId")
            .requestResources(List.of(RequestResource.builder().resourceId(ca.name()).resourceType(ResourceType.CA).build()))
            .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
            .payload(requestPayload)
            .build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder()
            .firstName("fn").lastName("ln").email("primary@email").userId("primaryUserId").build();
        final UserInfoDTO accountServiceContact = UserInfoDTO.builder()
            .firstName("fn2").lastName("ln2").email("service@email").userId("serviceUserId").build();
        final List<String> ccRecipientsEmails = List.of("operator1@email");
        final CompetentAuthorityDTO competentAuthority = CompetentAuthorityDTO.builder()
            .id(CompetentAuthorityEnum.ENGLAND)
            .name("competentAuthority")
            .email("competent@authority.com")
            .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
            .thenReturn(Optional.of(accountPrimaryContact));
        when(requestAccountContactQueryService.getRequestAccountServiceContact(request))
            .thenReturn(Optional.of(accountServiceContact));
        when(decisionNotificationUsersService.findUserEmails(requestPayload.getFollowUpReviewDecisionNotification()))
            .thenReturn(ccRecipientsEmails);
        when(competentAuthorityService.getCompetentAuthorityDTO(ca)).thenReturn(competentAuthority);

        service.sendFollowUpOfficialNotice(request);

        verify(requestAccountContactQueryService, times(1))
            .getRequestAccountPrimaryContact(request);
        verify(decisionNotificationUsersService, times(1))
            .findUserEmails(requestPayload.getFollowUpReviewDecisionNotification());
        verify(requestAccountContactQueryService).getRequestAccountPrimaryContact(request);
        verify(requestAccountContactQueryService).getRequestAccountServiceContact(request);

        final ArgumentCaptor<EmailData> emailDataCaptor = ArgumentCaptor.forClass(EmailData.class);
        verify(notificationEmailService, times(1)).notifyRecipients(emailDataCaptor.capture(),
            Mockito.eq(List.of(accountPrimaryContact.getEmail())), Mockito.eq(List.of("operator1@email")));
        final EmailData emailDataCaptured = emailDataCaptor.getValue();
        assertThat(emailDataCaptured).isEqualTo(EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(MrtmNotificationTemplateName.EMP_NOTIFICATION_OPERATOR_RESPONSE)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .templateParams(Map.of(
                    NotificationTemplateConstants.WORKFLOW_ID, "requestId",
                    NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT_FIRST_NAME, accountPrimaryContact.getFirstName(),
                    NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT, accountServiceContact.getFullName(),
                    NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT_FIRST_NAME, accountServiceContact.getFirstName(),
                    NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT,accountPrimaryContact.getFullName(),
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, competentAuthority.getEmail(),
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME, competentAuthority.getName()))
                .build()).build());
    }

    @Test
    void generateAndSaveGrantedOfficialNotice() {

        final String requestId = "1";
        final EmpNotificationRequestPayload requestPayload = createEmpNotificationRequestPayload();
        final Request request = createRequest(requestPayload);
        final FileInfoDTO officialDocFileInfoDTO = createOfficialDocFileInfoDTO();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(officialNoticeGeneratorService.generate(request,
                        MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_GRANTED,
                        MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED,
                        requestPayload.getReviewDecisionNotification(),
                        "EMP Notification Acknowledgement Letter.pdf"))
            .thenReturn(officialDocFileInfoDTO);

        service.generateAndSaveGrantedOfficialNotice(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(officialNoticeGeneratorService).generate(request,
                        MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_GRANTED,
                        MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED,
                        requestPayload.getReviewDecisionNotification(),
                        "EMP Notification Acknowledgement Letter.pdf");

        assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialDocFileInfoDTO);
    }

    @Test
    void generateAndSaveRejectedOfficialNotice() {

        final String requestId = "1";
        final EmpNotificationRequestPayload requestPayload = createEmpNotificationRequestPayload();
        final Request request = createRequest(requestPayload);
        final FileInfoDTO officialDocFileInfoDTO = createOfficialDocFileInfoDTO();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(officialNoticeGeneratorService.generate(request,
                MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_REJECTED,
                MrtmDocumentTemplateType.EMP_NOTIFICATION_REFUSED,
                requestPayload.getReviewDecisionNotification(),
                "EMP Notification Refusal Letter.pdf"))
                .thenReturn(officialDocFileInfoDTO);

        service.generateAndSaveRejectedOfficialNotice(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(officialNoticeGeneratorService).generate(request,
                MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_REJECTED,
                MrtmDocumentTemplateType.EMP_NOTIFICATION_REFUSED,
                requestPayload.getReviewDecisionNotification(),
                "EMP Notification Refusal Letter.pdf");

        assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialDocFileInfoDTO);
    }

    @Test
    void sendOfficialNotice() {
        final List<String> ccRecipientsEmails = List.of(UUID.randomUUID().toString());
        final EmpNotificationRequestPayload requestPayload = createEmpNotificationRequestPayload();
        final Request request = createRequest(requestPayload);

        when(decisionNotificationUsersService
            .findUserEmails(requestPayload.getReviewDecisionNotification()))
            .thenReturn(ccRecipientsEmails);

        service.sendOfficialNotice(request);

        verify(decisionNotificationUsersService).findUserEmails(requestPayload.getReviewDecisionNotification());
        verify(officialNoticeSendService)
            .sendOfficialNotice(List.of(requestPayload.getOfficialNotice()), request, ccRecipientsEmails);
        verifyNoMoreInteractions(decisionNotificationUsersService, officialNoticeSendService);
        verifyNoInteractions(requestAccountContactQueryService,
            notificationEmailService, requestService, officialNoticeGeneratorService);
    }

    private FileInfoDTO createOfficialDocFileInfoDTO() {
        return FileInfoDTO.builder()
                .name("offDoc.pdf")
                .uuid(UUID.randomUUID().toString())
                .build();
    }

    private Request createRequest(EmpNotificationRequestPayload requestPayload) {
        return Request.builder()
                .requestResources(List.of(RequestResource.builder().resourceId(CompetentAuthorityEnum.ENGLAND.name()).resourceType(ResourceType.CA).build()))
                .payload(requestPayload)
                .build();
    }

    private EmpNotificationRequestPayload createEmpNotificationRequestPayload() {
        return EmpNotificationRequestPayload.builder()
            .officialNotice(createOfficialDocFileInfoDTO())
            .reviewDecisionNotification(DecisionNotification.builder()
                .operators(Set.of("operator1"))
                .signatory("signatory")
                .build())
            .build();
    }
}
