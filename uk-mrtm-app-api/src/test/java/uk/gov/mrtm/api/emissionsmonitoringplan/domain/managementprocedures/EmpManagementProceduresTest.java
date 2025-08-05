package uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureFormWithFiles;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

class EmpManagementProceduresTest {

    private Validator validator;

    private static final UUID DOCUMENT_ID = UUID.randomUUID();

    String fixedValue = "defaultValue";

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void when_management_procedures_are_all_null_then_invalid() {
        final EmpManagementProcedures empManagementProcedures = EmpManagementProcedures.builder().build();

        final Set<ConstraintViolation<EmpManagementProcedures>> violations = validator.validate(empManagementProcedures);

        assertEquals(4, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()) || "must not be empty".equals(violation.getMessage()));
    }

    @Test
    void when_management_procedures_are_all_empty_then_invalid() {
        final EmpManagementProcedures empManagementProcedures = EmpManagementProcedures.builder()
                .monitoringReportingRoles(List.of(EmpMonitoringReportingRole.builder().build()))
                .dataFlowActivities(EmpProcedureFormWithFiles.builder().build())
                .riskAssessmentProcedures(EmpProcedureFormWithFiles.builder().build())
                .regularCheckOfAdequacy(EmpProcedureForm.builder().build())
                .build();

        final Set<ConstraintViolation<EmpManagementProcedures>> violations = validator.validate(empManagementProcedures);

        assertEquals(14, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void when_monitoring_reporting_roles_exist_but_empty_then_invalid() {
        final EmpManagementProcedures empManagementProcedures = EmpManagementProcedures.builder()
                .monitoringReportingRoles(createValidEmpMonitoringReportingRoles(null))
                .dataFlowActivities(createValidEmpProcedureFormWithFiles())
                .riskAssessmentProcedures(createValidEmpProcedureFormWithFiles())
                .regularCheckOfAdequacy(createValidEmpProcedureForm())
                .build();

        final Set<ConstraintViolation<EmpManagementProcedures>> violations = validator.validate(empManagementProcedures);

        assertEquals(2, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void when_management_procedures_correct_then_valid() {
        final EmpManagementProcedures empManagementProcedures = EmpManagementProcedures.builder()
                .monitoringReportingRoles(createValidEmpMonitoringReportingRoles(fixedValue))
                .dataFlowActivities(createValidEmpProcedureFormWithFiles())
                .riskAssessmentProcedures(createValidEmpProcedureFormWithFiles())
                .regularCheckOfAdequacy(createValidEmpProcedureForm())
                .build();

        final Set<ConstraintViolation<EmpManagementProcedures>> violations = validator.validate(empManagementProcedures);

        assertEquals(0, violations.size());
    }

    @Test
    void getAttachmentIds() {
        EmpManagementProcedures procedures = EmpManagementProcedures.builder()
                .dataFlowActivities(EmpProcedureFormWithFiles.builder()
                        .description("procedure description")
                        .version("procedure version")
                        .description("procedure description")
                        .responsiblePersonOrPosition("responsible person or position")
                        .recordsLocation("location of records")
                        .itSystemUsed("IT system")
                        .files(Set.of(DOCUMENT_ID))
                        .build())
                .build();

        assertThat(procedures.getAttachmentIds()).containsOnly(DOCUMENT_ID);
    }

    private EmpProcedureForm createValidEmpProcedureForm() {
        return EmpProcedureForm.builder()
                .reference("reference")
                .version("version")
                .description("description")
                .responsiblePersonOrPosition("responsiblePersonOrPosition")
                .recordsLocation("recordsLocation")
                .itSystemUsed("itSystemUsed")
                .build();
    }

    private EmpProcedureFormWithFiles createValidEmpProcedureFormWithFiles() {
        return EmpProcedureFormWithFiles.builder()
                .reference("reference")
                .version("version")
                .description("description")
                .responsiblePersonOrPosition("responsiblePersonOrPosition")
                .recordsLocation("recordsLocation")
                .itSystemUsed("itSystemUsed")
                .files(Set.of(DOCUMENT_ID))
                .build();
    }

    private List<EmpMonitoringReportingRole> createValidEmpMonitoringReportingRoles(String optionalValue) {
        EmpMonitoringReportingRole empMonitoringReportingRole = EmpMonitoringReportingRole.builder()
                .jobTitle(optionalValue)
                .mainDuties(optionalValue)
                .build();
        return List.of(empMonitoringReportingRole);
    }
}
