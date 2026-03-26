package uk.gov.mrtm.api.integration.registry.regulatornotice.response;

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
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEventOutcome;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.RESPONSE_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;
import static uk.gov.mrtm.api.integration.registry.common.PayloadFieldsUtils.asStringOrEmpty;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.regulator.notice.enabled", havingValue = "true")
public class RegulatorNoticeResponseHandler {
    private static final String INTEGRATION_POINT_KEY = "Regulator notice";

    private final MrtmAccountQueryService accountQueryService;
    private final RegistryIntegrationEmailProperties emailProperties;
    private final NotifyRegistryEmailService notifyRegistryEmailService;

    private final static List<IntegrationEventError> INFO_ERRORS = List.of(
        IntegrationEventError.ERROR_0601,
        IntegrationEventError.ERROR_0602,
        IntegrationEventError.ERROR_0604,
        IntegrationEventError.ERROR_0605
    );
    private final static List<IntegrationEventError> ACTION_ERRORS = List.of(
        IntegrationEventError.ERROR_0603
    );

    public void handleResponse(RegulatorNoticeEventOutcome event, String correlationId) {
        String registryId = event.getEvent().getRegistryId();

        log.info("Received regulator notice outcome with correlationId {}, registry ID {} and event type {}",
            correlationId, registryId, event.getEvent().getType());

        if (event.getOutcome() == IntegrationEventOutcome.ERROR) {

            List<IntegrationEventErrorDetails> errors = event.getErrors();

            if (!ObjectUtils.isEmpty(errors)) {
                Account account = accountQueryService.getAccountByRegistryId(Integer.valueOf(event.getEvent().getRegistryId()));
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
            log.info("Successfully send regulator notice with correlationId {} and registry ID {}",
                correlationId, registryId);
        }
    }

    private Map<String, String> getEventFields(RegulatorNoticeEvent event) {
        Map<String, String> fields = new LinkedHashMap<>();

        fields.put(PayloadFieldsUtils.REGISTRY_ID, asStringOrEmpty(event.getRegistryId()));
        fields.put(PayloadFieldsUtils.NOTIFICATION_TYPE, asStringOrEmpty(event.getType()));
        fields.put(PayloadFieldsUtils.FILE_NAME, asStringOrEmpty(event.getFileName()));

        return fields;
    }

}
