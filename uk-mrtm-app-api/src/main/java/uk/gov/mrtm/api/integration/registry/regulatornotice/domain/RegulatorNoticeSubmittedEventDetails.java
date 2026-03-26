package uk.gov.mrtm.api.integration.registry.regulatornotice.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegulatorNoticeSubmittedEventDetails {
    private boolean notifiedRegistry;
    private RegulatorNoticeEvent data;
}
