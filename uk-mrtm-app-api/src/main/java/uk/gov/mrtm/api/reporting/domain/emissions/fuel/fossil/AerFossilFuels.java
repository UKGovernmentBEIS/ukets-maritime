package uk.gov.mrtm.api.reporting.domain.emissions.fuel.fossil;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.reporting.domain.emissions.fuel.AerFuelsAndEmissionsFactors;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@SpELExpression(expression = "{(" +
    "#type eq 'HFO' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('3.114')) == 0 " +

    ")||(" +

    "#type eq 'LFO' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('3.151')) == 0 " +

    ")||(" +

    "#type eq 'MDO' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('3.206')) == 0 " +

    ")||(" +

    "#type eq 'MGO' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('3.206')) == 0 " +

    ")||(" +

    "#type eq 'LNG' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('2.75')) == 0 " +

    ")||(" +

    "#type eq 'LPG_BUTANE' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('3.03')) == 0 " +

    ")||(" +

    "#type eq 'LPG_PROPANE' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('3')) == 0 " +

    ")||(" +

    "#type eq 'H2' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('0')) == 0 " +

    ")||(" +

    "#type eq 'NH3' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('0')) == 0 " +

    ")||(" +

    "#type eq 'METHANOL' " +
    "&& #carbonDioxide?.compareTo(new java.math.BigDecimal('1.375')) == 0 " +

    ")||(" +

    "#type eq 'OTHER'" +

    ")}",
    message = "emp.invalid.fossil.fuel.emissions")

@SpELExpression(expression = "{(#type eq 'OTHER') == (#name != null)}",
    message = "emp.invalid.fossil.fuel.emissions")
@NoArgsConstructor
public class AerFossilFuels extends AerFuelsAndEmissionsFactors {

    @NotNull
    private FossilFuelType type;

    @Override
    public String getTypeAsString() {
        return type.name();
    }

    @Override
    public String getLongDescription() {
        if (type == FossilFuelType.OTHER) {
            return getOrigin().getDescription() + "/ Other Fossil Fuel/ " + getName();
        } else {
            return getOrigin().getDescription() + "/ " + getType().getDescription();
        }
    }
}

