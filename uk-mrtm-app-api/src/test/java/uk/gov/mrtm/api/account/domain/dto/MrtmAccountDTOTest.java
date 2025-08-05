package uk.gov.mrtm.api.account.domain.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class MrtmAccountDTOTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void valid() {
        final MrtmAccountDTO mrtmAccountDTO = MrtmAccountDTO.builder()
            .imoNumber("1234567")
            .name("name")
            .address(AddressStateDTO.builder().line1("line1").city("city").country("country").postcode("postcode").build())
            .firstMaritimeActivityDate(LocalDate.of(2026, 1, 1))
            .build();

        final Set<ConstraintViolation<MrtmAccountDTO>> violations = validator.validate(mrtmAccountDTO);

        assertEquals(0, violations.size());
    }
}