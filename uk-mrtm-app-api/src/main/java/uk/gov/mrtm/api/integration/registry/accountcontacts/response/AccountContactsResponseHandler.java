package uk.gov.mrtm.api.integration.registry.accountcontacts.response;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmEmailNotificationTemplateConstants;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEvent;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEventOutcome;
import uk.gov.netz.integration.model.metscontacts.MetsContactsMessage;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.RESPONSE_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
public class AccountContactsResponseHandler {
    private static final String INTEGRATION_POINT_KEY = "Account contacts";

    private final MrtmAccountQueryService accountQueryService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final NotifyRegistryEmailService notifyRegistryEmailService;

    private final static List<IntegrationEventError> ACTION_ERRORS = List.of(
        IntegrationEventError.ERROR_0703
    );
    private final static List<IntegrationEventError> INFO_ERRORS = List.of(
        IntegrationEventError.ERROR_0701,
        IntegrationEventError.ERROR_0702);

    public void handleResponse(MetsContactsEventOutcome event, String correlationId) {
        String registryId = event.getEvent().getOperatorId();

        log.info("Received account contacts outcome with correlationId {}, registry ID {} and data {}",
            correlationId, registryId, event);

        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {

            List<IntegrationEventErrorDetails> errors = event.getErrors();

            if (!ObjectUtils.isEmpty(errors)) {
                Account account = accountQueryService.getAccountByRegistryId(Integer.valueOf(event.getEvent().getOperatorId()));
                String recipient = emailProperties.getEmail().get(account.getCompetentAuthority().getCode());
                Map<String, String> fields = getEventFields(event.getEvent());

                List<IntegrationEventErrorDetails> actionErrors = errors
                    .stream()
                    .filter(entry -> ACTION_ERRORS.contains(entry.getError()))
                    .toList();

                if (!actionErrors.isEmpty()) {
                    notifyRegistryEmailService.notifyRegulator(
                        NotifyRegistryEmailServiceParams.builder()
                            .account(account)
                            .emitterId(account.getBusinessId())
                            .correlationId(correlationId)
                            .errorsForMail(actionErrors)
                            .recipient(recipient)
                            .isFordway(false)
                            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_ACTION_TEMPLATE)
                            .integrationPoint(INTEGRATION_POINT_KEY)
                            .fields(fields)
                            .build());
                }

                List<IntegrationEventErrorDetails> infoErrors = errors
                    .stream()
                    .filter(entry -> INFO_ERRORS.contains(entry.getError()))
                    .toList();

                if (!infoErrors.isEmpty()) {
                    notifyRegistryEmailService.notifyRegulator(
                        NotifyRegistryEmailServiceParams.builder()
                            .account(account)
                            .emitterId(account.getBusinessId())
                            .correlationId(correlationId)
                            .errorsForMail(infoErrors)
                            .recipient(recipient)
                            .isFordway(false)
                            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE)
                            .integrationPoint(INTEGRATION_POINT_KEY)
                            .fields(fields)
                            .build());
                }

                log.info(RESPONSE_LOG_FORMAT,
                    SERVICE_KEY,
                    registryId,
                    INTEGRATION_POINT_KEY,
                    "Failed to process an request and notified regulator with errors " + event);
            } else {
                log.info(RESPONSE_LOG_FORMAT,
                    SERVICE_KEY,
                    registryId,
                    INTEGRATION_POINT_KEY,
                    "Failed to process an request, but received unknown error(s) " + event);
            }
        } else {
            log.info("Successfully updated account contacts with correlationId {} and registry ID {}",
                correlationId, registryId);
        }
    }

    private Map<String, String> getEventFields(MetsContactsEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.OPERATOR_ID, asStringOrEmpty(event.getOperatorId()) + "\r\n");

        for (MetsContactsMessage detail : event.getDetails()) {
            Map<String, String> operatorFields = new LinkedHashMap<>();
            operatorFields.put(MrtmEmailNotificationTemplateConstants.FIRST_NAME, asStringOrEmpty(detail.getFirstName()));
            operatorFields.put(MrtmEmailNotificationTemplateConstants.LAST_NAME, asStringOrEmpty(detail.getLastName()));
            operatorFields.put(MrtmEmailNotificationTemplateConstants.TELEPHONE_COUNTRY_CODE, asStringOrEmpty(detail.getTelephoneCountryCode()));
            operatorFields.put(MrtmEmailNotificationTemplateConstants.TELEPHONE_NUMBER, asStringOrEmpty(detail.getTelephoneNumber()));
            operatorFields.put(MrtmEmailNotificationTemplateConstants.MOBILE_PHONE_COUNTRY_CODE, asStringOrEmpty(detail.getMobilePhoneCountryCode()));
            operatorFields.put(MrtmEmailNotificationTemplateConstants.MOBILE_NUMBER, asStringOrEmpty(detail.getMobileNumber()));
            operatorFields.put(MrtmEmailNotificationTemplateConstants.USER_TYPE, asStringOrEmpty(detail.getUserType()));
            operatorFields.put(MrtmEmailNotificationTemplateConstants.CONTACT_TYPES, asStringOrEmpty(detail.getContactTypes()));

            fields.put(asStringOrEmpty(detail.getEmail()), operatorFields.toString());
        }
        return fields;
    }

}
