package uk.gov.mrtm.api.web.controller.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.junit.jupiter.api.Test;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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
import uk.gov.netz.api.common.validation.Violation;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FormValidationViolationMapperTest {

    @Test
    void buildJsonPath_includesIndexesForNestedCollections() {
        List<JsonMappingException.Reference> path = List.of(
            new JsonMappingException.Reference(null, "shipParticulars"),
            new JsonMappingException.Reference(null, 0),
            new JsonMappingException.Reference(null, "fuelTypes"),
            new JsonMappingException.Reference(null, 0),
            new JsonMappingException.Reference(null, "methodDensityBunkerCode"));

        String fieldPath = FormValidationViolationMapper.buildJsonPath(path);

        assertThat(fieldPath).isEqualTo("shipParticulars[0].fuelTypes[0].methodDensityBunkerCode");
    }

    @Test
    void formatInvalidFormatMessage_includesRejectedAndAcceptedEnumValues() throws Exception {
        InvalidFormatException exception = null;
        try {
            new ObjectMapper().readValue("\"INVALID_VALUE\"", ReportingResponsibilityNature.class);
        } catch (InvalidFormatException ex) {
            exception = ex;
        }

        String message = FormValidationViolationMapper.formatInvalidFormatMessage(exception);

        assertThat(message)
            .contains("INVALID_VALUE")
            .contains("SHIPOWNER")
            .contains("ISM_COMPANY");
    }

    @Test
    void fallbackFromHttpMessageNotReadable_returnsControlledGenericViolation() {
        HttpMessageNotReadableException exception =
            new HttpMessageNotReadableException("raw internal parse message");

        Violation[] violations = FormValidationViolationMapper.fallbackFromHttpMessageNotReadable(exception);

        assertThat(violations).hasSize(1);
        assertThat(violations[0].getFieldName()).isEqualTo("requestBody");
        assertThat(violations[0].getMessage()).isEqualTo("Invalid request body value");
    }

    @Test
    void fromHttpMessageNotReadable_invalidEnum_returnsIndexedPathAndAcceptedValues() throws Exception {
        InvalidFormatException invalidFormatException = null;
        try {
            new ObjectMapper().readValue("\"INVALID_BUNKER_CODE\"", DensityMethodBunker.class);
        } catch (InvalidFormatException ex) {
            invalidFormatException = ex;
        }

        HttpMessageNotReadableException exception =
            new HttpMessageNotReadableException("Invalid enum", invalidFormatException);

        var violations = FormValidationViolationMapper.fromHttpMessageNotReadable(exception);

        assertThat(violations).isPresent();
        assertThat(violations.get()).hasSize(1);
        assertThat(violations.get()[0].getMessage())
            .contains("INVALID_BUNKER_CODE")
            .contains("LABORATORY_TEST");
    }

    @Test
    void fallbackFromMethodArgumentNotValid_fieldError_returnsFieldPathAndDefaultMessage() {
        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(new Object(), "externalEmissionsMonitoringPlan");
        bindingResult.addError(new FieldError(
            "externalEmissionsMonitoringPlan",
            "ships[0].imoNumber",
            null,
            false,
            null,
            null,
            "must not be null"));

        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(null, bindingResult);

        Violation[] violations = FormValidationViolationMapper.fallbackFromMethodArgumentNotValid(exception);

        assertThat(violations).hasSize(1);
        assertThat(violations[0].getFieldName()).isEqualTo("ships[0].imoNumber");
        assertThat(violations[0].getMessage()).isEqualTo("must not be null");
    }

    @Test
    void fallbackFromMethodArgumentNotValid_globalError_returnsObjectNameAndDefaultMessage() {
        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(new Object(), "externalEmissionsMonitoringPlan");
        bindingResult.addError(new ObjectError("externalEmissionsMonitoringPlan", "global validation failed"));

        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(null, bindingResult);

        Violation[] violations = FormValidationViolationMapper.fallbackFromMethodArgumentNotValid(exception);

        assertThat(violations).hasSize(1);
        assertThat(violations[0].getFieldName()).isEqualTo("externalEmissionsMonitoringPlan");
        assertThat(violations[0].getMessage()).isEqualTo("global validation failed");
    }

    @Test
    void fallbackFromMethodArgumentNotValid_nullDefaultMessage_returnsNullMessage() {
        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(new Object(), "externalEmissionsMonitoringPlan");
        bindingResult.addError(new FieldError(
            "externalEmissionsMonitoringPlan",
            "ships[0].imoNumber",
            null,
            false,
            null,
            null,
            null));

        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(null, bindingResult);

        Violation[] violations = FormValidationViolationMapper.fallbackFromMethodArgumentNotValid(exception);

        assertThat(violations).hasSize(1);
        assertThat(violations[0].getFieldName()).isEqualTo("ships[0].imoNumber");
        assertThat(violations[0].getMessage()).isNull();
    }

    @Test
    void fallbackFromMethodArgumentNotValid_usesSpringFieldPathsWithoutIndexing() {
        ExternalEmissionsMonitoringPlan plan = ExternalEmissionsMonitoringPlan.builder()
            .shipParticulars(new LinkedHashSet<>(List.of(
                shipWithCompanyNature("1234567", null))))
            .build();

        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(plan, "externalEmissionsMonitoringPlan");
        bindingResult.addError(notNullFieldError("shipParticulars[].shipDetails.companyNature"));

        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(null, bindingResult);

        Violation[] violations = FormValidationViolationMapper.fallbackFromMethodArgumentNotValid(exception);

        assertThat(violations).extracting(Violation::getFieldName)
            .containsExactly("shipParticulars[].shipDetails.companyNature");
    }

    @Test
    void fromMethodArgumentNotValid_spelFuelWithRejectedValue_usesRejectedValueResolver() {
        ExternalEmpFuelsAndEmissionsFactors rejectedFuel = validFuelBuilder()
            .fuelTypeCode(ExternalFuelType.OTHER)
            .otherFuelType(null)
            .build();
        ExternalEmissionsMonitoringPlan plan = ExternalEmissionsMonitoringPlan.builder()
            .shipParticulars(new LinkedHashSet<>(List.of(
                ExternalEmpShipEmissions.builder()
                    .fuelTypes(new LinkedHashSet<>(List.of(rejectedFuel)))
                    .build())))
            .build();

        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(plan, "externalEmissionsMonitoringPlan");
        bindingResult.addError(new FieldError(
            "externalEmissionsMonitoringPlan",
            "shipParticulars[].fuelTypes[]",
            rejectedFuel,
            false,
            new String[] {"SpELExpression"},
            null,
            "constraint message"));

        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        when(exception.getBindingResult()).thenReturn(bindingResult);

        Violation[] violations = FormValidationViolationMapper.fromMethodArgumentNotValid(exception);

        assertThat(violations).hasSize(1);
        assertThat(violations[0].getFieldName()).isEqualTo("shipParticulars[0].fuelTypes[0]");
    }

    @Test
    void fromMethodArgumentNotValid_twoNotNullNullLeaves_usesSharedOccurrenceCounter() {
        ExternalEmissionsMonitoringPlan plan = ExternalEmissionsMonitoringPlan.builder()
            .shipParticulars(new LinkedHashSet<>(List.of(
                shipWithCompanyNature("1234567", null),
                shipWithCompanyNature("7654321", null))))
            .build();

        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(plan, "externalEmissionsMonitoringPlan");
        String field = "shipParticulars[].shipDetails.companyNature";
        bindingResult.addError(notNullFieldError(field));
        bindingResult.addError(notNullFieldError(field));

        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        when(exception.getBindingResult()).thenReturn(bindingResult);

        Violation[] violations = FormValidationViolationMapper.fromMethodArgumentNotValid(exception);

        assertThat(violations).extracting(Violation::getFieldName)
            .containsExactly(
                "shipParticulars[0].shipDetails.companyNature",
                "shipParticulars[1].shipDetails.companyNature");
    }

    @Test
    void fromMethodArgumentNotValid_unresolvableNullLeaf_fallsBackToSpringField() {
        BeanPropertyBindingResult bindingResult =
            new BeanPropertyBindingResult(new ExternalEmissionsMonitoringPlan(), "externalEmissionsMonitoringPlan");
        String field = "shipParticulars[].shipDetails.companyNature";
        bindingResult.addError(notNullFieldError(field));

        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        when(exception.getBindingResult()).thenReturn(bindingResult);

        Violation[] violations = FormValidationViolationMapper.fromMethodArgumentNotValid(exception);

        assertThat(violations).hasSize(1);
        assertThat(violations[0].getFieldName()).isEqualTo(field);
    }

    @Test
    void formatInvalidFormatMessage_includesRejectedAndAcceptedValuesForDensityMethodBunker() throws Exception {
        InvalidFormatException exception = null;
        try {
            new ObjectMapper().readValue("\"TEST\"", DensityMethodBunker.class);
        } catch (InvalidFormatException ex) {
            exception = ex;
        }

        String message = FormValidationViolationMapper.formatInvalidFormatMessage(exception);

        assertThat(message)
            .contains("TEST")
            .contains("LABORATORY_TEST")
            .contains("FUEL_SUPPLIER");
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
}
