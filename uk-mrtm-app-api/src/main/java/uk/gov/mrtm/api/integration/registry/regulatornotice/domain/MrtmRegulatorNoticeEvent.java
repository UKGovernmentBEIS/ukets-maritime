package uk.gov.mrtm.api.integration.registry.regulatornotice.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MrtmRegulatorNoticeEvent {
    private Long accountId;
    private MrtmRegulatorNoticeNotificationType notificationType;
    private String fileName;
    private byte[] file;
}
