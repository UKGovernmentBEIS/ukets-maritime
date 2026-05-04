package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.account.domain.dto.AccountInfoDTO;
import uk.gov.netz.api.account.service.AccountQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.constants.NotificationTemplateWorkflowTaskType;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AerSubmissionWindowReminderDateReachedHandlerFlowable implements JavaDelegate {

    private final RequestService requestService;
    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final AccountQueryService accountQueryService;
    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @Override
    public void execute(DelegateExecution execution) {
        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);

        final Request request = requestService.findRequestById(requestId);

        // TODO remove exception and make it return in case contact not found.
        //  Update also AerSubmissionWindowReminderDateReachedHandler
        final UserInfoDTO accountPrimaryContact =
            requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));

        AerRequestMetadata requestMetadata = (AerRequestMetadata) request.getMetadata();

        final Long accountId = request.getAccountId();
        final AccountInfoDTO accountInfo = accountQueryService.getAccountInfoDTOById(accountId);

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(NotificationTemplateConstants.WORKFLOW, request.getType().getDescription());
        templateParams.put(NotificationTemplateConstants.WORKFLOW_TASK, NotificationTemplateWorkflowTaskType.getDescription(MrtmRequestType.AER));
        templateParams.put(NotificationTemplateConstants.WORKFLOW_EXPIRATION_TIME, "3 months");
        templateParams.put(NotificationTemplateConstants.WORKFLOW_USER, accountPrimaryContact.getFullName());
        templateParams.put(NotificationTemplateConstants.ACCOUNT_NAME, accountInfo.getName());
        templateParams.put(NotificationTemplateConstants.ACCOUNT_BUSINESS_ID, accountInfo.getBusinessId());
        templateParams.put(MrtmEmailNotificationTemplateConstants.AER_YEAR, requestMetadata.getYear());

        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .competentAuthority(request.getCompetentAuthority())
                .templateName(MrtmNotificationTemplateName.AER_SUBMISSION_WINDOW_EXPIRATION_REMINDER_TEMPLATE)
                .templateParams(templateParams)
                .build())
            .build();

        notificationEmailService.notifyRecipient(emailData, accountPrimaryContact.getEmail());
    }
}
