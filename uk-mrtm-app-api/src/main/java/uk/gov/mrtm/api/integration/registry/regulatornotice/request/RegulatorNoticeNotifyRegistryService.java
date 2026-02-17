package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.constants.MrtmNotificationTemplateName;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailService;
import uk.gov.mrtm.api.integration.registry.common.NotifyRegistryEmailServiceParams;
import uk.gov.mrtm.api.integration.registry.common.RegistryIntegrationEmailProperties;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeEvent;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.regulator.notice.enabled", havingValue = "true")
public class RegulatorNoticeNotifyRegistryService {

    private static final String INTEGRATION_POINT_KEY = "Regulator notice";

    private final RegulatorNoticeSendToRegistryProducer regulatorNoticeSendToRegistryProducer;
    private final KafkaTemplate<String, RegulatorNoticeEvent> regulatorNoticeKafkaTemplate;
    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final NotifyRegistryEmailService notifyRegistryEmailService;
    private final RegistryIntegrationEmailProperties emailProperties;

    public RegulatorNoticeSubmittedEventDetails notifyRegistry(MrtmRegulatorNoticeEvent event) {
        MrtmAccount account = mrtmAccountQueryService.getAccountById(event.getAccountId());

        if (ObjectUtils.isEmpty(account.getRegistryId())) {
            notifyRegulator(account);
            return RegulatorNoticeSubmittedEventDetails.builder().notifiedRegistry(false).build();
        }

        RegulatorNoticeEvent regulatorNoticeEvent = getRegulatorNoticeEvent(account, event);

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getRegistryId(),
            INTEGRATION_POINT_KEY, "Sending regulator notice event to registry " + regulatorNoticeEvent);

        regulatorNoticeSendToRegistryProducer.produce(regulatorNoticeEvent, regulatorNoticeKafkaTemplate);

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getRegistryId(),
            INTEGRATION_POINT_KEY, "Regulator notice event sent to registry " + regulatorNoticeEvent);

        return RegulatorNoticeSubmittedEventDetails.builder().notifiedRegistry(true).data(regulatorNoticeEvent).build();
    }

    private void notifyRegulator(MrtmAccount account) {
        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getId(),
            INTEGRATION_POINT_KEY,
            "Cannot send regulator event to ETS Registry because Operator Id does not exist");

        String recipient = emailProperties.getEmail().get(account.getCompetentAuthority().getCode());

        notifyRegistryEmailService.notifyRegulator(
            NotifyRegistryEmailServiceParams.builder()
                .account(account)
                .emitterId(account.getBusinessId())
                .recipient(recipient)
                .isFordway(false)
                .templateName(MrtmNotificationTemplateName.REGISTRY_INTEGRATION_ACCOUNT_UPDATE_MISSING_REGISTRY_ID_TEMPLATE)
                .integrationPoint(INTEGRATION_POINT_KEY)
                .build()
        );
    }

    private RegulatorNoticeEvent getRegulatorNoticeEvent(MrtmAccount account, MrtmRegulatorNoticeEvent event) {
        return RegulatorNoticeEvent.builder()
            .registryId(String.valueOf(account.getRegistryId()))
            .fileName(event.getFileName())
            .fileData(event.getFile())
            .type(event.getNotificationType().getDescription())
            .build();
    }

}
