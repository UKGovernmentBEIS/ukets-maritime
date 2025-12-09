package uk.gov.mrtm.api.reporting.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedDataSave;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissionsSave;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortEmissionsSave;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmfSave;
import uk.gov.mrtm.api.reporting.domain.voyages.AerVoyageEmissionsSave;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AerSave {

    @Valid
    @NotNull
    private AerOperatorDetails operatorDetails;

    @Valid
    @NotNull
    private AdditionalDocuments additionalDocuments;

    @Valid
    @NotNull
    private AerEmissionsSave emissions;

    @Valid
    @NotNull
    private AerMonitoringPlanChanges aerMonitoringPlanChanges;

    @Valid
    private AerPortEmissionsSave portEmissions;

    @Valid
    private AerVoyageEmissionsSave voyageEmissions;

    @Valid
    @NotNull
    private AerAggregatedDataSave aggregatedData;

    @Valid
    @NotNull
    private AerSmfSave smf;
}
