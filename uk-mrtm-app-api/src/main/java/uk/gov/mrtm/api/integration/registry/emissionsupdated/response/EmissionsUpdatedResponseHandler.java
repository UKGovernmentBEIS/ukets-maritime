package uk.gov.mrtm.api.integration.registry.emissionsupdated.response;

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
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEventOutcome;
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
@ConditionalOnProperty(name = "registry.integration.emissions.updated.enabled", havingValue = "true", matchIfMissing = false)
public class EmissionsUpdatedResponseHandler {
    private static final String INTEGRATION_POINT_KEY = "Update emissions value";

    private final MrtmAccountQueryService accountQueryService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final NotifyRegistryEmailService notifyRegistryEmailService;

    public void handleResponse(AccountEmissionsUpdateEventOutcome event, String correlationId) {
        log.info("Received emission update outcome with correlationId {}, registry ID {} and data {}",
            correlationId, event.getEvent() != null ? event.getEvent().getRegistryId() : null, event);
        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {

            List<IntegrationEventErrorDetails> errorsForMail = event.getErrors().stream().map(
                integrationEventError -> IntegrationEventErrorDetails.builder().error(integrationEventError).build())
                .toList();

            if (!ObjectUtils.isEmpty(errorsForMail)) {

                List<IntegrationEventErrorDetails> actionErrors = errorsForMail
                    .stream()
                    .filter(entry -> entry.getError().equals(IntegrationEventError.ERROR_0803))
                    .toList();
                Account account = accountQueryService.getAccountByRegistryId(event.getEvent().getRegistryId().intValue());
                String recipient = emailProperties.getEmail().get(account.getCompetentAuthority().getCode());
                Map<String, String> fields = getEventFields(event.getEvent());
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

                List<IntegrationEventErrorDetails> infoErrors = errorsForMail
                    .stream()
                    .filter(entry -> !entry.getError().equals(IntegrationEventError.ERROR_0803))
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

    private Map<String, String> getEventFields(AccountEmissionsUpdateEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.REGISTRY_ID, asStringOrEmpty(event.getRegistryId()));
        fields.put(PayloadFieldsUtils.EMISSIONS, asStringOrEmpty(event.getReportableEmissions()));
        fields.put(PayloadFieldsUtils.YEAR, asStringOrEmpty(event.getReportingYear()));

        return fields;
    }

}
