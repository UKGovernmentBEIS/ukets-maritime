package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDecisionNotification;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.files.attachments.service.FileAttachmentService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;
import uk.gov.netz.api.workflow.utils.NotificationTemplateName;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class NonComplianceSendOfficialNoticeService {

    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final DecisionNotificationUsersService decisionNotificationUsersService;
    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    private final CompetentAuthorityService competentAuthorityService;
    private final FileAttachmentService fileAttachmentService;

    public void sendOfficialNotice(UUID officialNotice, Request request, NonComplianceDecisionNotification decisionNotification) {
        Optional<UserInfoDTO> requestAccountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request);
        FileDTO fileDTO = fileAttachmentService.getFileDTO(officialNotice.toString());
        DecisionNotification genericDecisionNotification = DecisionNotification.builder()
                .operators(decisionNotification.getOperators())
                .externalContacts(decisionNotification.getExternalContacts())
                .build();

        requestAccountPrimaryContact.ifPresentOrElse(
            accountPrimaryContact -> sendOfficialNotice(request, accountPrimaryContact, genericDecisionNotification, fileDTO),
            () -> {
                List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(genericDecisionNotification);
                if(ObjectUtils.isNotEmpty(ccRecipientsEmails)) {
                    sendOfficialNoticeCcRecipientsOnly(request, ccRecipientsEmails, fileDTO);
                }
            });
    }

    private void sendOfficialNotice(Request request, UserInfoDTO accountPrimaryContact, DecisionNotification decisionNotification, FileDTO file) {
        UserInfoDTO accountServiceContact = requestAccountContactQueryService.getRequestAccountServiceContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_SERVICE_CONTACT_NOT_FOUND));

        List<String> toRecipientEmails = Stream.of(accountPrimaryContact.getEmail(), accountServiceContact.getEmail()).distinct().toList();
        List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(decisionNotification);

        EmailData<EmailNotificationTemplateData> notificationEmailData = buildEmailData(request,
            file, Optional.of(accountPrimaryContact), Optional.of(accountServiceContact));

        notificationEmailService.notifyRecipients(notificationEmailData, toRecipientEmails, ccRecipientsEmails);
    }

    private void sendOfficialNoticeCcRecipientsOnly(Request request, List<String> ccRecipientsEmails, FileDTO file) {
        EmailData<EmailNotificationTemplateData> notificationEmailData = buildEmailData(request, file, Optional.empty(), Optional.empty());

        notificationEmailService.notifyRecipients(notificationEmailData, Collections.emptyList(), ccRecipientsEmails);
    }

    private EmailData<EmailNotificationTemplateData> buildEmailData(Request request, FileDTO file,
                                                                    Optional<UserInfoDTO> accountPrimaryContact,
                                                                    Optional<UserInfoDTO> accountServiceContact) {
        Map<String, Object> templateParams = new HashMap<>();

        accountPrimaryContact
            .ifPresent(userInfo -> {
                templateParams.put(NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT, userInfo.getFullName());
                templateParams.put(NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT_FIRST_NAME, userInfo.getFirstName());
            });
        accountServiceContact
            .ifPresent(userInfo -> {
                templateParams.put(NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT, userInfo.getFullName());
                templateParams.put(NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT_FIRST_NAME, userInfo.getFirstName());
            });

        CompetentAuthorityDTO competentAuthority = competentAuthorityService
            .getCompetentAuthorityDTO(request.getCompetentAuthority());

        templateParams.put(NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, competentAuthority.getEmail());
        templateParams.put(NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME, competentAuthority.getName());

        return EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(NotificationTemplateName.GENERIC_EMAIL)
                .competentAuthority(request.getCompetentAuthority())
                .templateParams(templateParams)
                .build())
            .attachments(Map.of(
                    file.getFileName(),
                    file.getFileContent())
            )
            .build();
    }
}
