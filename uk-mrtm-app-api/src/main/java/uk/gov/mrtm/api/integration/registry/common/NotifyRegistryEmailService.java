package uk.gov.mrtm.api.integration.registry.common;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;

import java.util.HashMap;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.capitalizeFirstLetter;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@Service
@RequiredArgsConstructor
public class NotifyRegistryEmailService {

    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;

    public void notifyRegulator(NotifyRegistryEmailServiceParams params) {

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, asStringOrEmpty(params.getEmitterId()));
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, params.getErrorsForMail());
        templateParams.put(MrtmEmailNotificationTemplateConstants.FIELDS, params.getFields());
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, asStringOrEmpty(params.getCorrelationId()));
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, capitalizeFirstLetter(SERVICE_KEY));
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME,
            asStringOrEmpty(params.getAccount() != null ? params.getAccount().getName(): null));
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, params.getIntegrationPoint());
        templateParams.put(MrtmEmailNotificationTemplateConstants.IS_FOR_FORDWAY, params.isFordway());


        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(params.getTemplateName())
                .templateParams(templateParams)
                .build())
            .build();
        notificationEmailService.notifyRecipient(emailData, params.getRecipient());
    }
}
