package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.OfficialNoticeGeneratorService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.OfficialNoticeSendService;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpNotificationOfficialNoticeService {

    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final DecisionNotificationUsersService decisionNotificationUsersService;
    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    private final RequestService requestService;
    private final OfficialNoticeSendService officialNoticeSendService;
    private final OfficialNoticeGeneratorService officialNoticeGeneratorService;
    private final CompetentAuthorityService competentAuthorityService;

    public void sendFollowUpOfficialNotice(final Request request) {

        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        UserInfoDTO accountServiceContact = requestAccountContactQueryService.getRequestAccountServiceContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_SERVICE_CONTACT_NOT_FOUND));
        CompetentAuthorityDTO competentAuthority = competentAuthorityService.getCompetentAuthorityDTO(request.getCompetentAuthority());

        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getFollowUpReviewDecisionNotification())
        	.stream()
            .filter(email -> !email.equals(accountPrimaryContact.getEmail()))
            .collect(Collectors.toList());

        // notify 
        notificationEmailService.notifyRecipients(
            EmailData.builder()
                .notificationTemplateData(EmailNotificationTemplateData.builder()
                    .templateName(MrtmNotificationTemplateName.EMP_NOTIFICATION_OPERATOR_RESPONSE)
                    .competentAuthority(request.getCompetentAuthority())
                    .templateParams(
                        Map.of(
                            NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT, accountPrimaryContact.getFullName(),
                            NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT_FIRST_NAME, accountPrimaryContact.getFirstName(),
                            NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT, accountServiceContact.getFullName(),
                            NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT_FIRST_NAME, accountServiceContact.getFirstName(),
                            NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, competentAuthority.getEmail(),
                            NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME, competentAuthority.getName(),
                            NotificationTemplateConstants.WORKFLOW_ID, request.getId()
                        )).build())
                .build(),
            List.of(accountPrimaryContact.getEmail()),
            ccRecipientsEmails);
    }

    public void sendOfficialNotice(final Request request) {
        
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        final List<String> ccRecipientsEmails = decisionNotificationUsersService.findUserEmails(requestPayload.getReviewDecisionNotification());
        officialNoticeSendService.sendOfficialNotice(List.of(requestPayload.getOfficialNotice()), request, ccRecipientsEmails);
    }

    @Transactional
    public void generateAndSaveGrantedOfficialNotice(final String requestId) {
        
        final Request request = requestService.findRequestById(requestId);
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();

        //generate
        final FileInfoDTO officialNotice = officialNoticeGeneratorService.generate(request,
                MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_GRANTED,
                MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED,
                requestPayload.getReviewDecisionNotification(),
                "EMP Notification Acknowledgement Letter.pdf"
                );

        //save to payload
        requestPayload.setOfficialNotice(officialNotice);
    }

    @Transactional
    public void generateAndSaveRejectedOfficialNotice(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();

        //generate
        final FileInfoDTO officialNotice = officialNoticeGeneratorService.generate(request,
                MrtmDocumentTemplateGenerationContextActionType.EMP_NOTIFICATION_REJECTED,
                MrtmDocumentTemplateType.EMP_NOTIFICATION_REFUSED,
                requestPayload.getReviewDecisionNotification(),
                "EMP Notification Refusal Letter.pdf"
        );

        //save to payload
        requestPayload.setOfficialNotice(officialNotice);

    }
}
