package uk.gov.mrtm.api.integration.registry.setoperator.validate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.registry.common.RegistryCompetentAuthorityEnum;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;

import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SetOperatorRequestValidatorTest {

    @InjectMocks
    private SetOperatorRequestValidator validator;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Test
    void test_no_errors() {
        String emitterId = "1";
        long operatorId = 1234567L;
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .emitterId(emitterId)
            .regulator(RegistryCompetentAuthorityEnum.EA.name())
            .operatorId(operatorId)
            .build();

        when(mrtmAccountQueryService.findByBusinessId(emitterId)).thenReturn(MrtmAccount.builder().build());
        List<IntegrationEventErrorDetails > errors = validator.validate(event);

        assertEquals(0, errors.size());

        verify(mrtmAccountQueryService).findByBusinessId(emitterId);
        verifyNoMoreInteractions(mrtmAccountQueryService);
    }

    @ParameterizedTest
    @MethodSource("blankOrNullStrings")
    void test_ERROR_0201_emitter_id(String operatorId) {
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .emitterId(operatorId)
            .regulator(RegistryCompetentAuthorityEnum.EA.name())
            .operatorId(1234567L)
            .build();

        List<IntegrationEventErrorDetails> errors = validator.validate(event);

        assertEquals(1, errors.size());
        assertEquals(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0201, "Emitter Id"), errors.getFirst());

        verifyNoInteractions(mrtmAccountQueryService);
    }

    @ParameterizedTest
    @MethodSource("blankOrNullStrings")
    void test_ERROR_0201_regulator_authority(String regulator) {
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .emitterId("1")
            .regulator(regulator)
            .operatorId(1234567L)
            .build();

        List<IntegrationEventErrorDetails> errors = validator.validate(event);

        assertEquals(1, errors.size());
        assertEquals(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0201, "Regulator authority"), errors.getFirst());

        verifyNoInteractions(mrtmAccountQueryService);
    }

    static Stream<String> blankOrNullStrings() {
        return Stream.of("", null);
    }

    @ParameterizedTest
    @MethodSource("invalidOperatorIdScenarios")
    void test_ERROR_0201_regulator_authority(Long regulator) {
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .emitterId("1")
            .regulator(RegistryCompetentAuthorityEnum.EA.name())
            .operatorId(regulator)
            .build();

        List<IntegrationEventErrorDetails> errors = validator.validate(event);

        assertEquals(1, errors.size());
        assertEquals(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0201, "Operator Id"), errors.getFirst());

        verifyNoInteractions(mrtmAccountQueryService);
    }

    public static Stream<Long> invalidOperatorIdScenarios() {
        return Stream.of(1L, 12L, 123L, 1234L, 12345L, 123456L, 12345678L, null);
    }

    @Test
    void test_ERROR_0202() {
        String emitterId = "1";
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .emitterId(emitterId)
            .regulator(RegistryCompetentAuthorityEnum.EA.name())
            .operatorId(1234567L)
            .build();

        List<IntegrationEventErrorDetails > errors = validator.validate(event);

        assertEquals(1, errors.size());
        assertEquals(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0202, emitterId), errors.getFirst());
        verify(mrtmAccountQueryService).findByBusinessId(emitterId);

        verifyNoMoreInteractions(mrtmAccountQueryService);
    }

    @Test
    void test_ERROR_0203() {
        String emitterId = "1";
        long operatorId = 1234567L;
        OperatorUpdateEvent event = OperatorUpdateEvent.builder()
            .emitterId(emitterId)
            .regulator(RegistryCompetentAuthorityEnum.EA.name())
            .operatorId(operatorId)
            .build();

        when(mrtmAccountQueryService.findByBusinessId(emitterId)).thenReturn(MrtmAccount.builder().registryId(321).build());
        List<IntegrationEventErrorDetails > errors = validator.validate(event);

        assertEquals(1, errors.size());
        assertEquals(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0203, String.valueOf(operatorId)), errors.getFirst());
        verify(mrtmAccountQueryService).findByBusinessId(emitterId);

        verifyNoMoreInteractions(mrtmAccountQueryService);
    }
}