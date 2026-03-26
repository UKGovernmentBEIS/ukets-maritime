package uk.gov.mrtm.api.integration.registry.accountexempt.response;

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
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEvent;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEventOutcome;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.RESPONSE_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.exempt.enabled", havingValue = "true")
public class AccountExemptResponseHandler {
    private static final String INTEGRATION_POINT_KEY = "Account exempt";

    private final MrtmAccountQueryService accountQueryService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final NotifyRegistryEmailService notifyRegistryEmailService;

    private final static List<IntegrationEventError> INFO_ERRORS = List.of(
        IntegrationEventError.ERROR_0401,
        IntegrationEventError.ERROR_0402
    );
    private final static List<IntegrationEventError> ACTION_ERRORS = List.of(
        IntegrationEventError.ERROR_0403,
        IntegrationEventError.ERROR_0404,
        IntegrationEventError.ERROR_0405,
        IntegrationEventError.ERROR_0406,
        IntegrationEventError.ERROR_0407
    );
    private final static List<IntegrationEventError> FORD_WAY_ACTION_ERRORS = List.of(
        IntegrationEventError.ERROR_0401
    );

    public void handleResponse(AccountExemptionUpdateEventOutcome event, String correlationId) {
        Long registryId = event.getEvent().getRegistryId();

        log.info("Received account exempt outcome with correlationId {}, registry ID {} and data {}",
            correlationId, registryId, event);

        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {

            List<IntegrationEventErrorDetails> errors = event.getErrors();

            if (!ObjectUtils.isEmpty(errors)) {
                Account account = accountQueryService.getAccountByRegistryId(event.getEvent().getRegistryId().intValue());
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

                List<IntegrationEventErrorDetails> fordWayActionErrors = errors
                    .stream()
                    .filter(entry -> FORD_WAY_ACTION_ERRORS.contains(entry.getError()))
                    .toList();

                if (!fordWayActionErrors.isEmpty()) {
                    notifyRegistryEmailService.notifyRegulator(
                        NotifyRegistryEmailServiceParams.builder()
                            .account(account)
                            .emitterId(account.getBusinessId())
                            .correlationId(correlationId)
                            .errorsForMail(fordWayActionErrors)
                            .recipient(emailProperties.getFordway())
                            .isFordway(true)
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
            log.info("Successfully send account exempt event with correlationId {} and registry ID {}",
                correlationId, registryId);
        }
    }

    private Map<String, String> getEventFields(AccountExemptionUpdateEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.REGISTRY_ID, asStringOrEmpty(event.getRegistryId()));
        fields.put(PayloadFieldsUtils.YEAR, asStringOrEmpty(event.getReportingYear()));
        fields.put(PayloadFieldsUtils.EXEMPTION_FLAG, asStringOrEmpty(event.getExemptionFlag()));

        return fields;
    }

}
