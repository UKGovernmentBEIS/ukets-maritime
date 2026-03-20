package uk.gov.mrtm.api.integration.registry.accountupdated.response;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.integration.model.IntegrationEventOutcome;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;
import uk.gov.netz.integration.model.account.AccountUpdatingEventOutcome;
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
@ConditionalOnProperty(name = "registry.integration.account.updated.enabled", havingValue = "true")
public class AccountUpdatedResponseHandler {
    private static final String INTEGRATION_POINT_KEY = "Account updated";

    private final MrtmAccountQueryService accountQueryService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final NotifyRegistryEmailService notifyRegistryEmailService;

    private final static List<IntegrationEventError> ACTION_ERRORS = List.of(
        IntegrationEventError.ERROR_0306,
        IntegrationEventError.ERROR_0311,
        IntegrationEventError.ERROR_0313,
        IntegrationEventError.ERROR_0314,
        IntegrationEventError.ERROR_0315,
        IntegrationEventError.ERROR_0317
    );
    private final static List<IntegrationEventError> INFO_ERRORS = List.of(
        IntegrationEventError.ERROR_0301,
        IntegrationEventError.ERROR_0303,
        IntegrationEventError.ERROR_0304,
        IntegrationEventError.ERROR_0307,
        IntegrationEventError.ERROR_0308,
        IntegrationEventError.ERROR_0309,
        IntegrationEventError.ERROR_0310,
        IntegrationEventError.ERROR_0312,
        IntegrationEventError.ERROR_0316,
        IntegrationEventError.ERROR_0318,
        IntegrationEventError.ERROR_0319);

    public void handleResponse(AccountUpdatingEventOutcome event, String correlationId) {
        String registryId = event.getEvent().getAccountDetails().getRegistryId();

        log.info("Received account update outcome with correlationId {}, registry ID {} and data {}",
            correlationId, registryId, event);

        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {

            List<IntegrationEventErrorDetails> errors = event.getErrors();

            if (!ObjectUtils.isEmpty(errors)) {
                Account account = accountQueryService.getAccountByRegistryId(Integer.valueOf(event.getEvent().getAccountDetails().getRegistryId()));
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
                            .fields(fields).build());
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
                            .fields(fields).build());
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
            log.info("Successfully updated account with correlationId {} and registry ID {}",
                correlationId, registryId);
        }
    }

    private Map<String, String> getEventFields(AccountUpdatingEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.ACCOUNT_TYPE, asStringOrEmpty(event.getAccountDetails().getAccountType()));
        fields.put(PayloadFieldsUtils.REGISTRY_ID, asStringOrEmpty(event.getAccountDetails().getRegistryId()));
        fields.put(PayloadFieldsUtils.ACCOUNT_NAME, asStringOrEmpty(event.getAccountDetails().getAccountName()));
        fields.put(PayloadFieldsUtils.EMP_ID, asStringOrEmpty(event.getAccountDetails().getMonitoringPlanId()));
        fields.put(PayloadFieldsUtils.IMO_NUMBER, asStringOrEmpty(event.getAccountDetails().getCompanyImoNumber()));
        fields.put(PayloadFieldsUtils.FIRST_YEAR_OF_VERIFIED_EMISSIONS, asStringOrEmpty(event.getAccountDetails().getFirstYearOfVerifiedEmissions()));

        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_TYPE, asStringOrEmpty(event.getAccountHolder().getAccountHolderType()));
        fields.put(PayloadFieldsUtils.ACCOUNT_HOLDER_NAME, asStringOrEmpty(event.getAccountHolder().getName()));
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
