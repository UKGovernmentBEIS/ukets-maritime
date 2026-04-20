package uk.gov.mrtm.api.integration.external.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThirdPartyDataProviderDTO {

    private String providerName;

    private LocalDateTime receivedOn;

    private LocalDateTime importedOn;

    private ThirdPartyDataProviderPayload payload;
}
