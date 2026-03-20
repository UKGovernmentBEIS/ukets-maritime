package uk.gov.mrtm.api.integration.registry.regulatornotice.request;

import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeEvent;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;

public interface MaritimeRegulatorNoticeEventListenerResolver {

    RegulatorNoticeSubmittedEventDetails onRegulatorNoticeEvent(MrtmRegulatorNoticeEvent event);
}
