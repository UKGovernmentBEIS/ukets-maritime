package uk.gov.mrtm.api.integration.registry.common;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotifyRegistryEmailServiceTest {

    @InjectMocks
    private NotifyRegistryEmailService service;

    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    @Test
    void notifyRegulator() {
        String name = "account-name";
        Account account = MrtmAccount.builder().name(name).build();
        String emitterId = "emitterId";
        String correlationId = "correlationId";
        List<IntegrationEventErrorDetails> errorsForMail = List.of(mock(IntegrationEventErrorDetails.class));
        String recipient = "recipient";
        boolean isFordway = true;
        String templateName = "templateName";
        String integrationPoint = "integrationPoint";
        Map<String, String> fields = Map.of("a", "b");

        service.notifyRegulator(
            NotifyRegistryEmailServiceParams.builder()
                .account(account)
                .emitterId(emitterId)
                .correlationId(correlationId)
                .errorsForMail(errorsForMail)
                .recipient(recipient)
                .isFordway(isFordway)
                .templateName(templateName)
                .integrationPoint(integrationPoint)
                .fields(fields)
                .build()
        );

        final EmailData<EmailNotificationTemplateData> emailData = getEmailNotificationTemplateDataEmailData(
            errorsForMail, name, correlationId, isFordway);

        verify(notificationEmailService).notifyRecipient(emailData, recipient);
    }

    @Test
    void notifyRegulator_when_account_is_null() {
        String emitterId = "emitterId";
        String correlationId = "correlationId";
        List<IntegrationEventErrorDetails> errorsForMail = List.of(mock(IntegrationEventErrorDetails.class));
        String recipient = "recipient";
        boolean isFordway = true;
        String templateName = "templateName";
        String integrationPoint = "integrationPoint";
        Map<String, String> fields = Map.of("a", "b");

        service.notifyRegulator(
            NotifyRegistryEmailServiceParams.builder()
                .emitterId(emitterId)
                .errorsForMail(errorsForMail)
                .recipient(recipient)
                .isFordway(isFordway)
                .templateName(templateName)
                .integrationPoint(integrationPoint)
                .fields(fields)
                .build()
        );

        final EmailData<EmailNotificationTemplateData> emailData = getEmailNotificationTemplateDataEmailData(
            errorsForMail, "[empty]", "[empty]", isFordway);

        verify(notificationEmailService).notifyRecipient(emailData, recipient);
    }

    private EmailData<EmailNotificationTemplateData> getEmailNotificationTemplateDataEmailData(
        List<IntegrationEventErrorDetails> errorsForMail, String accountName, String correlationId, boolean isFordway) {

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, "emitterId");
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, errorsForMail);
        templateParams.put(MrtmEmailNotificationTemplateConstants.FIELDS, Map.of("a", "b"));
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, correlationId);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, "Maritime");
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, accountName);
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, "integrationPoint");
        templateParams.put(MrtmEmailNotificationTemplateConstants.IS_FOR_FORDWAY, isFordway);

        return EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName("templateName")
                .templateParams(templateParams)
                .build())
            .build();
    }
}