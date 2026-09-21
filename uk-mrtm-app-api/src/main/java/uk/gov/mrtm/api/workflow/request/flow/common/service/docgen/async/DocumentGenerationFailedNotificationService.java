package uk.gov.mrtm.api.workflow.request.flow.common.service.docgen.async;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.account.domain.dto.AccountInfoDTO;
import uk.gov.netz.api.account.service.AccountQueryService;
import uk.gov.netz.api.common.config.WebAppProperties;
import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName.DOCUMENT_GENERATION_FAILED_TEMPLATE;

@Log4j2
@Service
@RequiredArgsConstructor
public class DocumentGenerationFailedNotificationService {

	private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
	private final AccountQueryService accountQueryService;
	private final WebAppProperties webAppProperties;
	private final UserAuthService userAuthService;
	private final CompetentAuthorityService competentAuthorityService;

	@Transactional
	public void notifyRegulator(RequestTask requestTask) {
		Request request = requestTask.getRequest();
		AccountInfoDTO accountInfoDTO = accountQueryService.getAccountInfoDTOById(request.getAccountId());
		UserInfoDTO userInfoDTO = userAuthService.getUserByUserId(requestTask.getAssignee());
		CompetentAuthorityDTO competentAuthority = competentAuthorityService.getCompetentAuthorityDTO(request.getCompetentAuthority());

		EmailData<EmailNotificationTemplateData> notifyInfo = EmailData.builder()
			.notificationTemplateData(EmailNotificationTemplateData.builder()
				.templateName(DOCUMENT_GENERATION_FAILED_TEMPLATE)
				.templateParams(Map.of(
					NotificationTemplateConstants.HOME_URL, webAppProperties.getUrl(),
					NotificationTemplateConstants.ACCOUNT_NAME, accountInfoDTO.getName(),
					NotificationTemplateConstants.ACCOUNT_BUSINESS_ID, accountInfoDTO.getBusinessId(),
					NotificationTemplateConstants.WORKFLOW_ID, request.getId(),
					NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL, competentAuthority.getEmail(),
					NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME, competentAuthority.getName()
					))
				.build())
			.build();

		notificationEmailService.notifyRecipients(notifyInfo, List.of(userInfoDTO.getEmail()));
    }
}
