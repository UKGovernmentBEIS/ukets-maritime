package uk.gov.mrtm.api.integration.external.aer.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderPayload;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StagingAer extends ThirdPartyDataProviderPayload {

    @Valid
    @NotNull
    private AerEmissions emissions;

    @Valid
    @NotNull
    private AerAggregatedData aggregatedData;

    @Valid
    @NotNull
    private AerSmf smf;
}