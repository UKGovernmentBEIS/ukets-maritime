package uk.gov.mrtm.api.emissionsmonitoringplan.domain.greenhousegas;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas.EmpMonitoringGreenhouseGas;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpMonitoringGreenhouseGasTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_greenhouse_gas_valid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_greenhouse_gas_no_fuel_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_greenhouse_gas_no_crosschecks_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_greenhouse_gas_no_information_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_greenhouse_gas_no_qaequipment_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_greenhouse_gas_no_voyages_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_emp_procedure_form_no_reference_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("", "version", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(5, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_emp_procedure_form_no_version_valid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "", "description", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_emp_procedure_form_no_description_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "", "responsiblePersonOrPosition", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(5, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_emp_procedure_form_no_responsible_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "", "recordsLocation", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "", "recordsLocation", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "description", "", "recordsLocation", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "", "recordsLocation", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "", "recordsLocation", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(5, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_emp_procedure_form_no_records_location_invalid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "", "itSystemUsed"))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "", "itSystemUsed"))
                .information(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "", "itSystemUsed"))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "", "itSystemUsed"))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "", "itSystemUsed"))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(5, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_emp_procedure_form_no_it_system_valid() {
        final EmpMonitoringGreenhouseGas empMonitoringGreenhouseGas = EmpMonitoringGreenhouseGas.builder()
                .fuel(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", ""))
                .crossChecks(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", ""))
                .information(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", ""))
                .qaEquipment(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", ""))
                .voyages(createValidEmpProcedureForm("reference", "version", "description", "responsiblePersonOrPosition", "recordsLocation", ""))
                .build();

        final Set<ConstraintViolation<EmpMonitoringGreenhouseGas>> violations = validator.validate(empMonitoringGreenhouseGas);

        assertEquals(0, violations.size());
    }
    
    private EmpProcedureForm createValidEmpProcedureForm(String reference, String version, String description, String responsiblePersonOrPosition,
                                                         String recordsLocation, String itSystemUsed) {
        return EmpProcedureForm.builder()
                .reference(reference)
                .version(version)
                .description(description)
                .responsiblePersonOrPosition(responsiblePersonOrPosition)
                .recordsLocation(recordsLocation)
                .itSystemUsed(itSystemUsed)
                .build();
    }
}
