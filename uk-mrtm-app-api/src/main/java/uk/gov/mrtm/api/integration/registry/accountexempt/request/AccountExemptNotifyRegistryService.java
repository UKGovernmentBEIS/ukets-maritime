package uk.gov.mrtm.api.integration.registry.accountexempt.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.registry.accountexempt.domain.AccountExemptEvent;
import uk.gov.netz.integration.model.exemption.AccountExemptionUpdateEvent;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.exempt.enabled", havingValue = "true")
public class AccountExemptNotifyRegistryService {

    private static final String INTEGRATION_POINT_KEY = "Account exempt";

    private final AccountExemptSendToRegistryProducer accountExemptSendToRegistryProducer;
    private final KafkaTemplate<String, AccountExemptionUpdateEvent> accountExemptKafkaTemplate;
    private final MrtmAccountQueryService mrtmAccountQueryService;

    public void notifyRegistry(AccountExemptEvent event) {
        MrtmAccount account = mrtmAccountQueryService.getAccountById(event.getAccountId());

        if (ObjectUtils.isEmpty(account.getRegistryId())) {
            log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, event.getAccountId(),
                INTEGRATION_POINT_KEY,
                "Cannot send exempt event to ETS Registry because Operator Id does not exist");

            return;
        }

        AccountExemptionUpdateEvent accountExemptionUpdateEvent = buildExemptionEvent(event, account.getRegistryId());

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, event.getAccountId(),
            INTEGRATION_POINT_KEY, "Sending exempt event sent to registry " + accountExemptionUpdateEvent);
        accountExemptSendToRegistryProducer.produce(accountExemptionUpdateEvent, accountExemptKafkaTemplate);
        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, event.getAccountId(),
            INTEGRATION_POINT_KEY, "Exempt event sent to registry " + accountExemptionUpdateEvent);

    }

    private AccountExemptionUpdateEvent buildExemptionEvent(AccountExemptEvent event, Integer registryId) {
        return AccountExemptionUpdateEvent.builder()
            .exemptionFlag(event.isExempt())
            .registryId(Long.valueOf(registryId))
            .reportingYear(event.getYear())
            .build();
    }
}
