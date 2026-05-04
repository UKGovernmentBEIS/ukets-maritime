package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeEvent;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;

@RequiredArgsConstructor
@Component
@ConditionalOnProperty(name = "registry.integration.regulator.notice.enabled", havingValue = "true")
@Primary
public class MaritimeRegulatorNoticeEventListener implements MaritimeRegulatorNoticeEventListenerResolver {

    private final RegulatorNoticeNotifyRegistryService notifyRegistryService;

    @Override
    public RegulatorNoticeSubmittedEventDetails onRegulatorNoticeEvent(MrtmRegulatorNoticeEvent event) {
        return notifyRegistryService.notifyRegistry(event);
    }
}
