package uk.gov.mrtm.api.integration.registry.emissionsupdated.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportableEmissionsUpdatedSubmittedEventDetails {
    private boolean notifiedRegistry;
    private AccountEmissionsUpdateEvent data;
}
