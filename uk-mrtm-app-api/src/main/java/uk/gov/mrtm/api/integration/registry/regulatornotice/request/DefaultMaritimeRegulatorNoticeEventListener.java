package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeEvent;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;

@RequiredArgsConstructor
@Component
@Log4j2
public class DefaultMaritimeRegulatorNoticeEventListener implements MaritimeRegulatorNoticeEventListenerResolver {

    @Override
    public RegulatorNoticeSubmittedEventDetails onRegulatorNoticeEvent(MrtmRegulatorNoticeEvent event) {
        log.info("Regulator notice integration point is disabled, skipping messaging registry..." + event);
        return RegulatorNoticeSubmittedEventDetails.builder().notifiedRegistry(false).build();
    }
}
