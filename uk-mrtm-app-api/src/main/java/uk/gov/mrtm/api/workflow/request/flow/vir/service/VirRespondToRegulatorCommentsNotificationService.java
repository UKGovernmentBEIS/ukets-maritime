package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.netz.api.account.domain.dto.AccountInfoDTO;
import uk.gov.netz.api.account.service.AccountCaSiteContactService;
import uk.gov.netz.api.account.service.AccountQueryService;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.core.service.AuthorityService;
import uk.gov.netz.api.common.config.WebAppProperties;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class VirRespondToRegulatorCommentsNotificationService {

    private final NotificationEmailService notificationEmailService;
    private final UserAuthService userAuthService;
    private final AuthorityService authorityService;
    private final AccountCaSiteContactService accountCaSiteContactService;
    private final AccountQueryService accountQueryService;
    private final WebAppProperties webAppProperties;

    public void sendSubmittedResponseToRegulatorCommentsNotificationToRegulator(final Request request) {
        sendNotification(request, MrtmNotificationTemplateName.VIR_NOTIFICATION_OPERATOR_RESPONSE);
    }

    public void sendDeadlineResponseToRegulatorCommentsNotificationToRegulator(final Request request) {
        sendNotification(request, MrtmNotificationTemplateName.VIR_NOTIFICATION_OPERATOR_MISSES_DEADLINE);
    }

    private void sendNotification(final Request request, String templateName) {
        Set<String> recipientsEmails = new HashSet<>();
        String reviewer = request.getPayload().getRegulatorReviewer();
        Long accountId = request.getAccountId();

        // Find Regulator reviewer
        Optional.ofNullable(authorityService.findStatusByUsers(List.of(reviewer)).get(reviewer)).ifPresent(reviewerStatus -> {
            if(AuthorityStatus.ACTIVE.equals(reviewerStatus)) {
                UserInfoDTO userReviewer = userAuthService.getUserByUserId(reviewer);
                recipientsEmails.add(userReviewer.getEmail());
            }
        });

        // Find Site Contact
        accountCaSiteContactService.findCASiteContactByAccount(accountId).ifPresent(siteContact -> {
            UserInfoDTO userSiteContact = userAuthService.getUserByUserId(siteContact);
            recipientsEmails.add(userSiteContact.getEmail());
        });

        // Send the emails
        if(!recipientsEmails.isEmpty()) {
            AccountInfoDTO accountInfoDTO = accountQueryService.getAccountInfoDTOById(accountId);

            EmailData notifyInfo = EmailData.builder()
                    .notificationTemplateData(EmailNotificationTemplateData.builder()
                            .templateName(templateName)
                            .templateParams(Map.of(
                                    NotificationTemplateConstants.ACCOUNT_NAME, accountInfoDTO.getName(),
                                    NotificationTemplateConstants.HOME_URL, webAppProperties.getUrl(),
                                    MrtmEmailNotificationTemplateConstants.EMITTER_ID, accountInfoDTO.getBusinessId()
                            ))
                            .build())
                    .build();

            notificationEmailService.notifyRecipients(notifyInfo, new ArrayList<>(recipientsEmails), List.of());
        }
    }
}
