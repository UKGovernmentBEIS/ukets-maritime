package uk.gov.mrtm.api.reporting.domain.emissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SpELExpression(expression = "{(#allYear && #from == null && #to == null) " +
    "|| (!#allYear && #from != null && #to != null && T(java.time.LocalDate).parse(#from).isBefore(T(java.time.LocalDate).parse(#to)))}",
    message = "aer.ship.details.all.year.exist")
@SpELExpression(expression = "{(#hasIceClassDerogation == null) == ((#iceClass eq 'IC') OR (#iceClass eq 'IB') OR (#iceClass eq 'NA'))}", message = "aer.ship.details.ice.class.derogation.invalid")
public class AerShipDetails extends ShipDetails {

    private boolean allYear;

    private Boolean hasIceClassDerogation;

    private LocalDate from;

    private LocalDate to;
}
