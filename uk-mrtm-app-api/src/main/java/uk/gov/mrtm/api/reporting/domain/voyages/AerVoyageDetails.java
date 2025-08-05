package uk.gov.mrtm.api.reporting.domain.voyages;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.common.AerEmissionsReductionData;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.netz.api.common.validation.SpELExpression;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{T(java.time.LocalDateTime).parse(#departureTime).isBefore(T(java.time.LocalDateTime).parse(#arrivalTime))}",
    message = "aer.voyage.details.arrival.and.departure.invalid")
public class AerVoyageDetails extends AerEmissionsReductionData {

    @NotNull
    @Valid
    private AerPortVisit arrivalPort;

    @NotNull
    @Valid
    private AerPortVisit departurePort;
}
