package uk.gov.mrtm.api.web.controller.exception;

import org.junit.jupiter.api.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpShipEmissions;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;
import uk.gov.mrtm.api.integration.external.RejectedValueFieldPathResolverTestFixtures.TestEntry;
import uk.gov.mrtm.api.integration.external.RejectedValueFieldPathResolverTestFixtures.TestRoot;
import uk.gov.mrtm.api.integration.external.RejectedValueFieldPathResolverTestFixtures.TestStatus;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class RejectedValueFieldPathResolverTest {

    private static final String SHIP_FUEL_TYPES_UNINDEXED_FIELD = "shipParticulars[].fuelTypes[]";
    private static final String ENTRIES_UNINDEXED_FIELD = "entries[]";
    private static final String ENTRIES_STATUS_UNINDEXED_FIELD = "entries[].status";

    @Test
    void resolve_otherFuelTypeSpelError_firstShipFirstFuel_returnsIndexedPath() {
        ExternalEmpFuelsAndEmissionsFactors fuel = validFuelBuilder()
            .fuelTypeCode(ExternalFuelType.OTHER)
            .otherFuelType(null)
            .build();

        ExternalEmissionsMonitoringPlan plan = planWithShips(
            shipWithFuels(fuel));

        assertResolvedPath(plan, fuel, "shipParticulars[0].fuelTypes[0]");
    }

    @Test
    void resolve_otherFuelTypeSpelError_secondFuel_returnsIndexedPath() {
        ExternalEmpFuelsAndEmissionsFactors firstFuel = validFuelBuilder()
            .fuelTypeCode(ExternalFuelType.METHANOL)
            .build();
        ExternalEmpFuelsAndEmissionsFactors secondFuel = validFuelBuilder()
            .fuelTypeCode(ExternalFuelType.OTHER)
            .otherFuelType(null)
            .build();

        ExternalEmissionsMonitoringPlan plan = planWithShips(
            shipWithFuels(firstFuel, secondFuel));

        assertResolvedPath(plan, secondFuel, "shipParticulars[0].fuelTypes[1]");
    }

    @Test
    void resolve_rejectedEntryWithSameEnumStatusOnMultipleEntries_returnsIndexedPath() {
        TestEntry first = testEntry(TestStatus.ACTIVE, "first");
        TestEntry second = testEntry(TestStatus.ACTIVE, "second");
        TestRoot root = testRootWithEntries(first, second);

        assertResolvedPath(root, second, ENTRIES_UNINDEXED_FIELD, "entries[1]");
    }

    @Test
    void resolve_rejectedEnumNotInGraph_fallsBackToSpringField() {
        TestRoot root = testRootWithEntries(testEntry(TestStatus.ACTIVE, "only"));

        FieldError fieldError = new FieldError(
            "testRoot",
            ENTRIES_STATUS_UNINDEXED_FIELD,
            TestStatus.INACTIVE,
            false,
            null,
            null,
            "constraint message");

        String resolved = RejectedValueFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(root, "testRoot"));

        assertThat(resolved).isEqualTo(ENTRIES_STATUS_UNINDEXED_FIELD);
    }

    @Test
    void resolve_otherFuelTypeSpelError_secondShip_returnsIndexedPath() {
        ExternalEmpFuelsAndEmissionsFactors firstShipFuel = validFuelBuilder()
            .fuelTypeCode(ExternalFuelType.METHANOL)
            .build();
        ExternalEmpFuelsAndEmissionsFactors secondShipFuel = validFuelBuilder()
            .fuelTypeCode(ExternalFuelType.OTHER)
            .otherFuelType(null)
            .build();

        ExternalEmissionsMonitoringPlan plan = planWithShips(
            shipWithFuels(firstShipFuel),
            shipWithFuels(secondShipFuel));

        assertResolvedPath(plan, secondShipFuel, "shipParticulars[1].fuelTypes[0]");
    }

    @Test
    void resolve_fieldWithoutCollectionNotation_returnsFieldUnchanged() {
        FieldError fieldError = new FieldError(
            "externalEmissionsMonitoringPlan",
            "shipParticulars[].shipDetails.companyNature",
            null,
            false,
            null,
            null,
            "must not be null");

        String resolved = RejectedValueFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(new ExternalEmissionsMonitoringPlan(), "externalEmissionsMonitoringPlan"));

        assertThat(resolved).isEqualTo("shipParticulars[].shipDetails.companyNature");
    }

    @Test
    void resolve_rejectedValueNotInGraph_fallsBackToSpringField() {
        FieldError fieldError = new FieldError(
            "externalEmissionsMonitoringPlan",
            SHIP_FUEL_TYPES_UNINDEXED_FIELD,
            "not-in-graph",
            false,
            null,
            null,
            "message");

        String resolved = RejectedValueFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(new ExternalEmissionsMonitoringPlan(), "externalEmissionsMonitoringPlan"));

        assertThat(resolved).isEqualTo(SHIP_FUEL_TYPES_UNINDEXED_FIELD);
    }

    @Test
    void resolve_nullTarget_returnsFieldUnchanged() {
        ExternalEmpFuelsAndEmissionsFactors rejectedFuel = validFuelBuilder()
            .fuelTypeCode(ExternalFuelType.OTHER)
            .otherFuelType(null)
            .build();

        FieldError fieldError = new FieldError(
            "externalEmissionsMonitoringPlan",
            SHIP_FUEL_TYPES_UNINDEXED_FIELD,
            rejectedFuel,
            false,
            null,
            null,
            "message");

        String resolved = RejectedValueFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(null, "externalEmissionsMonitoringPlan"));

        assertThat(resolved).isEqualTo(SHIP_FUEL_TYPES_UNINDEXED_FIELD);
    }

    @Test
    void resolve_nullRejectedValue_fallsBackToSpringField() {
        FieldError fieldError = new FieldError(
            "externalEmissionsMonitoringPlan",
            SHIP_FUEL_TYPES_UNINDEXED_FIELD,
            null,
            false,
            null,
            null,
            "message");

        String resolved = RejectedValueFieldPathResolver.resolve(
            fieldError,
            new BeanPropertyBindingResult(new ExternalEmissionsMonitoringPlan(), "externalEmissionsMonitoringPlan"));

        assertThat(resolved).isEqualTo(SHIP_FUEL_TYPES_UNINDEXED_FIELD);
    }

    private static void assertResolvedPath(ExternalEmissionsMonitoringPlan plan,
                                           ExternalEmpFuelsAndEmissionsFactors rejectedFuel,
                                           String expectedPath) {
        assertResolvedPath(plan, rejectedFuel, SHIP_FUEL_TYPES_UNINDEXED_FIELD, expectedPath);
    }

    private static void assertResolvedPath(Object target,
                                           Object rejectedValue,
                                           String field,
                                           String expectedPath) {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(target, "target");
        FieldError fieldError = new FieldError(
            "target",
            field,
            rejectedValue,
            false,
            null,
            null,
            "constraint message");

        String resolved = RejectedValueFieldPathResolver.resolve(fieldError, bindingResult);

        assertThat(resolved).isEqualTo(expectedPath);
    }

    private static TestRoot testRootWithEntries(TestEntry... entries) {
        TestRoot root = new TestRoot();
        root.setEntries(new LinkedHashSet<>(List.of(entries)));
        return root;
    }

    private static TestEntry testEntry(TestStatus status, String marker) {
        TestEntry entry = new TestEntry();
        entry.setStatus(status);
        entry.setMarker(marker);
        return entry;
    }

    private static ExternalEmpFuelsAndEmissionsFactors.ExternalEmpFuelsAndEmissionsFactorsBuilder validFuelBuilder() {
        return ExternalEmpFuelsAndEmissionsFactors.builder()
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .ttwEFCarbonDioxide(new BigDecimal("1.375"))
            .ttwEFMethane(BigDecimal.ONE)
            .ttwEFNitrousOxide(BigDecimal.ONE)
            .methodDensityBunkerCode(DensityMethodBunker.LABORATORY_TEST)
            .methodDensityTankCode(DensityMethodTank.FUEL_SUPPLIER);
    }

    private static ExternalEmpShipEmissions shipWithFuels(ExternalEmpFuelsAndEmissionsFactors... fuels) {
        return ExternalEmpShipEmissions.builder()
            .fuelTypes(new LinkedHashSet<>(List.of(fuels)))
            .build();
    }

    private static ExternalEmissionsMonitoringPlan planWithShips(ExternalEmpShipEmissions... ships) {
        return ExternalEmissionsMonitoringPlan.builder()
            .shipParticulars(new LinkedHashSet<>(List.of(ships)))
            .build();
    }
}
