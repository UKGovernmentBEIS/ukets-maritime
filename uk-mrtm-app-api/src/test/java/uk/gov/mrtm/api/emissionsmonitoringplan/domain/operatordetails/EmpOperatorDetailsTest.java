package uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;

import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpOperatorDetailsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_limited_company_valid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(LimitedCompanyOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                        .registrationNumber("registration number")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .evidenceFiles(Set.of(UUID.randomUUID()))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_limited_company_no_registration_number_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
            .operatorName("operator name")
            .imoNumber("testImo")
            .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
            .organisationStructure(LimitedCompanyOrganisation.builder()
                .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                .evidenceFiles(Set.of(UUID.randomUUID()))
                .build())
            .activityDescription("testDesc")
            .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_limited_company_no_registered_address_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(LimitedCompanyOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                        .registrationNumber("registration number")
                        .evidenceFiles(Set.of(UUID.randomUUID()))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_limited_company_no_evidence_valid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(LimitedCompanyOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                        .registrationNumber("registration number")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .evidenceFiles(Set.of())
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(0, violations.size());
    }
    @Test
    void validate_individual_valid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(IndividualOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.INDIVIDUAL)
                        .fullName("full name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_individual_no_full_name_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(IndividualOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.INDIVIDUAL)
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .build())
                .activityDescription("testDesc")
                .build();

        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_individual_no_registered_address_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(IndividualOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.INDIVIDUAL)
                        .fullName("full name")
                        .build())
                .activityDescription("testDesc")
                .build();

        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_individual_no_legal_status_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(IndividualOrganisation.builder()
                        .fullName("full name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_partnership_valid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_partnership_no_name_valid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_partnership_no_registered_address_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_partnership_no_partners_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be empty".equals(violation.getMessage()));
    }

    @Test
    void validate_partnership_blank_partner_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .partners(Set.of("partner1", ""))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_no_operator_name_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_no_imo_number_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    @Test
    void validate_no_contact_address_fields_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_optional_contact_address_fields_valid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO(null, null, null))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress("line2", "state", "postcode"))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(0, violations.size());
    }

    @Test
    void validate_optional_registered_address_fields_valid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress(null, null, null))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .activityDescription("testDesc")
                .build();
        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(0, violations.size());
    }
    @Test
    void validate_organisation_structure_null_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .activityDescription("testDesc")
                .build();

        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be null".equals(violation.getMessage()));
    }

    @Test
    void validate_no_activity_description_invalid() {
        final EmpOperatorDetails operatorDetails = EmpOperatorDetails.builder()
                .operatorName("operator name")
                .imoNumber("testImo")
                .contactAddress(createContactAddressDTO("line2", "state", "postcode"))
                .organisationStructure(PartnershipOrganisation.builder()
                        .legalStatusType(OrganisationLegalStatusType.PARTNERSHIP)
                        .partnershipName("partnership name")
                        .registeredAddress(createRegisteredAddress(null, null, null))
                        .partners(Set.of("partner1", "partner2"))
                        .build())
                .build();

        final Set<ConstraintViolation<EmpOperatorDetails>> violations = validator.validate(operatorDetails);

        assertEquals(1, violations.size());
        assertThat(violations).allMatch(violation -> "must not be blank".equals(violation.getMessage()));
    }

    private AddressStateDTO createContactAddressDTO(String line2, String state, String postcode) {
        return AddressStateDTO.builder()
                .line1("line1")
                .line2(line2)
                .city("city")
                .country("GR")
                .state(state)
                .postcode(postcode)
                .build();
    }

    private AddressStateDTO createRegisteredAddress(String line2, String state, String postcode) {
        return AddressStateDTO.builder()
                .line1("line1")
                .line2(line2)
                .city("city")
                .country("GR")
                .state(state)
                .postcode(postcode)
                .build();
    }
}
