package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDecisionNotification;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.files.attachments.service.FileAttachmentService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;
import uk.gov.netz.api.workflow.utils.NotificationTemplateName;

import java.util.Collections;
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
class NonComplianceSendOfficialNoticeServiceTest {

    @InjectMocks
    private NonComplianceSendOfficialNoticeService officialNoticeSendService;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Mock
    private DecisionNotificationUsersService decisionNotificationUsersService;

    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @Mock
    private FileAttachmentService fileAttachmentService;

    @Mock
    private CompetentAuthorityService competentAuthorityService;

    @Test
    void sendOfficialNotice() {
        String requestId = "REQ-ID";
        UUID uuid = UUID.randomUUID();
        FileDTO officialNoticeFileDTO = FileDTO.builder()
            .fileName("name")
            .fileContent("content".getBytes())
            .build();
        NonComplianceDecisionNotification nonComplianceDecisionNotification =
            NonComplianceDecisionNotification.builder()
                .operators(Set.of("operator"))
                .externalContacts(Set.of(1L))
                .build();
        DecisionNotification genericDecisionNotification = DecisionNotification.builder()
            .operators(nonComplianceDecisionNotification.getOperators())
            .externalContacts(nonComplianceDecisionNotification.getExternalContacts())
            .build();
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.WALES;
        Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder().resourceId(ca.name()).resourceType(ResourceType.CA).build()))
            .build();
        UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().firstName("fn").lastName("ln").email("email").build();
        UserInfoDTO accountServiceContact = UserInfoDTO.builder().firstName("fn2").lastName("ln2").email("email2").build();
        List<String> toRecipientEmails = List.of(accountPrimaryContact.getEmail(), accountServiceContact.getEmail());
        List<String> ccRecipientsEmails = List.of("emailRecipient1", "emailRecipient2");
        CompetentAuthorityDTO competentAuthority = CompetentAuthorityDTO.builder()
            .id(CompetentAuthorityEnum.WALES)
            .name("competentAuthority")
            .email("competent@authority.com")
            .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.of(accountPrimaryContact));
        when(requestAccountContactQueryService.getRequestAccountServiceContact(request)).thenReturn(Optional.of(accountServiceContact));
        when(decisionNotificationUsersService.findUserEmails(genericDecisionNotification)).thenReturn(ccRecipientsEmails);
        when(fileAttachmentService.getFileDTO(uuid.toString())).thenReturn(officialNoticeFileDTO);
        when(competentAuthorityService.getCompetentAuthorityDTO(ca)).thenReturn(competentAuthority);

        //invoke
        officialNoticeSendService.sendOfficialNotice(uuid, request, nonComplianceDecisionNotification);

        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountServiceContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(genericDecisionNotification);
        verify(competentAuthorityService, times(1)).getCompetentAuthorityDTO(ca);

        ArgumentCaptor<EmailData<EmailNotificationTemplateData>> emailDataCaptor = ArgumentCaptor.forClass(EmailData.class);
        verify(notificationEmailService, times(1)).notifyRecipients(emailDataCaptor.capture(),
            Mockito.eq(toRecipientEmails), Mockito.eq((ccRecipientsEmails)));
        EmailData<EmailNotificationTemplateData> emailDataCaptured = emailDataCaptor.getValue();
        assertThat(emailDataCaptured).isEqualTo(EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(NotificationTemplateName.GENERIC_EMAIL)
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .templateParams(Map.of(
                    NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT, accountPrimaryContact.getFullName(),
                    NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT_FIRST_NAME, accountPrimaryContact.getFirstName(),
                    NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT, accountServiceContact.getFullName(),
                    NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT_FIRST_NAME, accountServiceContact.getFirstName(),
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, competentAuthority.getEmail(),
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME, competentAuthority.getName()
                ))
                .build())
            .attachments(Map.of(officialNoticeFileDTO.getFileName(), officialNoticeFileDTO.getFileContent())).build());
    }

    @Test
    void sendOfficialNotice_nor_primary_contact_neither_other_users_selected_to_be_notified() {
        String requestId = "REQ-ID";
        UUID uuid = UUID.randomUUID();
        NonComplianceDecisionNotification nonComplianceDecisionNotification =
            NonComplianceDecisionNotification.builder()
                .operators(Set.of("operator"))
                .externalContacts(Set.of(1L))
                .build();
        DecisionNotification genericDecisionNotification = DecisionNotification.builder()
            .operators(nonComplianceDecisionNotification.getOperators())
            .externalContacts(nonComplianceDecisionNotification.getExternalContacts())
            .build();
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.WALES;
        Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder().resourceId(ca.name()).resourceType(ResourceType.CA).build()))
            .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.empty());
        when(decisionNotificationUsersService.findUserEmails(genericDecisionNotification)).thenReturn(Collections.emptyList());

        //invoke
        officialNoticeSendService.sendOfficialNotice(uuid, request, nonComplianceDecisionNotification);

        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(genericDecisionNotification);

        verifyNoMoreInteractions(requestAccountContactQueryService);
        verifyNoInteractions(notificationEmailService);
        verifyNoInteractions(competentAuthorityService);
    }

    @Test
    void sendOfficialNotice_no_primary_contact_exists_but_other_users_selected_to_be_notified() {
        String requestId = "REQ-ID";
        UUID uuid = UUID.randomUUID();
        FileDTO officialNoticeFileDTO = FileDTO.builder()
            .fileName("name")
            .fileContent("content".getBytes())
            .build();
        NonComplianceDecisionNotification nonComplianceDecisionNotification =
            NonComplianceDecisionNotification.builder()
                .operators(Set.of("operator"))
                .externalContacts(Set.of(1L))
                .build();
        DecisionNotification genericDecisionNotification = DecisionNotification.builder()
            .operators(nonComplianceDecisionNotification.getOperators())
            .externalContacts(nonComplianceDecisionNotification.getExternalContacts())
            .build();
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.WALES;
        Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder().resourceId(ca.name()).resourceType(ResourceType.CA).build()))
            .build();
        List<String> ccRecipientsEmails = List.of("emailRecipient1");
        CompetentAuthorityDTO competentAuthority = CompetentAuthorityDTO.builder()
            .id(CompetentAuthorityEnum.WALES)
            .name("competentAuthority")
            .email("competent@authority.com")
            .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.empty());
        when(decisionNotificationUsersService.findUserEmails(genericDecisionNotification)).thenReturn(ccRecipientsEmails);
        when(fileAttachmentService.getFileDTO(uuid.toString())).thenReturn(officialNoticeFileDTO);
        when(competentAuthorityService.getCompetentAuthorityDTO(ca)).thenReturn(competentAuthority);

        //invoke
        officialNoticeSendService.sendOfficialNotice(uuid, request, nonComplianceDecisionNotification);

        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(genericDecisionNotification);
        verify(competentAuthorityService, times(1)).getCompetentAuthorityDTO(ca);

        ArgumentCaptor<EmailData<EmailNotificationTemplateData>> emailDataCaptor = ArgumentCaptor.forClass(EmailData.class);
        verify(notificationEmailService, times(1))
            .notifyRecipients(emailDataCaptor.capture(), Mockito.eq(Collections.emptyList()), Mockito.eq((ccRecipientsEmails)));
        EmailData<EmailNotificationTemplateData> emailDataCaptured = emailDataCaptor.getValue();
        assertThat(emailDataCaptured).isEqualTo(EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(NotificationTemplateName.GENERIC_EMAIL)
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .templateParams(Map.of(
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, competentAuthority.getEmail(),
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME, competentAuthority.getName()
                ))
                .build())
            .attachments(Map.of(officialNoticeFileDTO.getFileName(), officialNoticeFileDTO.getFileContent())).build());

        verifyNoMoreInteractions(requestAccountContactQueryService);
    }

}
