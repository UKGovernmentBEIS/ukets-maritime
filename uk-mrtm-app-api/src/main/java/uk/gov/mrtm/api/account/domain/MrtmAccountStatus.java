package uk.gov.mrtm.api.account.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;

@Getter
@AllArgsConstructor
public enum MrtmAccountStatus implements AccountStatus {

    NEW,
    LIVE,
    CLOSED,
    WITHDRAWN
    ;

    @Override
    public String getName() {
        return this.name();
    }
    
}