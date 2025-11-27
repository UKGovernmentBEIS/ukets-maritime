package uk.gov.mrtm.api.integration.external.common.mapper;

import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.FuelOriginTypeName;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.MethaneSlipValueType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelOriginTypeName;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpUncertaintyLevel;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ExternalCommonMapper {

    private final Map<String, UUID> fuelTypeUuids = new HashMap<>();

    public FuelOriginTypeName toFuelOriginTypeName(ExternalEmpFuelOriginTypeName fuelOriginTypeName) {
        UUID fuelTypeUuid = getFuelTypeUuids(fuelOriginTypeName.getFuelTypeCode(), fuelOriginTypeName.getOtherFuelType());

        return switch (fuelOriginTypeName.getFuelOriginCode()) {
            case FuelOrigin.BIOFUEL -> FuelOriginBiofuelTypeName.builder()
                .origin(fuelOriginTypeName.getFuelOriginCode())
                .type(BioFuelType.valueOf(fuelOriginTypeName.getFuelTypeCode().name()))
                .name(fuelOriginTypeName.getOtherFuelType())
                .methaneSlip(fuelOriginTypeName.getSlipPercentage())
                .methaneSlipValueType(getMethaneSlipValueType(fuelOriginTypeName.getSlipPercentage()))
                .uniqueIdentifier(fuelTypeUuid)
                .build();
            case FuelOrigin.RFNBO -> FuelOriginEFuelTypeName.builder()
                .origin(fuelOriginTypeName.getFuelOriginCode())
                .type(EFuelType.valueOf(fuelOriginTypeName.getFuelTypeCode().name()))
                .name(fuelOriginTypeName.getOtherFuelType())
                .methaneSlip(fuelOriginTypeName.getSlipPercentage())
                .methaneSlipValueType(getMethaneSlipValueType(fuelOriginTypeName.getSlipPercentage()))
                .uniqueIdentifier(fuelTypeUuid)
                .build();
            case FuelOrigin.FOSSIL -> FuelOriginFossilTypeName.builder()
                .origin(fuelOriginTypeName.getFuelOriginCode())
                .type(FossilFuelType.valueOf(fuelOriginTypeName.getFuelTypeCode().name()))
                .name(fuelOriginTypeName.getOtherFuelType())
                .methaneSlip(fuelOriginTypeName.getSlipPercentage())
                .methaneSlipValueType(getMethaneSlipValueType(fuelOriginTypeName.getSlipPercentage()))
                .uniqueIdentifier(fuelTypeUuid)
                .build();
        };
    }

    public void createFuelTypeUuids(ExternalFuelType fuelTypeCode, String otherFuelType) {
        if (ExternalFuelType.OTHER.equals(fuelTypeCode)) {
            fuelTypeUuids.put(otherFuelType, UUID.randomUUID());
        } else {
            fuelTypeUuids.put(fuelTypeCode.name(), UUID.randomUUID());
        }
    }

    public UUID getFuelTypeUuids(ExternalFuelType fuelTypeCode, String otherFuelType) {
        UUID uuid;
        if (ExternalFuelType.OTHER.equals(fuelTypeCode)) {
            uuid = fuelTypeUuids.get(otherFuelType);
        } else {
            uuid = fuelTypeUuids.get(fuelTypeCode.name());
        }

        return uuid == null ? UUID.randomUUID() : uuid;
    }

    public UncertaintyLevel toUncertaintyLevel(ExternalEmpUncertaintyLevel level) {
        return UncertaintyLevel.builder()
            .methodApproach(level.getLevelOfUncertaintyTypeCode())
            .monitoringMethod(level.getMonitoringMethodCode())
            .value(level.getShipSpecificUncertainty())
            .build();
    }

    private MethaneSlipValueType getMethaneSlipValueType(BigDecimal slipPercentage) {
        if (slipPercentage == null) {
            return null;
        }

        List<BigDecimal> preselectedValues = List.of(
            new BigDecimal("0"),
            new BigDecimal("3.1"),
            new BigDecimal("1.7"),
            new BigDecimal("0.2"),
            new BigDecimal("2.6")
        );

        boolean isPreselected = preselectedValues.stream().anyMatch(value -> value.compareTo(slipPercentage) == 0);

        return isPreselected ? MethaneSlipValueType.PRESELECTED : MethaneSlipValueType.OTHER;
    }
}
