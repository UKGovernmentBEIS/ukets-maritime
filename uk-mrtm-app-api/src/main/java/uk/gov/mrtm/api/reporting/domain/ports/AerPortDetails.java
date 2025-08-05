package uk.gov.mrtm.api.reporting.domain.ports;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.common.AerEmissionsReductionData;
import uk.gov.netz.api.common.validation.SpELExpression;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@SpELExpression(expression = "{T(java.time.LocalDateTime).parse(#arrivalTime).isBefore(T(java.time.LocalDateTime).parse(#departureTime))}",
    message = "aer.port.details.arrival.and.departure.invalid")
@SpELExpression(expression = "{(#visit?.country eq 'GB')}", message = "aer.port.details.not.gb.country")
public class AerPortDetails extends AerEmissionsReductionData {

    @NotNull
    @Valid
    private AerPortVisit visit;
}
