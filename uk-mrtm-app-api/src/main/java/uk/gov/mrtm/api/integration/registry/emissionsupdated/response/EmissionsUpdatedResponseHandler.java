package uk.gov.mrtm.api.integration.registry.emissionsupdated.response;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.RESPONSE_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.capitalizeFirstLetter;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.emissions.updated.enabled", havingValue = "true", matchIfMissing = false)
public class EmissionsUpdatedResponseHandler {
    private static final String INTEGRATION_POINT_KEY = "Update emissions value";

    private final MrtmAccountQueryService accountQueryService;
    private final NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    private final RegistryIntegrationEmailProperties emailProperties;

    public void handleResponse(AccountEmissionsUpdateEventOutcome event, String correlationId) {
        log.info("Received emission update outcome with correlationId {} and registry ID {}",
            correlationId, event.getEvent() != null ? event.getEvent().getRegistryId() : null);
        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {

            List<IntegrationEventErrorDetails> errorsForMail = event.getErrors().stream().map(
                integrationEventError -> IntegrationEventErrorDetails.builder().error(integrationEventError).build())
                .collect(Collectors.toList());

            if (!ObjectUtils.isEmpty(errorsForMail)) {

                List<IntegrationEventErrorDetails> actionErrors = errorsForMail
                    .stream()
                    .filter(entry -> entry.getError().equals(IntegrationEventError.ERROR_0803))
                    .collect(Collectors.toList());

                if (!actionErrors.isEmpty()) {
                    notifyRegulator(event, correlationId,
                        actionErrors,
                        MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE);
                }

                List<IntegrationEventErrorDetails> infoErrors = errorsForMail
                    .stream()
                    .filter(entry -> !entry.getError().equals(IntegrationEventError.ERROR_0803))
                    .collect(Collectors.toList());

                if (!infoErrors.isEmpty()) {
                    notifyRegulator(event, correlationId, infoErrors,
                        MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE);
                }

                log.info(RESPONSE_LOG_FORMAT,
                    SERVICE_KEY,
                    event.getEvent().getRegistryId(),
                    INTEGRATION_POINT_KEY,
                    "Failed to process an request and notified regulator with errors " + event);
            } else {
                log.info(RESPONSE_LOG_FORMAT,
                    SERVICE_KEY,
                    event.getEvent().getRegistryId(),
                    INTEGRATION_POINT_KEY,
                    "Failed to process an request, but received unknown error(s) " + event);
            }
        } else {
            log.info("Successfully updated emissions on account with correlationId {} and registry ID {}",
                correlationId, event.getEvent() != null ? event.getEvent().getRegistryId() : null);
        }
    }

    private void notifyRegulator(AccountEmissionsUpdateEventOutcome event, String correlationId,
                                 List<IntegrationEventErrorDetails> integrationEventErrorDetails, String templateName) {

        Account account = accountQueryService.getAccountByRegistryId(event.getEvent().getRegistryId().intValue());
        String recipient = emailProperties.getEmail().get(account.getCompetentAuthority().getCode());

        final Map<String, Object> templateParams = new HashMap<>();
        templateParams.put(MrtmEmailNotificationTemplateConstants.EMITTER_ID, account.getBusinessId());
        templateParams.put(MrtmEmailNotificationTemplateConstants.ERRORS, integrationEventErrorDetails);
        templateParams.put(MrtmEmailNotificationTemplateConstants.CORRELATION_ID, correlationId);
        templateParams.put(MrtmEmailNotificationTemplateConstants.SOURCE_SYSTEM, capitalizeFirstLetter(SERVICE_KEY));
        templateParams.put(MrtmEmailNotificationTemplateConstants.OPERATOR_NAME, account.getName());
        templateParams.put(MrtmEmailNotificationTemplateConstants.INTEGRATION_POINT, INTEGRATION_POINT_KEY);
        templateParams.put(MrtmEmailNotificationTemplateConstants.FIELDS, getEventFields(event.getEvent()));

        final EmailData<EmailNotificationTemplateData> emailData = EmailData.builder()
            .notificationTemplateData(EmailNotificationTemplateData.builder()
                .templateName(templateName)
                .templateParams(templateParams)
                .build())
            .build();
        notificationEmailService.notifyRecipient(emailData, recipient);
    }

    private Map<String, String> getEventFields(AccountEmissionsUpdateEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.REGISTRY_ID, asStringOrEmpty(event.getRegistryId()));
        fields.put(PayloadFieldsUtils.EMISSIONS, asStringOrEmpty(event.getReportableEmissions()));
        fields.put(PayloadFieldsUtils.YEAR, asStringOrEmpty(event.getReportingYear()));

        return fields;
    }

}
