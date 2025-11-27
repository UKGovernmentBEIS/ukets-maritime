package uk.gov.mrtm.api.integration.external.emp.enums;

import lombok.Getter;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;

public enum ExternalFuelType {

    // Bio
    ETHANOL(FuelOrigin.BIOFUEL),
    BIO_DIESEL(FuelOrigin.BIOFUEL),
    HVO(FuelOrigin.BIOFUEL),
    BIO_LNG(FuelOrigin.BIOFUEL),
    BIO_METHANOL(FuelOrigin.BIOFUEL),
    BIO_H2(FuelOrigin.BIOFUEL),

    // Fossil
    HFO(FuelOrigin.FOSSIL),
    LFO(FuelOrigin.FOSSIL),
    MDO(FuelOrigin.FOSSIL),
    MGO(FuelOrigin.FOSSIL),
    LNG(FuelOrigin.FOSSIL),
    LPG_BUTANE(FuelOrigin.FOSSIL),
    LPG_PROPANE(FuelOrigin.FOSSIL),
    H2(FuelOrigin.FOSSIL),
    NH3(FuelOrigin.FOSSIL),
    METHANOL(FuelOrigin.FOSSIL),

    // E-fuels (RFNBO)
    E_DIESEL(FuelOrigin.RFNBO),
    E_METHANOL(FuelOrigin.RFNBO),
    E_LNG(FuelOrigin.RFNBO),
    E_H2(FuelOrigin.RFNBO),
    E_NH3(FuelOrigin.RFNBO),
    E_LPG(FuelOrigin.RFNBO),
    E_DME(FuelOrigin.RFNBO),

    // Other
    OTHER;

    ExternalFuelType() {}

    ExternalFuelType(FuelOrigin  fuelOriginCode) {
        this.fuelOriginCode = fuelOriginCode;
    }

    @Getter
    private FuelOrigin fuelOriginCode;

    public static boolean validateFuelOrigin(ExternalFuelType fuelTypeCode, FuelOrigin fuelOriginCode) {
        return fuelTypeCode.equals(OTHER) || fuelTypeCode.getFuelOriginCode() == fuelOriginCode;
    }
}
