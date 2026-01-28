package uk.gov.mrtm.api.integration.registry.accountupdated.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountUpdatedSubmittedEventDetails {
    private boolean notifiedRegistry;
    private AccountUpdatingEvent data;
}
