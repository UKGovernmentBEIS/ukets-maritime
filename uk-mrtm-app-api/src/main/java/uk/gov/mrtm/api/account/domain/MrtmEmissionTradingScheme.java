package uk.gov.mrtm.api.account.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import uk.gov.netz.api.common.domain.EmissionTradingScheme;

@Getter
@AllArgsConstructor
public enum MrtmEmissionTradingScheme implements EmissionTradingScheme {

    UK_MARITIME_EMISSION_TRADING_SCHEME("Maritime");

    private final String description;

    @Override
    public String getName() {
        return this.name();
    }

}
