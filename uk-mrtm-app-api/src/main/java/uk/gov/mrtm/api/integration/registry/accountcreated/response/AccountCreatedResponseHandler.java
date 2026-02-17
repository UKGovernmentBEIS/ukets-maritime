package uk.gov.mrtm.api.integration.registry.accountcreated.response;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.account.AccountOpeningEvent;
import uk.gov.netz.integration.model.account.AccountOpeningEventOutcome;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.RESPONSE_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.created.enabled", havingValue = "true")
public class AccountCreatedResponseHandler {

    private static final String INTEGRATION_POINT_KEY = "Account Created";

    private final RegistryIntegrationEmailProperties emailProperties;
    private final MrtmAccountRepository accountRepository;
    private final NotifyRegistryEmailService notifyRegistryEmailService;

    public void handleResponse(AccountOpeningEventOutcome event, String correlationId) {
        log.info("Received account opening outcome with correlationId {} and data {}", correlationId, event);
        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {
            if (!ObjectUtils.isEmpty(event.getErrors())) {
                MrtmAccount account = accountRepository.findByBusinessId(event.getEvent().getAccountDetails().getEmitterId());
                String recipient = emailProperties.getEmail().get(account.getCompetentAuthority().getCode());
                Map<String, String> fields = getAccountOpeningFields(event.getEvent());

                final List<IntegrationEventErrorDetails> actionErrors = event.getErrors().stream()
                        .filter(errorDetails -> errorDetails.getError().equals(IntegrationEventError.ERROR_0106))
                        .toList();
                if (!ObjectUtils.isEmpty(actionErrors)) {
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
                            .fields(fields).build());
                }

                List<IntegrationEventErrorDetails> remainingErrors = event.getErrors()
                        .stream()
                        .filter(errorDetails -> !errorDetails.getError().equals(IntegrationEventError.ERROR_0106))
                        .toList();

                if (!ObjectUtils.isEmpty(remainingErrors)) {
                    notifyRegistryEmailService.notifyRegulator(
                        NotifyRegistryEmailServiceParams.builder()
                            .account(account)
                            .emitterId(account.getBusinessId())
                            .correlationId(correlationId)
                            .errorsForMail(remainingErrors)
                            .recipient(recipient)
                            .isFordway(false)
                            .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_RESPONSE_ERROR_INFO_TEMPLATE)
                            .integrationPoint(INTEGRATION_POINT_KEY)
                            .fields(fields)
                            .build());
                }

                log.info(RESPONSE_LOG_FORMAT,
                        SERVICE_KEY,
                        event.getEvent().getAccountDetails().getEmitterId(),
                        INTEGRATION_POINT_KEY,
                        "Failed to process a request and notified regulator with errors " + event);
            } else {
                log.info(RESPONSE_LOG_FORMAT,
                        SERVICE_KEY,
                        event.getEvent().getAccountDetails().getEmitterId(),
                        INTEGRATION_POINT_KEY,
                        "Failed to process a request, but received unknown error(s) " + event);
            }
        } else {
            log.info("Successfully created registry account with emitter ID: '{}'",
                event.getEvent().getAccountDetails().getEmitterId());
        }
    }

    private Map<String, String> getAccountOpeningFields(AccountOpeningEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        // account details
        fields.put(PayloadFieldsUtils.EMITTER_ID, asStringOrEmpty(event.getAccountDetails().getEmitterId()));
        fields.put(PayloadFieldsUtils.ACCOUNT_NAME, asStringOrEmpty(event.getAccountDetails().getAccountName()));
        fields.put(PayloadFieldsUtils.EMP_ID, asStringOrEmpty(event.getAccountDetails().getMonitoringPlanId()));
        fields.put(PayloadFieldsUtils.IMO_NUMBER, asStringOrEmpty(event.getAccountDetails().getCompanyImoNumber()));
        fields.put(PayloadFieldsUtils.REGULATOR, asStringOrEmpty(event.getAccountDetails().getRegulator()));
        fields.put(PayloadFieldsUtils.FIRST_YEAR_OF_VERIFIED_EMISSIONS, asStringOrEmpty(event.getAccountDetails().getFirstYearOfVerifiedEmissions()));
        //account holder
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_NAME, asStringOrEmpty(event.getAccountHolder().getName()));
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_TYPE, asStringOrEmpty(event.getAccountHolder().getAccountHolderType()));
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_1, asStringOrEmpty(event.getAccountHolder().getAddressLine1()));
        fields.put(PayloadFieldsUtils.ADDRESS_LINE_2, asStringOrEmpty(event.getAccountHolder().getAddressLine2()));
        fields.put(PayloadFieldsUtils.CITY, asStringOrEmpty(event.getAccountHolder().getTownOrCity()));
        fields.put(PayloadFieldsUtils.STATE, asStringOrEmpty(event.getAccountHolder().getStateOrProvince()));
        fields.put(PayloadFieldsUtils.COUNTRY, asStringOrEmpty(event.getAccountHolder().getCountry()));
        fields.put(PayloadFieldsUtils.POSTCODE, asStringOrEmpty(event.getAccountHolder().getPostalCode()));
        fields.put(PayloadFieldsUtils.CRN_NOT_EXIST, asStringOrEmpty(event.getAccountHolder().getCrnNotExist()));
        fields.put(PayloadFieldsUtils.CRN, asStringOrEmpty(event.getAccountHolder().getCompanyRegistrationNumber()));
        fields.put(PayloadFieldsUtils.CRN_JUSTIFICATION, asStringOrEmpty(event.getAccountHolder().getCrnJustification()));

        return fields;
    }
}
