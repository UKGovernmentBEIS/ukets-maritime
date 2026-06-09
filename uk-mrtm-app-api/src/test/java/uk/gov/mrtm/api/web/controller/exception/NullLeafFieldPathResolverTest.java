package uk.gov.mrtm.api.web.controller.exception;

import org.junit.jupiter.api.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpShipDetails;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpShipEmissions;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class NullLeafFieldPathResolverTest {

    private static final String COMPANY_NATURE_FIELD = "shipParticulars[].shipDetails.companyNature";
    private static final String BUNKER_CODE_FIELD = "shipParticulars[].fuelTypes[].methodDensityBunkerCode";

    @Test
    void resolve_companyNatureNullOnFirstShip_returnsIndexedPath() {
        ExternalEmissionsMonitoringPlan plan = planWithShips(shipWithCompanyNature(null));

        assertResolvedNullLeaf(plan, COMPANY_NATURE_FIELD, "shipParticulars[0].shipDetails.companyNature");
    }

    @Test
    void resolve_companyNatureNullOnSecondShip_returnsIndexedSecondShipPath() {
        ExternalEmissionsMonitoringPlan plan = planWithShips(
            shipWithCompanyNature("1234567", ReportingResponsibilityNature.ISM_COMPANY),
            shipWithCompanyNature("7654321", null));

        assertResolvedNullLeaf(plan, COMPANY_NATURE_FIELD, "shipParticulars[1].shipDetails.companyNature");
    }

    @Test
    void resolve_companyNatureNullOnBothShips_returnsDistinctIndexesForEachFieldError() {
        ExternalEmissionsMonitoringPlan plan = planWithShips(
            shipWithCompanyNature("1234567", null),
            shipWithCompanyNature("7654321", null));

        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(plan, "externalEmissionsMonitoringPlan");
        FieldError firstError = notNullFieldError(COMPANY_NATURE_FIELD);
        FieldError secondError = notNullFieldError(COMPANY_NATURE_FIELD);

        Map<String, Integer> occurrenceCounts = new HashMap<>();
        String firstPath = NullLeafFieldPathResolver.resolve(firstError, bindingResult, occurrenceCounts);
        String secondPath = NullLeafFieldPathResolver.resolve(secondError, bindingResult, occurrenceCounts);

        assertThat(firstPath).isEqualTo("shipParticulars[0].shipDetails.companyNature");
        assertThat(secondPath).isEqualTo("shipParticulars[1].shipDetails.companyNature");
    }

    @Test
    void resolve_nestedFuelBunkerCodeNullOnSecondFuel_returnsIndexedPath() {
        ExternalEmpFuelsAndEmissionsFactors firstFuel = validFuelBuilder()
            .methodDensityBunkerCode(DensityMethodBunker.LABORATORY_TEST)
            .build();
        ExternalEmpFuelsAndEmissionsFactors secondFuel = validFuelBuilder()
            .methodDensityBunkerCode(null)
            .build();

        ExternalEmissionsMonitoringPlan plan = planWithShips(shipWithFuels(firstFuel, secondFuel));

        assertResolvedNullLeaf(plan, BUNKER_CODE_FIELD, "shipParticulars[0].fuelTypes[1].methodDensityBunkerCode");
    }

    @Test
    void resolve_notNullViolationOnEmptyGraph_fallsBackToSpringField() {
        FieldError fieldError = notNullFieldError(COMPANY_NATURE_FIELD);

        String resolved = NullLeafFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(new ExternalEmissionsMonitoringPlan(), "externalEmissionsMonitoringPlan"),
            new HashMap<>());

        assertThat(resolved).isEqualTo(COMPANY_NATURE_FIELD);
    }

    @Test
    void resolve_nonNotNullCodeWithNullRejectedValue_fallsBackToSpringField() {
        FieldError fieldError = new FieldError(
            "externalEmissionsMonitoringPlan",
            "shipParticulars[].fuelTypes[]",
            null,
            false,
            new String[] {"SpELExpression"},
            null,
            "constraint message");

        String resolved = NullLeafFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(planWithShips(shipWithFuels(validFuelBuilder().build())), "externalEmissionsMonitoringPlan"),
            new HashMap<>());

        assertThat(resolved).isEqualTo("shipParticulars[].fuelTypes[]");
    }

    @Test
    void parsePath_companyNature_splitsPropertyAndIndexedCollectionSegments() {
        assertThat(segmentLabels(NullLeafFieldPathResolver.parsePath(
            "shipParticulars[].shipDetails.companyNature")))
            .containsExactly("shipParticulars", "[]", "shipDetails", "companyNature");
    }

    @Test
    void parsePath_bunkerCode_splitsNestedCollectionsAndLeafProperty() {
        assertThat(segmentLabels(NullLeafFieldPathResolver.parsePath(
            "shipParticulars[].fuelTypes[].methodDensityBunkerCode")))
            .containsExactly("shipParticulars", "[]", "fuelTypes", "[]", "methodDensityBunkerCode");
    }

    @Test
    void parsePath_delegatedResponsibilityRegisteredOwners_splitsNestedCollections() {
        assertThat(segmentLabels(NullLeafFieldPathResolver.parsePath(
            "delegatedResponsibility.registeredOwners[].ships[].shipImoNumber")))
            .containsExactly(
                "delegatedResponsibility", "registeredOwners", "[]", "ships", "[]", "shipImoNumber");
    }

    @Test
    void resolve_nonNullRejectedValue_returnsFieldWithoutIndexing() {
        ExternalEmpFuelsAndEmissionsFactors rejectedFuel = validFuelBuilder().build();
        FieldError fieldError = new FieldError(
            "externalEmissionsMonitoringPlan",
            COMPANY_NATURE_FIELD,
            rejectedFuel,
            false,
            new String[] {"NotNull"},
            null,
            "must not be null");

        String resolved = NullLeafFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(planWithShips(shipWithCompanyNature(null)), "externalEmissionsMonitoringPlan"),
            new HashMap<>());

        assertThat(resolved).isEqualTo(COMPANY_NATURE_FIELD);
    }

    private static List<String> segmentLabels(List<NullLeafFieldPathResolver.PathSegment> segments) {
        return segments.stream()
            .map(segment -> segment instanceof NullLeafFieldPathResolver.Property property
                ? property.name()
                : "[]")
            .toList();
    }

    private static void assertResolvedNullLeaf(ExternalEmissionsMonitoringPlan plan, String field, String expectedPath) {
        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(plan, "externalEmissionsMonitoringPlan");
        String resolved = NullLeafFieldPathResolver.resolve(
            notNullFieldError(field), bindingResult, new HashMap<>());
        assertThat(resolved).isEqualTo(expectedPath);
    }

    private static FieldError notNullFieldError(String field) {
        return new FieldError(
            "externalEmissionsMonitoringPlan",
            field,
            null,
            false,
            new String[] {"NotNull"},
            null,
            "must not be null");
    }

    private static ExternalEmpShipEmissions shipWithCompanyNature(ReportingResponsibilityNature companyNature) {
        return shipWithCompanyNature("1234567", companyNature);
    }

    private static ExternalEmpShipEmissions shipWithCompanyNature(String imo,
                                                                  ReportingResponsibilityNature companyNature) {
        return ExternalEmpShipEmissions.builder()
            .shipDetails(ExternalEmpShipDetails.builder()
                .shipImoNumber(imo)
                .name("shipname")
                .shipType(ShipType.BULK)
                .grossTonnage(5000)
                .flag(FlagState.GR)
                .iceClassPolarCode(IceClass.IC)
                .companyNature(companyNature)
                .build())
            .fuelTypes(new LinkedHashSet<>(List.of(validFuelBuilder().build())))
            .build();
    }

    private static ExternalEmpFuelsAndEmissionsFactors.ExternalEmpFuelsAndEmissionsFactorsBuilder validFuelBuilder() {
        return ExternalEmpFuelsAndEmissionsFactors.builder()
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .fuelTypeCode(ExternalFuelType.METHANOL)
            .ttwEFCarbonDioxide(new BigDecimal("1.375"))
            .ttwEFMethane(BigDecimal.ONE)
            .ttwEFNitrousOxide(BigDecimal.ONE)
            .methodDensityBunkerCode(DensityMethodBunker.LABORATORY_TEST)
            .methodDensityTankCode(DensityMethodTank.FUEL_SUPPLIER);
    }

    private static ExternalEmpShipEmissions shipWithFuels(ExternalEmpFuelsAndEmissionsFactors... fuels) {
        return ExternalEmpShipEmissions.builder()
            .shipDetails(ExternalEmpShipDetails.builder()
                .shipImoNumber("1234567")
                .name("shipname")
                .shipType(ShipType.BULK)
                .grossTonnage(5000)
                .flag(FlagState.GR)
                .iceClassPolarCode(IceClass.IC)
                .companyNature(ReportingResponsibilityNature.ISM_COMPANY)
                .build())
            .fuelTypes(new LinkedHashSet<>(List.of(fuels)))
            .build();
    }

    private static ExternalEmissionsMonitoringPlan planWithShips(ExternalEmpShipEmissions... ships) {
        return ExternalEmissionsMonitoringPlan.builder()
            .shipParticulars(new LinkedHashSet<>(List.of(ships)))
            .build();
    }
}
